from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.questions.models import Question
from .models import InterviewSession
from .serializers import StartSessionSerializer, InterviewSessionSerializer
from .persona import generate_persona


class StartSessionView(APIView):
    """
    POST /api/sessions/start/
    Picks a random question matching the supplied filters, generates a persona
    config from the chosen style, persists the session, and returns everything
    the frontend needs to render the interview screen.

    Request body:
        style        — 'Friendly' | 'Challenge' | 'Thinking'  (required)
        company_tags — string[]  (optional, [] = any company)
        role         — string    (optional, reserved for future filtering)
        topics       — string[]  (optional, null = any topic)
        difficulties — string[]  (optional, null = any difficulty)

    Response 201:
        session_id     — int
        question       — full QuestionDetailSerializer shape
        persona_config — structured persona dict
        style          — echoed back
        status         — 'active'

    Response 400: validation errors
    Response 404: no questions match the filters
    """
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data            = serializer.validated_data
        interview_style = data["interview_style"]
        company_tags    = data.get("company_tags", [])
        topics          = data.get("topics", [])
        difficulties    = data.get("difficulties", [])

        qs = Question.objects.filter(is_active=True)

        if company_tags:
            qs = qs.filter(company_tags__overlap=company_tags)

        if topics:
            qs = qs.filter(topic_tags__overlap=topics)

        if difficulties:
            normalised = [d.lower() for d in difficulties]
            qs = qs.filter(difficulty__in=normalised)

        question = qs.order_by("?").first()

        if question is None:
            return Response(
                {"detail": "No questions match the given filters. Please adjust your filters and try again."},
                status=status.HTTP_404_NOT_FOUND,
            )

        persona_config = generate_persona(interview_style)

        with transaction.atomic():
            session = InterviewSession.objects.create(
                user=request.user,
                question=question,
                interview_style=interview_style,
            )

        response_data = InterviewSessionSerializer(session).data
        response_data["persona_config"] = persona_config
        return Response(response_data, status=status.HTTP_201_CREATED)


class SessionDetailView(APIView):
    """
    GET /api/sessions/<id>/

    Returns a single session. Authenticated users can only fetch their own.
    Anonymous users can fetch by matching anonymous_session_id query param.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        session = get_object_or_404(InterviewSession, pk=pk, user=request.user)
        return Response(InterviewSessionSerializer(session).data)
