from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.questions.models import Question
from .models import Session
from .persona import generate_persona
from .serializers import StartSessionRequestSerializer, StartSessionResponseSerializer


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
        req = StartSessionRequestSerializer(data=request.data)
        if not req.is_valid():
            return Response(req.errors, status=status.HTTP_400_BAD_REQUEST)

        data         = req.validated_data
        style        = data["style"]
        company_tags = data["company_tags"]
        topics       = data["topics"]
        difficulties = data["difficulties"]

        # ── Pick a question ─────────────────────────────────────────────────
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

        # ── Generate persona ────────────────────────────────────────────────
        persona_config = generate_persona(style)

        # ── Persist session ─────────────────────────────────────────────────
        session = Session.objects.create(
            user=request.user,
            question=question,
            style=style,
            persona_config=persona_config,
        )

        return Response(
            StartSessionResponseSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )
