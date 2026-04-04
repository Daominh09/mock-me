from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Question
from .serializers import QuestionListSerializer, QuestionDetailSerializer


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/questions/              → list (with filters)
    GET /api/questions/<slug>/       → detail
    GET /api/questions/random/       → one random question (with filters)
    GET /api/questions/topics/       → distinct topic tags
    GET /api/questions/companies/    → distinct company tags
    """

    permission_classes = [AllowAny]  # questions are public; tighten later
    lookup_field = "slug"

    def get_queryset(self):
        """
        Every filter here translates to a WHERE clause in PostgreSQL.
        Nothing is filtered in Python memory.

        Query params:
            ?difficulty=easy
            ?company=Google           (exact match inside array)
            ?topic=dp                 (exact match inside array)
            ?topics=dp,graph          (OR — matches any)
            ?search=two+sum           (title icontains)
        """
        qs = Question.objects.filter(is_active=True)

        # ── Difficulty (B-tree index) ───────────────────────────────
        difficulty = self.request.query_params.get("difficulty")
        if difficulty:
            qs = qs.filter(difficulty=difficulty.lower())

        # ── Company tag (GIN index, @> operator) ───────────────────
        company = self.request.query_params.get("company")
        if company:
            qs = qs.filter(company_tags__contains=[company])

        # ── Single topic (GIN index, @> operator) ──────────────────
        topic = self.request.query_params.get("topic")
        if topic:
            qs = qs.filter(topic_tags__contains=[topic])

        # ── Multiple topics OR (GIN index, && operator) ────────────
        topics = self.request.query_params.get("topics")
        if topics:
            topic_list = [t.strip() for t in topics.split(",")]
            qs = qs.filter(topic_tags__overlap=topic_list)

        # ── Title search (basic icontains) ─────────────────────────
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)

        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return QuestionDetailSerializer
        return QuestionListSerializer

    @action(detail=False, methods=["get"])
    def random(self, request):
        """Return one random question matching the current filters."""
        qs = self.get_queryset()
        question = qs.order_by("?").first()
        if not question:
            return Response(
                {"detail": "No questions match the given filters."}, status=404
            )
        return Response(QuestionDetailSerializer(question).data)

    @action(detail=False, methods=["get"])
    def topics(self, request):
        """Return a sorted list of every distinct topic tag in the DB."""
        rows = Question.objects.filter(is_active=True).values_list(
            "topic_tags", flat=True
        )
        all_tags = sorted({tag for tags in rows for tag in tags})
        return Response(all_tags)

    @action(detail=False, methods=["get"])
    def companies(self, request):
        """Return a sorted list of every distinct company tag in the DB."""
        rows = Question.objects.filter(is_active=True).values_list(
            "company_tags", flat=True
        )
        all_tags = sorted({tag for tags in rows for tag in tags})
        return Response(all_tags)