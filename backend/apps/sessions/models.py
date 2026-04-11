from django.db import models
from django.conf import settings

from apps.questions.models import Question


class Session(models.Model):
    """
    A single mock interview session.

    Lifecycle:
        active    — session started, interview in progress
        completed — candidate submitted / time ran out
        abandoned — candidate left without completing
    """

    class Status(models.TextChoices):
        ACTIVE    = "active",    "Active"
        COMPLETED = "completed", "Completed"
        ABANDONED = "abandoned", "Abandoned"

    user     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.PROTECT,
        related_name="sessions",
    )

    # ── Interview config ────────────────────────────────────────────────────
    style          = models.CharField(max_length=20)          # Friendly | Challenge | Thinking
    persona_config = models.JSONField()                       # output of generate_persona()

    # ── Lifecycle ───────────────────────────────────────────────────────────
    status     = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    started_at  = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"Session {self.pk} — {self.user} — {self.style}"
