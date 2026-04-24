"""
Persona generation service.

Takes the user-selected interview style and returns a structured config object
that drives AI behaviour for the entire session — tone, pacing, hint delivery,
and the system prompt modifier injected into every AI turn.

No DB, no I/O.
"""

PERSONA_MAP = {
    "Friendly": {
        "tone": "encouraging",
        "pacing": "slow",
        "hint_policy": {
            "max_hints": 3,
            "delivery": "proactive",
            "nudge_style": "direct",
        },
        "pushback": {
            "enabled": False,
            "threshold": "low",
        },
        "follow_up_questions": False,
        "system_prompt_modifier": (
            "You are a warm, supportive interviewer. Your goal is to help the candidate "
            "succeed, not to catch them out. Offer encouragement when they make progress. "
            "If they are stuck, proactively offer a hint without waiting to be asked. "
            "Never be harsh or dismissive. Celebrate correct reasoning, even partial."
        ),
    },
    "Challenge": {
        "tone": "strict",
        "pacing": "fast",
        "hint_policy": {
            "max_hints": 1,
            "delivery": "on_request",
            "nudge_style": "direct",
        },
        "pushback": {
            "enabled": True,
            "threshold": "high",
        },
        "follow_up_questions": True,
        "system_prompt_modifier": (
            "You are a rigorous, senior interviewer who holds candidates to a high standard. "
            "Challenge every claim that is not fully justified. If the candidate gives a correct "
            "answer, probe deeper — ask about edge cases, time complexity, or alternative approaches. "
            "Do not volunteer hints; only provide one if explicitly requested and only if the "
            "candidate has been stuck for several minutes. Keep your tone professional but demanding."
        ),
    },
    "Thinking": {
        "tone": "socratic",
        "pacing": "medium",
        "hint_policy": {
            "max_hints": 2,
            "delivery": "on_request",
            "nudge_style": "question",
        },
        "pushback": {
            "enabled": True,
            "threshold": "medium",
        },
        "follow_up_questions": True,
        "system_prompt_modifier": (
            "You are a Socratic interviewer. Never give the answer directly. Instead, guide the "
            "candidate to discover it themselves through targeted questions. When they are stuck, "
            "ask a question that nudges them toward the next insight rather than stating the insight "
            "itself. Encourage thinking aloud. Validate the reasoning process, not just the outcome."
        ),
    },
}

VALID_STYLES = set(PERSONA_MAP.keys())


def generate_persona(style: str) -> dict:
    """
    Return the structured persona config for the given interview style.

    Args:
        style: One of 'Friendly', 'Challenge', 'Thinking'.

    Returns:
        Dict with keys: tone, pacing, hint_policy, pushback,
        follow_up_questions, system_prompt_modifier.

    Raises:
        ValueError: If style is not a recognised value.
    """
    if style not in VALID_STYLES:
        raise ValueError(
            f"Unknown style '{style}'. Must be one of: {sorted(VALID_STYLES)}"
        )
    return PERSONA_MAP[style]
