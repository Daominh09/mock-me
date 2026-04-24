from rest_framework import serializers
from apps.questions.serializers import QuestionDetailSerializer
from .models import InterviewSession


class StartSessionSerializer(serializers.Serializer):
    interview_style = serializers.ChoiceField(
        choices=InterviewSession.Style.choices,
        default=InterviewSession.Style.FRIENDLY,
    )
    company_tags = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list,
    )
    topics = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list,
    )
    difficulties = serializers.ListField(
        child=serializers.CharField(max_length=20),
        required=False,
        default=list,
    )


class InterviewSessionSerializer(serializers.ModelSerializer):
    """Full session response including the embedded question."""
    question = QuestionDetailSerializer(read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "user",
            "question",
            "interview_style",
            "status",
            "started_at",
            "ended_at",
        ]
        read_only_fields = fields
