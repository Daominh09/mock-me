from rest_framework import serializers
from .models import Question


class QuestionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing / filtering — omits heavy fields."""

    class Meta:
        model = Question
        fields = [
            "id",
            "title",
            "slug",
            "difficulty",
            "company_tags",
            "topic_tags",
            "leetcode_number",
        ]


class QuestionDetailSerializer(serializers.ModelSerializer):
    """Full serializer used when a question is selected for an interview."""

    class Meta:
        model = Question
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "constraints",
            "examples",
            "starter_code",
            "difficulty",
            "company_tags",
            "topic_tags",
            "leetcode_number",
        ]