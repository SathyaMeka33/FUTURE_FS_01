from rest_framework import serializers

from .models import (
    About,
    Achievement,
    Certification,
    CodingProfile,
    ContactInfo,
    ContactMessage,
    Project,
    Skill,
    TimelineEntry,
)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "percentage", "category", "icon_image", "icon_url", "icon_source"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "image",
            "image_url",
            "image_source",
            "tech_stack",
            "github_link",
            "live_demo_link",
            "category",
            "created_at",
            "updated_at",
        ]


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = [
            "id",
            "subtitle",
            "description",
            "cgpa",
            "career_objective",
            "education_snapshot",
            "intro_secondary",
            "profile_image",
            "profile_image_url",
            "profile_image_source",
            "resume_file",
            "updated_at",
        ]


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "title", "description", "image", "image_url", "image_source", "display_order", "is_active", "created_at"]


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            "id",
            "title",
            "issuer",
            "description",
            "image",
            "image_url",
            "image_source",
            "credential_url",
            "issued_on",
            "display_order",
            "is_active",
            "created_at",
        ]


class CodingProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingProfile
        fields = [
            "id",
            "platform",
            "username",
            "profile_url",
            "rating",
            "icon_image",
            "icon_url",
            "icon_source",
            "display_order",
            "is_active",
            "updated_at",
        ]


class TimelineEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEntry
        fields = ["id", "page", "meta_label", "title", "description", "display_order", "is_active"]


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ["id", "location", "phone", "email", "contact_subtitle", "linkedin_url", "leetcode_url", "updated_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "timestamp"]
        read_only_fields = ["timestamp"]
