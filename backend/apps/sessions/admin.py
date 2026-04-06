from django.contrib import admin
from .models import InterviewSession


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ["id", "question", "interview_style", "status", "user", "anonymous_session_id", "started_at"]
    list_filter = ["interview_style", "status"]
    search_fields = ["question__title", "user__email"]
    readonly_fields = ["started_at"]
