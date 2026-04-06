import uuid
from django.db import models
from django.conf import settings
from apps.questions.models import Question


class InterviewSession(models.Model):
    """
    Anchor record for a single mock interview attempt.
    Supports both authenticated users and anonymous (guest) sessions.
    """

    class Style(models.TextChoices):
        TECHNICAL = "technical", "Technical"
        BEHAVIORAL = "behavioral", "Behavioral"
        MIXED = "mixed", "Mixed"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ABANDONED = "abandoned", "Abandoned"

    # ── Identity ─────────────────────────────────────────────────────
    # Either user (authenticated) or anonymous_session_id (guest) will be set.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="interview_sessions",
    )
    anonymous_session_id = models.UUIDField(
        null=True,
        blank=True,
        help_text="UUID assigned to a guest session when no user is logged in",
    )

    # ── Content ───────────────────────────────────────────────────────
    question = models.ForeignKey(
        Question,
        on_delete=models.PROTECT,
        related_name="sessions",
    )
    interview_style = models.CharField(
        max_length=20,
        choices=Style.choices,
        default=Style.TECHNICAL,
    )

    # ── Lifecycle ─────────────────────────────────────────────────────
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["anonymous_session_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        identity = self.user.email if self.user_id else f"anon:{self.anonymous_session_id}"
        return f"[{self.interview_style}] {self.question.title} — {identity}"
