from django.contrib import admin

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


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
	list_display = ("name", "category", "percentage")
	search_fields = ("name",)
	list_filter = ("category",)
	ordering = ("category", "-percentage", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ("title", "category", "github_link", "created_at", "updated_at")
	search_fields = ("title", "description", "tech_stack")
	list_filter = ("category", "created_at")
	ordering = ("-created_at",)


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
	list_display = ("id", "subtitle", "cgpa", "updated_at")
	ordering = ("-updated_at",)
	search_fields = ("subtitle", "description", "career_objective", "education_snapshot", "cgpa")


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
	list_display = ("title", "display_order", "is_active", "created_at")
	search_fields = ("title", "description")
	list_filter = ("is_active",)
	ordering = ("display_order", "-created_at")


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
	list_display = ("title", "issuer", "issued_on", "display_order", "is_active")
	search_fields = ("title", "issuer", "description")
	list_filter = ("is_active", "issued_on")
	ordering = ("display_order", "-created_at")


@admin.register(CodingProfile)
class CodingProfileAdmin(admin.ModelAdmin):
	list_display = ("platform", "username", "rating", "display_order", "is_active", "updated_at")
	search_fields = ("platform", "username", "rating", "profile_url")
	list_filter = ("platform", "is_active")
	ordering = ("display_order", "platform")


@admin.register(TimelineEntry)
class TimelineEntryAdmin(admin.ModelAdmin):
	list_display = ("title", "page", "meta_label", "display_order", "is_active")
	search_fields = ("title", "meta_label", "description")
	list_filter = ("page", "is_active")
	ordering = ("page", "display_order")


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
	list_display = ("email", "phone", "location", "updated_at")
	search_fields = ("email", "phone", "location")
	ordering = ("-updated_at",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "timestamp")
	search_fields = ("name", "email", "message")
	list_filter = ("timestamp",)
	readonly_fields = ("name", "email", "message", "timestamp")


admin.site.site_header = "Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Manage Portfolio Content"
