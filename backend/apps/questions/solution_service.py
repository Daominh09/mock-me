"""
Solution generation service.

Calls OpenAI with a strict JSON schema so every response is machine-readable
and structurally identical — safe to parse downstream without guessing.

Each call produces 1–3 solutions ordered from brute-force to optimal,
with trade-off comparisons between adjacent pairs.

Responses are cached in Redis (24 h) keyed by (slug, language) because:
  - Generation is expensive (~3–5 s per call)
  - Question content never changes once seeded
"""

import json
import logging

from django.conf import settings
from django.core.cache import cache
from openai import OpenAI

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


# ── JSON Schema ────────────────────────────────────────────────────────────────
# Strict mode requires:
#   • additionalProperties: false at every object level
#   • every property listed in required
#   • no unsupported keywords (e.g. minItems)

_SOLUTION_ITEM_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Short label e.g. 'Brute Force', 'Better', 'Optimal'",
        },
        "approach": {
            "type": "string",
            "description": "Plain-English description of the algorithm",
        },
        "approach_intuition": {
            "type": "string",
            "description": (
                "How a candidate would naturally arrive at this approach "
                "starting from the problem statement — the chain of reasoning, "
                "not just the result"
            ),
        },
        "time_complexity": {"type": "string"},
        "space_complexity": {"type": "string"},
        "code": {"type": "string"},
    },
    "required": [
        "name",
        "approach",
        "approach_intuition",
        "time_complexity",
        "space_complexity",
        "code",
    ],
    "additionalProperties": False,
}

_TRADE_OFF_SCHEMA = {
    "type": "object",
    "properties": {
        "from_solution": {
            "type": "string",
            "description": "Name of the simpler solution being compared",
        },
        "to_solution": {
            "type": "string",
            "description": "Name of the more optimized solution being compared",
        },
        "trade_off": {
            "type": "string",
            "description": (
                "What you gain and what you give up moving from the simpler "
                "to the more optimized solution — include concrete scenarios "
                "where the simpler approach is still preferable"
            ),
        },
    },
    "required": ["from_solution", "to_solution", "trade_off"],
    "additionalProperties": False,
}

_HINT_SCHEMA = {
    "type": "object",
    "properties": {
        "level": {"type": "integer"},
        "hint": {"type": "string"},
    },
    "required": ["level", "hint"],
    "additionalProperties": False,
}

_TEST_CASE_SCHEMA = {
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "description": "'simple' or 'edge'",
        },
        "input": {
            "type": "string",
            "description": (
                "The raw input as it would be passed to the function, "
                "e.g. 'nums = [2, 7, 11, 15], target = 9'"
            ),
        },
        "expected_output": {
            "type": "string",
            "description": "The exact expected return value, e.g. '[0, 1]'",
        },
        "explanation": {
            "type": "string",
            "description": "Why this input produces this output",
        },
    },
    "required": ["type", "input", "expected_output", "explanation"],
    "additionalProperties": False,
}

SOLUTION_SCHEMA = {
    "type": "object",
    "properties": {
        "solutions": {
            "type": "array",
            "description": (
                "1 to 3 solutions ordered from simplest (brute force) to most "
                "optimized. Use 1 solution only if there is genuinely no better "
                "approach. Use 3 when there is a clear intermediate step."
            ),
            "items": _SOLUTION_ITEM_SCHEMA,
        },
        "trade_offs": {
            "type": "array",
            "description": (
                "One entry per adjacent pair of solutions. "
                "If there are N solutions, there are N-1 trade-off entries."
            ),
            "items": _TRADE_OFF_SCHEMA,
        },
        "hint_ladder": {
            "type": "array",
            "description": "Exactly 3 hints ordered by how much they reveal",
            "items": _HINT_SCHEMA,
        },
        "test_cases": {
            "type": "array",
            "description": (
                "Exactly 6 test cases: 3 simple and 3 edge cases. "
                "Simple cases cover the normal happy path. "
                "Edge cases cover boundary conditions, empty inputs, "
                "single-element inputs, negatives, duplicates, or worst-case sizes."
            ),
            "items": _TEST_CASE_SCHEMA,
        },
    },
    "required": ["solutions", "trade_offs", "hint_ladder", "test_cases"],
    "additionalProperties": False,
}

