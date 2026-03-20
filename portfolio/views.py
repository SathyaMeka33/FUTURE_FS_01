import hashlib
import json
import re
from urllib.parse import quote

from django.contrib import messages
from django.conf import settings
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect, render
from rest_framework import mixins, viewsets

from .forms import ContactMessageForm
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
from .serializers import (
	AboutSerializer,
	AchievementSerializer,
	CertificationSerializer,
	CodingProfileSerializer,
	ContactInfoSerializer,
	ContactMessageSerializer,
	ProjectSerializer,
	SkillSerializer,
	TimelineEntrySerializer,
)


def _skill_groups():
	groups = []
	for key, label in Skill.CATEGORY_CHOICES:
		items = Skill.objects.filter(category=key)
		if items.exists():
			groups.append({"key": key, "label": label, "items": items})
	return groups


def _contact_info():
	return ContactInfo.objects.order_by("-updated_at").first()


def _whatsapp_redirect_url(name, email, message):
	phone = re.sub(r"\D", "", getattr(settings, "WHATSAPP_PHONE_NUMBER", "") or "")
	if not phone:
		return ""

	text = (
		"New Contact Form Submission%0A"
		f"Name: {name}%0A"
		f"Email: {email}%0A"
		f"Message: {message}"
	)
	return f"https://wa.me/{phone}?text={quote(text, safe='%')}"


def home(request):
	about = About.objects.order_by("-updated_at").first()
	skills = Skill.objects.all()[:8]
	projects = Project.objects.all()[:3]
	achievements = Achievement.objects.filter(is_active=True)[:3]
	certifications = Certification.objects.filter(is_active=True)
	coding_profiles = CodingProfile.objects.filter(is_active=True)
	timeline_entries = TimelineEntry.objects.filter(is_active=True, page="home")
	if not timeline_entries.exists():
		timeline_entries = TimelineEntry.objects.filter(is_active=True, page="about")

	context = {
		"about": about,
		"skills": skills,
		"skills_home": Skill.objects.order_by("-id"),
		"projects": projects,
		"achievements": achievements,
		"certifications": certifications,
		"coding_profiles": coding_profiles,
		"timeline_entries": timeline_entries,
		"contact_info": _contact_info(),
		"skills_count": Skill.objects.count(),
		"projects_count": Project.objects.count(),
	}
	return render(request, "portfolio/index.html", context)


def about_page(request):
	about = About.objects.order_by("-updated_at").first()
	timeline_entries = TimelineEntry.objects.filter(is_active=True, page="about")
	achievements = Achievement.objects.filter(is_active=True)[:3]
	certifications = Certification.objects.filter(is_active=True)
	return render(
		request,
		"portfolio/about.html",
		{
			"about": about,
			"timeline_entries": timeline_entries,
			"achievements": achievements,
			"certifications": certifications,
			"skills_count": Skill.objects.count(),
			"projects_count": Project.objects.count(),
		},
	)


def skills_page(request):
	skills = Skill.objects.all()
	return render(request, "portfolio/skills.html", {"skills": skills, "skill_groups": _skill_groups()})


def projects_page(request):
	search_query = request.GET.get("q", "").strip()
	selected_category = request.GET.get("category", "all")

	queryset = Project.objects.all()
	if search_query:
		queryset = queryset.filter(
			Q(title__icontains=search_query)
			| Q(description__icontains=search_query)
			| Q(tech_stack__icontains=search_query)
		)

	if selected_category in {"web", "data", "core", "other"}:
		queryset = queryset.filter(category=selected_category)

	paginator = Paginator(queryset, 6)
	page_obj = paginator.get_page(request.GET.get("page"))

	context = {
		"page_obj": page_obj,
		"search_query": search_query,
		"selected_category": selected_category,
		"categories": Project.CATEGORY_CHOICES,
		"contact_info": _contact_info(),
	}
	return render(request, "portfolio/projects.html", context)


def contact_page(request):
	if request.method == "POST":
		form = ContactMessageForm(request.POST)
		if form.is_valid():
			contact_message = form.save()

			request.session["whatsapp_redirect_url"] = _whatsapp_redirect_url(
				contact_message.name,
				contact_message.email,
				contact_message.message,
			)
			messages.success(request, "Thank you. Your message was saved successfully.")
			return redirect("contact")
	else:
		form = ContactMessageForm()

	context = {
		"form": form,
		"contact_info": _contact_info(),
		"whatsapp_redirect_url": request.session.pop("whatsapp_redirect_url", ""),
	}
	return render(request, "portfolio/contact.html", context)


def _portfolio_snapshot_signature():
	payload = {
		"about": list(
			About.objects.order_by("id").values(
				"id",
				"subtitle",
				"description",
				"cgpa",
				"career_objective",
				"education_snapshot",
				"intro_secondary",
				"profile_image_url",
				"updated_at",
			)
		),
		"skills": list(
			Skill.objects.order_by("id").values(
				"id",
				"name",
				"percentage",
				"category",
				"icon_url",
			)
		),
		"projects": list(
			Project.objects.order_by("id").values(
				"id",
				"title",
				"description",
				"tech_stack",
				"github_link",
				"live_demo_link",
				"category",
				"image_url",
				"updated_at",
			)
		),
		"achievements": list(
			Achievement.objects.order_by("id").values(
				"id",
				"title",
				"description",
				"display_order",
				"is_active",
				"image_url",
			)
		),
		"certifications": list(
			Certification.objects.order_by("id").values(
				"id",
				"title",
				"issuer",
				"description",
				"image_url",
				"credential_url",
				"issued_on",
				"display_order",
				"is_active",
			)
		),
		"coding_profiles": list(
			CodingProfile.objects.order_by("id").values(
				"id",
				"platform",
				"username",
				"profile_url",
				"rating",
				"icon_url",
				"display_order",
				"is_active",
				"updated_at",
			)
		),
		"timeline": list(
			TimelineEntry.objects.order_by("id").values(
				"id",
				"page",
				"meta_label",
				"title",
				"description",
				"display_order",
				"is_active",
			)
		),
		"contact_info": list(
			ContactInfo.objects.order_by("id").values(
				"id",
				"location",
				"phone",
				"email",
				"contact_subtitle",
				"linkedin_url",
				"leetcode_url",
				"updated_at",
			)
		),
	}
	serialized = json.dumps(payload, sort_keys=True, default=str, separators=(",", ":"))
	return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def portfolio_changes_signature(request):
	response = JsonResponse({"signature": _portfolio_snapshot_signature()})
	response["Cache-Control"] = "no-store, max-age=0"
	return response


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Skill.objects.all()
	serializer_class = SkillSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Project.objects.all()
	serializer_class = ProjectSerializer


class AboutViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = About.objects.all().order_by("-updated_at")
	serializer_class = AboutSerializer


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Achievement.objects.filter(is_active=True)
	serializer_class = AchievementSerializer


class TimelineEntryViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = TimelineEntry.objects.filter(is_active=True)
	serializer_class = TimelineEntrySerializer


class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Certification.objects.filter(is_active=True)
	serializer_class = CertificationSerializer


class CodingProfileViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = CodingProfile.objects.filter(is_active=True)
	serializer_class = CodingProfileSerializer


class ContactInfoViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = ContactInfo.objects.all().order_by("-updated_at")
	serializer_class = ContactInfoSerializer


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
	queryset = ContactMessage.objects.none()
	serializer_class = ContactMessageSerializer
