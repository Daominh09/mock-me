"""
LeetCode Company-wise Scraper
------------------------------
1. Reads company folders from the locally cloned repo in data/
2. For each company, parses all.csv to get problem slugs
3. Builds a slug → [company, ...] map
4. Fetches full problem details from LeetCode GraphQL API
5. Saves to data/leetcode_problems.json in the Question model shape

Setup:
    cd data && git clone https://github.com/snehasishroy/leetcode-companywise-interview-questions

Usage:
    python scrape.py

.env file:
    LEETCODE_SESSION=eyJ0eXAiOiJKV1Q...
    CSRF_TOKEN=abc123xyz...
"""

import csv
import json
import os
import random
import re
import time

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────

# Path to the locally cloned repo inside data/
REPO_DIR        = "data/leetcode-companywise-interview-questions"

GRAPHQL_URL     = "https://leetcode.com/graphql"
OUTPUT_FILE     = "data/leetcode_problems.json"
CHECKPOINT_FILE = "data/checkpoint.json"

LEETCODE_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://leetcode.com",
    "Cookie": (
        f"LEETCODE_SESSION={os.getenv('LEETCODE_SESSION')}; "
        f"csrftoken={os.getenv('CSRF_TOKEN')}"
    ),
    "x-csrftoken": os.getenv("CSRF_TOKEN"),
}


# ── Local repo readers ────────────────────────────────────────────────────────

def get_company_folders() -> list:
    """Return list of company folder names from the local cloned repo."""
    if not os.path.exists(REPO_DIR):
        print(f"ERROR: Repo not found at '{REPO_DIR}'")
        print(f"  Run: cd data && git clone https://github.com/snehasishroy/leetcode-companywise-interview-questions")
        exit(1)

    folders = [
        name for name in os.listdir(REPO_DIR)
        if os.path.isdir(os.path.join(REPO_DIR, name))
        and not name.startswith(".")   # skip .git etc
    ]
    return sorted(folders)


def get_slugs_for_company(company: str) -> list:
    """
    Read all.csv for a company and return list of titleSlugs.
    URL column looks like: https://leetcode.com/problems/two-sum
    """
    csv_path = os.path.join(REPO_DIR, company, "all.csv")
    if not os.path.exists(csv_path):
        return []

    slugs = []
    try:
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                problem_url = row.get("URL", "").strip()
                if "/problems/" in problem_url:
                    slug = problem_url.split("/problems/")[1].strip("/")
                    if slug:
                        slugs.append(slug)
    except Exception as e:
        print(f"  Warning: Could not read {csv_path}: {e}")

    return slugs


# ── LeetCode GraphQL ──────────────────────────────────────────────────────────

def safe_post(payload, retries=4):
    """POST to LeetCode GraphQL with retry + backoff."""
    for attempt in range(retries):
        try:
            res = requests.post(
                GRAPHQL_URL,
                json=payload,
                headers=LEETCODE_HEADERS,
                timeout=15
            )
            if res.status_code == 200:
                return res.json()
            elif res.status_code == 429:
                wait = 60 * (attempt + 1)
                print(f"  Rate limited. Waiting {wait}s...")
                time.sleep(wait)
            elif res.status_code == 403:
                print("  403 Forbidden - session cookie expired. Update .env and restart.")
                return None
            elif res.status_code == 400:
                print(f"  400 Bad Request: {res.text[:200]}")
                return None
            else:
                print(f"  HTTP {res.status_code}. Retrying in 5s...")
                time.sleep(5)
        except requests.exceptions.RequestException as e:
            print(f"  Request error: {e}. Retrying in 5s...")
            time.sleep(5)
    return None


def fetch_problem_detail(slug: str):
    """Fetch full problem detail from LeetCode GraphQL."""
    data = safe_post({
        "query": """
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            difficulty
            content
            topicTags { name }
            codeSnippets { langSlug code }
            exampleTestcases
            hints
          }
        }
        """,
        "variables": {"titleSlug": slug}
    })
    if data and data.get("data", {}).get("question"):
        return data["data"]["question"]
    return None


# ── HTML parsers ──────────────────────────────────────────────────────────────

