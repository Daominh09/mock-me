import uuid
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
            "question_slug": "two-sum",
            "interview_style": "technical",       // optional, default "technical"
            "anonymous_session_id": "<uuid>"      // optional, for guest users
        }

    Returns the created session with the full question embedded.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        question = get_object_or_404(
            Question, slug=data["question_slug"], is_active=True
        )

        # Determine identity: authenticated user takes priority over anon UUID.
        user = request.user if request.user.is_authenticated else None
        anon_id = None
        if user is None:
            anon_id = data.get("anonymous_session_id") or uuid.uuid4()

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
