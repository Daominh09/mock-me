from django.urls import path
from .views import StartSessionView, SessionDetailView

urlpatterns = [
    path("start/", StartSessionView.as_view(), name="session-start"),
    path("<int:pk>/", SessionDetailView.as_view(), name="session-detail"),
]