def extract_description(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all("pre"):
        tag.decompose()
    text = soup.get_text(separator="\n").strip()
    for marker in ["Constraints:", "Example 1", "Follow-up:"]:
        if marker in text:
            text = text[:text.index(marker)].strip()
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def extract_constraints(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all(["p", "strong"]):
        if "constraints" in tag.get_text().lower():
            nxt = tag.find_next("ul")
            if nxt:
                return "\n".join(li.get_text().strip() for li in nxt.find_all("li"))
    return ""


def extract_examples(html: str) -> list:
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")
    examples = []
    for pre in soup.find_all("pre"):
        text = pre.get_text("\n").strip()
        example = {"input": "", "output": "", "explanation": ""}
        for line in text.split("\n"):
            line = line.strip()
            low  = line.lower()
            if low.startswith("input:"):
                example["input"] = line[6:].strip()
            elif low.startswith("output:"):
                example["output"] = line[7:].strip()
            elif low.startswith("explanation:"):
                example["explanation"] = line[12:].strip()
        if example["input"] or example["output"]:
            examples.append(example)
    return examples


def extract_starter_code(snippets: list) -> dict:
    for snippet in (snippets or []):
        if snippet.get("langSlug") == "python3":
            return {"python": snippet["code"]}
    return {"python": "class Solution:\n    pass"}


# ── Transform ─────────────────────────────────────────────────────────────────

def transform(raw: dict, company_tags: list) -> dict:
    """Map raw LeetCode response to Question model shape."""
    html = raw.get("content") or ""
    leetcode_number = int(
        raw.get("questionFrontendId")
        or raw.get("questionId")
        or 0
    )
    return {
        "title":           raw["title"],
        "slug":            raw["titleSlug"],
        "leetcode_number": leetcode_number,
        "difficulty":      raw["difficulty"].lower(),
        "description":     extract_description(html),
        "constraints":     extract_constraints(html),
        "examples":        extract_examples(html),
        "starter_code":    extract_starter_code(raw.get("codeSnippets", [])),
        "topic_tags": [
            t["name"].lower().replace(" ", "-")
            for t in raw.get("topicTags", [])
        ],
        "company_tags": company_tags,
    }


# ── Checkpoint ────────────────────────────────────────────────────────────────

def load_checkpoint() -> dict:
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {"fetched_slugs": [], "problems": []}


def save_checkpoint(fetched_slugs: list, problems: list):
    os.makedirs("data", exist_ok=True)
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump({"fetched_slugs": fetched_slugs, "problems": problems}, f)


# ── Main ──────────────────────────────────────────────────────────────────────

def scrape():
    os.makedirs("data", exist_ok=True)

    checkpoint   = load_checkpoint()
    already_done = set(checkpoint["fetched_slugs"])
    problems     = checkpoint["problems"]

    # ── Phase 1: build slug → [companies] map from local CSVs ───────────────
    print("\n── Phase 1: Reading company CSVs from local repo ──")
    print(f"  Repo path: {REPO_DIR}\n")

    slug_to_companies = {}
    companies = get_company_folders()
    print(f"  Found {len(companies)} companies\n")

    for i, company in enumerate(companies):
        slugs = get_slugs_for_company(company)
        for slug in slugs:
            slug_to_companies.setdefault(slug, [])
            if company not in slug_to_companies[slug]:
                slug_to_companies[slug].append(company)
        print(f"  [{i+1}/{len(companies)}] {company:<40} {len(slugs)} problems")

    all_slugs = list(slug_to_companies.keys())
    print(f"\n  Unique problems across all companies: {len(all_slugs)}")

    # ── Phase 2: fetch problem details from LeetCode ─────────────────────────
    print("\n── Phase 2: Fetching problem details from LeetCode ──")
    remaining = [s for s in all_slugs if s not in already_done]
    print(f"  Already done : {len(already_done)}")
    print(f"  Remaining    : {len(remaining)}\n")

    for i, slug in enumerate(remaining):
        company_tags = slug_to_companies.get(slug, [])
        preview = ", ".join(company_tags[:3])
        if len(company_tags) > 3:
            preview += f" +{len(company_tags) - 3} more"
        print(f"  [{i+1}/{len(remaining)}] {slug:<60} [{preview}]")

        raw = fetch_problem_detail(slug)

        if raw:
            problem = transform(raw, company_tags)
            problems.append(problem)
            already_done.add(slug)
        else:
            print(f"  Skipped {slug} (no data returned)")

        # Save checkpoint every 50 problems
        if (i + 1) % 50 == 0:
            save_checkpoint(list(already_done), problems)
            print(f"\n  Checkpoint saved ({len(problems)} problems)\n")

        time.sleep(random.uniform(1.5, 2.5))   # ~30 req/min

    # ── Phase 3: write final JSON ─────────────────────────────────────────────
    with open(OUTPUT_FILE, "w") as f:
        json.dump(problems, f, indent=2, ensure_ascii=False)

    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)

    print(f"\n✅ Done! {len(problems)} problems saved to {OUTPUT_FILE}")
    print("Next: docker compose exec backend python manage.py seed_questions")


if __name__ == "__main__":
    scrape()