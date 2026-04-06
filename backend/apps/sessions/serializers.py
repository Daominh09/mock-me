import uuid
from rest_framework import serializers
from apps.questions.serializers import QuestionDetailSerializer
from .models import InterviewSession


class StartSessionSerializer(serializers.Serializer):
    """Validates the POST /api/sessions/start/ request body."""
    question_slug = serializers.SlugField()
    interview_style = serializers.ChoiceField(
        choices=InterviewSession.Style.choices,
        default=InterviewSession.Style.TECHNICAL,
    )
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
