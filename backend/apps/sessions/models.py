from django.db import models
from django.conf import settings
from apps.questions.models import Question


class InterviewSession(models.Model):
    """
    Anchor record for a single mock interview attempt.
    """

    class Style(models.TextChoices):
        FRIENDLY   = "friendly",   "Friendly"
        CHALLENGED = "challenged", "Challenged"
        THINKING   = "thinking",   "Thinking"

    class Status(models.TextChoices):
        ACTIVE    = "active",    "Active"
        COMPLETED = "completed", "Completed"
        ABANDONED = "abandoned", "Abandoned"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interview_sessions",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.PROTECT,
        related_name="sessions",
    )
    interview_style = models.CharField(
        max_length=20,
        choices=Style.choices,
        default=Style.FRIENDLY,
    )
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
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"[{self.interview_style}] {self.question.title} — {self.user.email}"
