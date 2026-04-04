"""
Seed the database with sample questions for development/testing.

Usage:
    docker compose exec backend python manage.py seed_questions
    docker compose exec backend python manage.py seed_questions --clear  # wipe first
"""

from django.core.management.base import BaseCommand
from apps.questions.models import Question


SAMPLE_QUESTIONS = [
    {
        "title": "Two Sum",
        "slug": "two-sum",
        "leetcode_number": 1,
        "difficulty": "easy",
        "description": (
            "Given an array of integers `nums` and an integer `target`, "
            "return indices of the two numbers such that they add up to `target`.\n\n"
            "You may assume that each input would have exactly one solution, "
            "and you may not use the same element twice."
        ),
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] == 9"},
        ],
        "starter_code": {"python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass"},
        "topic_tags": ["array", "hash-table"],
        "company_tags": ["Google", "Amazon", "Meta"],
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "leetcode_number": 3,
        "difficulty": "medium",
        "description": (
            "Given a string `s`, find the length of the longest substring "
            "without repeating characters."
        ),
        "constraints": "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
        "examples": [
            {"input": 's = "abcabcbb"', "output": "3", "explanation": 'The answer is "abc", with length 3.'},
        ],
        "starter_code": {"python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass"},
        "topic_tags": ["string", "sliding-window", "hash-table"],
        "company_tags": ["Amazon", "Bloomberg", "Microsoft"],
    },
    {
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "leetcode_number": 56,
        "difficulty": "medium",
        "description": (
            "Given an array of intervals where `intervals[i] = [start_i, end_i]`, "
            "merge all overlapping intervals, and return an array of the non-overlapping "
            "intervals that cover all the intervals in the input."
        ),
        "constraints": "1 <= intervals.length <= 10^4\nintervals[i].length == 2",
        "examples": [
            {"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]", "explanation": "Intervals [1,3] and [2,6] overlap."},
        ],
        "starter_code": {"python": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass"},
        "topic_tags": ["array", "sorting"],
        "company_tags": ["Google", "Meta", "Bloomberg"],
    },
    {
        "title": "Number of Islands",
        "slug": "number-of-islands",
        "leetcode_number": 200,
        "difficulty": "medium",
        "description": (
            "Given an m x n 2D binary grid which represents a map of '1's (land) "
            "and '0's (water), return the number of islands."
        ),
        "constraints": "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300",
        "examples": [
            {"input": 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', "output": "2", "explanation": "Two connected components of 1s."},
        ],
        "starter_code": {"python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass"},
        "topic_tags": ["graph", "bfs", "dfs"],
        "company_tags": ["Amazon", "Microsoft", "Google"],
    },
    {
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "leetcode_number": 42,
        "difficulty": "hard",
        "description": (
            "Given n non-negative integers representing an elevation map where "
            "the width of each bar is 1, compute how much water it can trap after raining."
        ),
        "constraints": "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
        "examples": [
            {"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6", "explanation": "6 units of rain water are trapped."},
        ],
        "starter_code": {"python": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass"},
        "topic_tags": ["array", "two-pointers", "dp", "stack"],
        "company_tags": ["Goldman Sachs", "Google", "Amazon"],
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample LeetCode questions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing questions before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = Question.objects.all().delete()
            self.stdout.write(f"Cleared {deleted} existing questions.")

        created = 0
        for q_data in SAMPLE_QUESTIONS:
            _, was_created = Question.objects.update_or_create(
                slug=q_data["slug"],
                defaults=q_data,
            )
            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Done — {created} created, {len(SAMPLE_QUESTIONS) - created} updated.")
        )