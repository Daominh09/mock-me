from django.test import TestCase
from rest_framework.test import APIClient
from apps.questions.models import Question
from .models import InterviewSession


def make_question(**kwargs) -> Question:
    defaults = {
        "title": "Test Question",
        "slug": "test-question",
        "difficulty": "medium",
        "description": "A test problem.",
        "company_tags": ["Google"],
        "topic_tags": ["array"],
        "is_active": True,
    }
    defaults.update(kwargs)
    return Question.objects.create(**defaults)


class StartSessionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        make_question(
            title="Two Sum", slug="two-sum", difficulty="easy",
            company_tags=["Google", "Amazon"], topic_tags=["array", "hash-table"],
        )
        make_question(
            title="Number of Islands", slug="number-of-islands", difficulty="medium",
            company_tags=["Amazon"], topic_tags=["graph"],
        )
        make_question(
            title="Trapping Rain Water", slug="trapping-rain-water", difficulty="hard",
            company_tags=["Google"], topic_tags=["dp"],
        )

    def test_start_session_success(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
        }, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertIn("id", res.data)
        self.assertIn("question", res.data)
        self.assertIn("description", res.data["question"])

    def test_start_session_creates_db_record(self):
        self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
        }, format="json")
        self.assertEqual(InterviewSession.objects.count(), 1)

    def test_start_session_with_difficulty_filter(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
            "difficulty": "easy",
        }, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["question"]["difficulty"], "easy")
        self.assertEqual(res.data["question"]["slug"], "two-sum")

    def test_start_session_with_topic_filter(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
            "topic": "dp",
        }, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["question"]["slug"], "trapping-rain-water")

    def test_start_session_assigns_anonymous_id(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
        }, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertIsNotNone(res.data["anonymous_session_id"])
        self.assertIsNone(res.data["user"])

    def test_start_session_no_match_returns_404(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Netflix",
            "interview_style": "technical",
        }, format="json")
        self.assertEqual(res.status_code, 404)
        self.assertIn("filters", res.data["detail"].lower())

    def test_start_session_missing_company_returns_400(self):
        res = self.client.post("/api/sessions/start/", {
            "interview_style": "technical",
        }, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("company", res.data)

    def test_start_session_missing_style_uses_default(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
        }, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["interview_style"], "technical")

    def test_start_session_invalid_style_returns_400(self):
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "invalid",
        }, format="json")
        self.assertEqual(res.status_code, 400)

    def test_start_session_question_not_from_inactive(self):
        Question.objects.filter(slug="two-sum").update(is_active=False)
        res = self.client.post("/api/sessions/start/", {
            "company": "Google",
            "interview_style": "technical",
            "difficulty": "easy",
        }, format="json")
        # two-sum is inactive, only hard Google question left
        self.assertEqual(res.status_code, 404)
