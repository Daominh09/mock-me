import uuid
from rest_framework import serializers
from apps.questions.serializers import QuestionDetailSerializer
from .models import InterviewSession


class StartSessionSerializer(serializers.Serializer):
    """
    Validates the POST /api/sessions/start/ request body.

    Required:
        company         — filter questions by company tag
        interview_style — technical / behavioral / mixed

    Optional:
        difficulty              — easy / medium / hard
        topic                   — single topic tag
        anonymous_session_id    — UUID for guest users
    """
    company = serializers.CharField(max_length=100)
    interview_style = serializers.ChoiceField(
        choices=InterviewSession.Style.choices,
        default=InterviewSession.Style.TECHNICAL,
    )
    difficulty = serializers.ChoiceField(
        choices=["easy", "medium", "hard"],
        required=False,
        allow_null=True,
    )
    topic = serializers.CharField(max_length=100, required=False, allow_null=True)
    anonymous_session_id = serializers.UUIDField(required=False, allow_null=True)


class InterviewSessionSerializer(serializers.ModelSerializer):
    """Full session response including the embedded question."""
    question = QuestionDetailSerializer(read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "user",
            "anonymous_session_id",
            "question",
            "interview_style",
            "status",
            "started_at",
            "ended_at",
        ]
        read_only_fields = fields
