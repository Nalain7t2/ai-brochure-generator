from django.urls import path
from .views import GenerateBrochureView

urlpatterns = [
    path(
        "generate-brochure/",
        GenerateBrochureView.as_view(),  # ← DRF class-based view
        name="generate-brochure",
    ),
]