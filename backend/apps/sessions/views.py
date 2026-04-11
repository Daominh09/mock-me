import uuid
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from apps.questions.models import Question
from .models import InterviewSession
from .serializers import StartSessionSerializer, InterviewSessionSerializer


class StartSessionView(APIView):
    """
    POST /api/sessions/start/

    Body (JSON):
        {
            "company": "Google",                  // required
            "interview_style": "technical",       // required
            "difficulty": "medium",               // optional
            "topic": "array",                     // optional
            "anonymous_session_id": "<uuid>"      // optional, for guest users
        }

    The backend filters questions, randomly selects one, and creates the session
    atomically — no partial failures.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # ── Build filtered queryset ───────────────────────────────────
        qs = Question.objects.filter(
            is_active=True,
            company_tags__contains=[data["company"]],
        )
        if data.get("difficulty"):
            difficulties = [d.strip() for d in data["difficulty"].split(",")]
            qs = qs.filter(difficulty__in=difficulties)
        if data.get("topic"):
            qs = qs.filter(topic_tags__contains=[data["topic"]])

        # ── Random selection ─────────────────────────────────────────
        question = qs.order_by("?").first()
        if not question:
            return Response(
                {"detail": "No questions match the given filters. Please adjust your filters and try again."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ── Atomic session creation ───────────────────────────────────
        user = request.user if request.user.is_authenticated else None
        anon_id = None
        if user is None:
            anon_id = data.get("anonymous_session_id") or uuid.uuid4()

        with transaction.atomic():
            session = InterviewSession.objects.create(
                user=user,
                anonymous_session_id=anon_id,
                question=question,
                interview_style=data["interview_style"],
            )

        return Response(
            InterviewSessionSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )


class SessionDetailView(APIView):
    """
    GET /api/sessions/<id>/

    Returns a single session. Authenticated users can only fetch their own.
    Anonymous users can fetch by matching anonymous_session_id query param.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        session = get_object_or_404(InterviewSession, pk=pk)

        # Basic ownership check
        if session.user_id:
            if not request.user.is_authenticated or session.user_id != request.user.pk:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            anon_id = request.query_params.get("anonymous_session_id")
            if str(session.anonymous_session_id) != anon_id:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(InterviewSessionSerializer(session).data)
