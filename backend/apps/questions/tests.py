from django.test import TestCase
from rest_framework.test import APIClient
from .models import Question


def make_question(**kwargs) -> Question:
    """Helper to create a question with sensible defaults."""
    defaults = {
        "title": "Test Question",
        "slug": "test-question",
        "difficulty": "medium",
        "description": "A test problem.",
        "company_tags": [],
        "topic_tags": [],
        "is_active": True,
    }
    defaults.update(kwargs)
    return Question.objects.create(**defaults)


class QuestionListTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        make_question(
            title="Two Sum", slug="two-sum", difficulty="easy",
            company_tags=["Google", "Amazon"], topic_tags=["array", "hash-table"],
            leetcode_number=1,
        )
        make_question(
            title="Number of Islands", slug="number-of-islands", difficulty="medium",
            company_tags=["Amazon"], topic_tags=["graph", "dfs"],
            leetcode_number=200,
        )
        make_question(
            title="Trapping Rain Water", slug="trapping-rain-water", difficulty="hard",
            company_tags=["Google"], topic_tags=["array", "dp"],
            leetcode_number=42,
        )

    def test_list_returns_all_active(self):
        res = self.client.get("/api/questions/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 3)

    def test_list_excludes_inactive(self):
        Question.objects.filter(slug="two-sum").update(is_active=False)
        res = self.client.get("/api/questions/")
        self.assertEqual(len(res.data), 2)
        slugs = [q["slug"] for q in res.data]
        self.assertNotIn("two-sum", slugs)

    def test_list_serializer_omits_description(self):
        res = self.client.get("/api/questions/")
        self.assertNotIn("description", res.data[0])
        self.assertNotIn("starter_code", res.data[0])

    def test_filter_by_difficulty(self):
        res = self.client.get("/api/questions/?difficulty=easy")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], "two-sum")

    def test_filter_by_difficulty_no_match(self):
        res = self.client.get("/api/questions/?difficulty=hard")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], "trapping-rain-water")

    def test_filter_by_company(self):
        res = self.client.get("/api/questions/?company=Google")
        slugs = [q["slug"] for q in res.data]
        self.assertIn("two-sum", slugs)
        self.assertIn("trapping-rain-water", slugs)
        self.assertNotIn("number-of-islands", slugs)

    def test_filter_by_company_no_match(self):
        res = self.client.get("/api/questions/?company=Netflix")
        self.assertEqual(len(res.data), 0)

    def test_filter_by_single_topic(self):
        res = self.client.get("/api/questions/?topic=array")
        slugs = [q["slug"] for q in res.data]
        self.assertIn("two-sum", slugs)
        self.assertIn("trapping-rain-water", slugs)
        self.assertNotIn("number-of-islands", slugs)

    def test_filter_by_multiple_topics_or_logic(self):
        # ?topics= uses OR — returns questions matching ANY of the given tags
        res = self.client.get("/api/questions/?topics=graph,dp")
        slugs = [q["slug"] for q in res.data]
        self.assertIn("number-of-islands", slugs)   # has "graph"
        self.assertIn("trapping-rain-water", slugs)  # has "dp"
        self.assertNotIn("two-sum", slugs)           # has neither

    def test_filter_by_search(self):
        res = self.client.get("/api/questions/?search=rain")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], "trapping-rain-water")

    def test_filter_by_search_case_insensitive(self):
        res = self.client.get("/api/questions/?search=TWO SUM")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], "two-sum")

    def test_combined_filters(self):
        res = self.client.get("/api/questions/?difficulty=medium&company=Amazon")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], "number-of-islands")


class QuestionDetailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        make_question(
            title="Two Sum", slug="two-sum", difficulty="easy",
            description="Given an array of integers...",
            starter_code={"python": "class Solution:\n    pass"},
            company_tags=["Google"], topic_tags=["array"],
        )

    def test_detail_by_slug(self):
        res = self.client.get("/api/questions/two-sum/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["slug"], "two-sum")

    def test_detail_includes_full_fields(self):
        res = self.client.get("/api/questions/two-sum/")
        self.assertIn("description", res.data)
        self.assertIn("starter_code", res.data)
        self.assertIn("constraints", res.data)
        self.assertIn("examples", res.data)

    def test_detail_not_found(self):
        res = self.client.get("/api/questions/nonexistent-slug/")
        self.assertEqual(res.status_code, 404)


class QuestionRandomTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        make_question(slug="q1", title="Q1", difficulty="easy", topic_tags=["array"])
        make_question(slug="q2", title="Q2", difficulty="medium", topic_tags=["graph"])
        make_question(slug="q3", title="Q3", difficulty="hard", topic_tags=["dp"])

    def test_random_returns_one_question(self):
        res = self.client.get("/api/questions/random/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("slug", res.data)

    def test_random_respects_filters(self):
        res = self.client.get("/api/questions/random/?difficulty=easy")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["slug"], "q1")

    def test_random_returns_404_when_no_match(self):
        res = self.client.get("/api/questions/random/?difficulty=easy&topic=dp")
        self.assertEqual(res.status_code, 404)
        self.assertIn("detail", res.data)

    def test_random_returns_404_with_helpful_message(self):
        res = self.client.get("/api/questions/random/?company=Netflix")
        self.assertEqual(res.status_code, 404)
        self.assertIn("filters", res.data["detail"].lower())

    def test_random_returns_detail_serializer(self):
        res = self.client.get("/api/questions/random/")
        self.assertIn("description", res.data)
        self.assertIn("starter_code", res.data)


class QuestionTagEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        make_question(slug="q1", title="Q1", topic_tags=["array", "dp"], company_tags=["Google", "Amazon"])
        make_question(slug="q2", title="Q2", topic_tags=["graph", "dp"], company_tags=["Meta"])
        # inactive — should be excluded from tag endpoints
        make_question(slug="q3", title="Q3", topic_tags=["binary-search"], company_tags=["Netflix"],
                      is_active=False)

    def test_topics_returns_sorted_distinct_list(self):
        res = self.client.get("/api/questions/topics/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, sorted(res.data))
        self.assertIn("array", res.data)
        self.assertIn("dp", res.data)
        self.assertIn("graph", res.data)
        self.assertEqual(len(res.data), len(set(res.data)))  # no duplicates

    def test_topics_excludes_inactive(self):
        res = self.client.get("/api/questions/topics/")
        self.assertNotIn("binary-search", res.data)

    def test_companies_returns_sorted_distinct_list(self):
        res = self.client.get("/api/questions/companies/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, sorted(res.data))
        self.assertIn("Google", res.data)
        self.assertIn("Amazon", res.data)
        self.assertIn("Meta", res.data)
        self.assertEqual(len(res.data), len(set(res.data)))  # no duplicates

    def test_companies_excludes_inactive(self):
        res = self.client.get("/api/questions/companies/")
        self.assertNotIn("Netflix", res.data)
