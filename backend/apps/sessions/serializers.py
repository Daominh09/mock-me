from rest_framework import serializers

from apps.questions.serializers import QuestionDetailSerializer
from .models import Session


class StartSessionRequestSerializer(serializers.Serializer):
    """Validates the POST /api/sessions/start/ request body."""

    style        = serializers.ChoiceField(choices=["Friendly", "Challenge", "Thinking"])
    company_tags = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    role         = serializers.CharField(required=False, allow_null=True, default=None)
    topics       = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True, default=None
    )
    difficulties = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True, default=None
    )


class StartSessionResponseSerializer(serializers.ModelSerializer):
    """Shapes the POST /api/sessions/start/ response."""

    session_id     = serializers.IntegerField(source="pk")
    question       = QuestionDetailSerializer()
    persona_config = serializers.JSONField()

    class Meta:
        model  = Session
        fields = ["session_id", "question", "persona_config", "style", "status"]
