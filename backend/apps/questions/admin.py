from django.contrib import admin
from .models import Question
 
 
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ["title", "difficulty", "leetcode_number", "is_active", "updated_at"]
    list_filter = ["difficulty", "is_active"]
    search_fields = ["title", "slug", "description"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at"]
    list_editable = ["is_active"]
 