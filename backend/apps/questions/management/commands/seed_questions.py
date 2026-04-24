"""
Seed the database from a structured JSON file.

Usage:
    python manage.py seed_questions --file data/leetcode_problems.json
    python manage.py seed_questions --file data/leetcode_problems.json --clear
"""

import json
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from apps.questions.models import Question

COMPANY_ALIASES = {
    "google": "Google",
    "meta": "Meta",
    "facebook": "Meta",
    "amazon": "Amazon",
    "microsoft": "Microsoft",
    "bloomberg": "Bloomberg",
    "apple": "Apple",
    "netflix": "Netflix",
    "uber": "Uber",
    "airbnb": "Airbnb",
    "twitter": "Twitter",
    "linkedin": "LinkedIn",
    "salesforce": "Salesforce",
    "nvidia": "Nvidia",
    "accenture": "Accenture",
    "adobe": "Adobe",
    "oracle": "Oracle",
    "tiktok": "TikTok",
    "openai": "OpenAI",
    "bytedance": "ByteDance",
    "goldman sachs": "Goldman Sachs",
    "jpmorgan": "JPMorgan",
    "morgan stanley": "Morgan Stanley",
}

TOPIC_ALIASES = {
    "arrays": "array",
    "dynamic programming": "dp",
    "dynamic-programming": "dp",
    "two pointers": "two-pointers",
    "sliding window": "sliding-window",
    "hash table": "hash-table",
    "hash map": "hash-table",
    "graphs": "graph",
    "trees": "tree",
    "linked list": "linked-list",
    "binary search": "binary-search",
    "bit manipulation": "bit-manipulation",
}

REQUIRED_FIELDS = {"title", "slug", "difficulty", "description"}
VALID_DIFFICULTIES = {"easy", "medium", "hard"}


def normalize_company(name: str) -> str | None:
    """Return a normalized company name, or None to skip unknown short codes."""
    cleaned = name.lower().strip()
    if cleaned in COMPANY_ALIASES:
        return COMPANY_ALIASES[cleaned]
    # Skip entries that look like internal codes (e.g. "6sense", "1kosmos")
    # but keep anything that looks like a real name
    if name[0].isdigit():
        return None
    return name.strip().title()


def normalize_topic(name: str) -> str:
    cleaned = name.lower().strip()
    return TOPIC_ALIASES.get(cleaned, cleaned)


def validate(data: dict, index: int) -> list[str]:
    errors = []
    missing = REQUIRED_FIELDS - data.keys()
    if missing:
        errors.append(f"[{index}] Missing fields: {missing}")
    if data.get("difficulty") not in VALID_DIFFICULTIES:
        errors.append(f"[{index}] Invalid difficulty: {data.get('difficulty')!r}")
    return errors


class Command(BaseCommand):
    help = "Seed questions from a JSON file into the database"

    def add_arguments(self, parser):
        parser.add_argument("--file", required=True, help="Path to questions JSON file")
        parser.add_argument("--clear", action="store_true", help="Delete all questions before loading")

    def handle(self, *_args, **options):
        path = Path(options["file"])
        if not path.exists():
            raise CommandError(f"File not found: {path}")

        data = json.loads(path.read_text())
        if not isinstance(data, list):
            raise CommandError("JSON root must be a list of question objects")

        # Validate all entries first — fail before touching the DB
        all_errors = []
        for i, item in enumerate(data):
            all_errors.extend(validate(item, i))
        if all_errors:
            for err in all_errors:
                self.stderr.write(self.style.ERROR(err))
            raise CommandError("Validation failed — no records written")

        if options["clear"]:
            deleted, _ = Question.objects.all().delete()
            self.stdout.write(f"Cleared {deleted} existing questions.")

        created = updated = 0
        for item in data:
            # Normalize company tags — drop unrecognized codes
            raw_companies = item.get("company_tags") or []
            item["company_tags"] = sorted({
                normalized for c in raw_companies
                if (normalized := normalize_company(c)) is not None
            })

            # Normalize topic tags
            raw_topics = item.get("topic_tags") or []
            item["topic_tags"] = sorted({normalize_topic(t) for t in raw_topics})

            _, was_created = Question.objects.update_or_create(
                slug=item["slug"], defaults=item
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done — {created} created, {updated} updated."
        ))
