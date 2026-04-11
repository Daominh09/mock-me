from django.urls import path
from .views import StartSessionView

urlpatterns = [
    path("start/", StartSessionView.as_view(), name="session-start"),
]
