from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AboutViewSet,
    AchievementViewSet,
    CertificationViewSet,
    CodingProfileViewSet,
    ContactInfoViewSet,
    ContactMessageViewSet,
    ProjectViewSet,
    SkillViewSet,
    TimelineEntryViewSet,
    portfolio_changes_signature,
)

router = DefaultRouter()
router.register("skills", SkillViewSet, basename="api-skill")
router.register("projects", ProjectViewSet, basename="api-project")
router.register("about", AboutViewSet, basename="api-about")
router.register("achievements", AchievementViewSet, basename="api-achievement")
router.register("certifications", CertificationViewSet, basename="api-certification")
router.register("coding-profiles", CodingProfileViewSet, basename="api-coding-profile")
router.register("timeline", TimelineEntryViewSet, basename="api-timeline")
router.register("contact-info", ContactInfoViewSet, basename="api-contact-info")
router.register("contact-messages", ContactMessageViewSet, basename="api-contact-message")

urlpatterns = [
    path("portfolio-signature/", portfolio_changes_signature, name="api-portfolio-signature"),
    path("", include(router.urls)),
]
