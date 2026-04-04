from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex


class Question(models.Model):
    """
    A LeetCode-style coding question with company and topic tags.
    All filtering happens at DB level via PostgreSQL array/GIN queries.
    """

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(
        help_text="Full problem statement in Markdown"
    )
    constraints = models.TextField(
        blank=True,
        help_text="Edge cases and constraints, kept separate for agent context",
    )
    examples = models.JSONField(
        default=list,
        help_text='[{"input": "...", "output": "...", "explanation": "..."}]',
    )
    starter_code = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"python": "class Solution:...", "javascript": "..."}',
    )

    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
    )

    # ── Tags stored as Postgres arrays ──────────────────────────────
    # Filtering uses GIN-indexed @> (contains) and && (overlap) operators.
    company_tags = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        help_text='e.g. ["Google", "Meta", "Amazon"]',
    )
    topic_tags = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        help_text='e.g. ["array", "dp", "graph"]',
    )

    leetcode_number = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Optional LeetCode problem number for reference",
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["leetcode_number", "title"]
        indexes = [
            # GIN indexes — this is what makes DB-level array filtering fast.
            # Without these, contains/overlap queries do a full table scan.
            GinIndex(name="idx_question_company_tags", fields=["company_tags"]),
            GinIndex(name="idx_question_topic_tags", fields=["topic_tags"]),
            models.Index(fields=["difficulty"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        prefix = f"#{self.leetcode_number} " if self.leetcode_number else ""
        return f"{prefix}[{self.get_difficulty_display()}] {self.title}"