_CACHE_TTL = 60 * 60 * 24  # 24 hours


def _cache_key(slug: str, language: str) -> str:
    return f"solution:{slug}:{language}"


def _build_prompt(question, language: str) -> str:
    return f"""You are an expert software engineer and coding interview coach.

Analyze the following coding problem and produce a complete structured solution guide in {language}.

**Title:** {question.title}
**Difficulty:** {question.difficulty}

**Problem Description:**
{question.description}

**Constraints:**
{question.constraints}

**Examples:**
{json.dumps(question.examples, indent=2)}

## Output rules

### solutions (1–3 entries, ordered simplest → optimal)
- Always start with the naive brute-force solution.
- Add a middle-ground solution only if it represents a meaningfully different algorithmic idea (not just a micro-optimisation).
- Add an optimal solution when it is genuinely better than the previous one.
- For each solution include:
  - name: a short label ("Brute Force" / "Better" / "Optimal")
  - approach: plain-English algorithm description
  - approach_intuition: the chain of reasoning a candidate would follow to *arrive* at this approach from scratch — what pattern in the problem hints at it, what they would try first, what insight unlocks it. This is not a restatement of the approach; it is the thought process.
  - time_complexity and space_complexity in Big-O notation
  - code: correct, runnable {language} code

### trade_offs (one entry per adjacent solution pair)
- Explain concretely what is gained and what is sacrificed moving from the simpler to the more optimised solution.
- Include at least one realistic scenario where sticking with the simpler approach is the right call.

### hint_ladder (exactly 3 entries)
- level 1 — a vague nudge (e.g. which data structure or pattern family to think about)
- level 2 — the key insight without revealing the solution
- level 3 — the near-complete approach, stopping just before writing code

### test_cases (exactly 6 entries: 3 simple, 3 edge)
- type: "simple" for normal inputs, "edge" for boundary/corner cases
- input: the exact arguments as you would call the function, e.g. `nums = [2, 7, 11, 15], target = 9`
- expected_output: the exact return value the correct solution must produce, e.g. `[0, 1]`
- explanation: one sentence explaining why this input gives this output

Simple cases should cover the straightforward happy path with typical inputs.
Edge cases must cover at least some of: empty input, single element, all-duplicate values,
negative numbers, minimum/maximum constraint values, no valid answer exists.

All code must be syntactically correct and runnable {language}."""


def generate_solution(question, language: str = "python") -> dict:
    """
    Return a structured solution guide for *question*.

    Returns a dict matching SOLUTION_SCHEMA:
        solutions   — list of 1–3 dicts (name, approach, approach_intuition,
                       time_complexity, space_complexity, code)
        trade_offs  — list of N-1 dicts comparing adjacent solution pairs
        hint_ladder — list of 3 dicts (level, hint)
        test_cases  — list of 6 dicts (type, input, expected_output, explanation);
                       3 simple + 3 edge cases, stored for future use

    Results are cached in Redis for 24 hours per (slug, language) pair.

    Raises:
        openai.OpenAIError on API failures
    """
    language = language.lower().strip()
    key = _cache_key(question.slug, language)

    cached = cache.get(key)
    if cached is not None:
        logger.debug("solution cache hit: %s / %s", question.slug, language)
        return cached

    logger.info("generating solution for %s (%s)", question.slug, language)

    response = _get_client().chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[{"role": "user", "content": _build_prompt(question, language)}],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "solution_analysis",
                "strict": True,
                "schema": SOLUTION_SCHEMA,
            },
        },
        temperature=0.2,
    )

    result = json.loads(response.choices[0].message.content)
    cache.set(key, result, timeout=_CACHE_TTL)
    return result
