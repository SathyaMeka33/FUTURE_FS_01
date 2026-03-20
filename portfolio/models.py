from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Skill(models.Model):
	CATEGORY_CHOICES = [
		("frontend", "Frontend"),
		("programming", "Programming Languages"),
		("tools", "Tools & Core Concepts"),
		("other", "Other"),
	]

	name = models.CharField(max_length=100)
	percentage = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(100)]
	)
	category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
	icon_image = models.ImageField(upload_to="skills/", blank=True, null=True)
	icon_url = models.URLField(blank=True)

	class Meta:
		ordering = ["category", "-percentage", "name"]

	def __str__(self):
		return f"{self.name} ({self.percentage}%)"

	@property
	def icon_source(self):
		if self.icon_image:
			return self.icon_image.url
		return self.icon_url


class Project(models.Model):
	CATEGORY_CHOICES = [
		("web", "Web"),
		("data", "Data"),
		("core", "Core"),
		("other", "Other"),
	]

	title = models.CharField(max_length=200)
	description = models.TextField()
	image = models.ImageField(upload_to="projects/", blank=True, null=True)
	image_url = models.URLField(blank=True)
	tech_stack = models.CharField(max_length=255, help_text="Comma-separated technologies")
	github_link = models.URLField(blank=True)
	live_demo_link = models.URLField(blank=True)
	category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="web")
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self):
		return self.title

	@property
	def tech_tags(self):
		return [item.strip() for item in self.tech_stack.split(",") if item.strip()]

	@property
	def image_source(self):
		if self.image:
			return self.image.url
		return self.image_url


class About(models.Model):
	subtitle = models.TextField(blank=True)
	description = models.TextField()
	cgpa = models.DecimalField(
		max_digits=4,
		decimal_places=2,
		blank=True,
		null=True,
		validators=[MinValueValidator(0), MaxValueValidator(10)],
	)
	career_objective = models.TextField(blank=True)
	education_snapshot = models.TextField(blank=True)
	intro_secondary = models.TextField(blank=True)
	profile_image = models.ImageField(upload_to="about/", blank=True, null=True)
	profile_image_url = models.URLField(blank=True)
	resume_file = models.FileField(upload_to="resume/", blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "About"
		verbose_name_plural = "About"

	def __str__(self):
		return f"About section (updated {self.updated_at:%Y-%m-%d})"

	@property
	def profile_image_source(self):
		if self.profile_image:
			return self.profile_image.url
		return self.profile_image_url


class Achievement(models.Model):
	title = models.CharField(max_length=200)
	description = models.TextField()
	image = models.ImageField(upload_to="achievements/", blank=True, null=True)
	image_url = models.URLField(blank=True)
	display_order = models.PositiveIntegerField(default=1)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["display_order", "-created_at"]

	def __str__(self):
		return self.title

	@property
	def image_source(self):
		if self.image:
			return self.image.url
		return self.image_url


class Certification(models.Model):
	title = models.CharField(max_length=200)
	issuer = models.CharField(max_length=200, blank=True)
	description = models.TextField(blank=True)
	image = models.ImageField(upload_to="certifications/", blank=True, null=True)
	image_url = models.URLField(blank=True)
	credential_url = models.URLField(blank=True)
	issued_on = models.DateField(blank=True, null=True)
	display_order = models.PositiveIntegerField(default=1)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["display_order", "-created_at"]

	def __str__(self):
		return self.title

	@property
	def image_source(self):
		if self.image:
			return self.image.url
		return self.image_url


class CodingProfile(models.Model):
	PLATFORM_CHOICES = [
		("leetcode", "LeetCode"),
		("codechef", "CodeChef"),
		("codeforces", "Codeforces"),
		("other", "Other"),
	]

	platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default="other")
	username = models.CharField(max_length=120)
	profile_url = models.URLField()
	rating = models.CharField(max_length=50, blank=True)
	icon_image = models.ImageField(upload_to="coding_profiles/", blank=True, null=True)
	icon_url = models.URLField(blank=True)
	display_order = models.PositiveIntegerField(default=1)
	is_active = models.BooleanField(default=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["display_order", "platform", "username"]

	def __str__(self):
		return f"{self.get_platform_display()} - {self.username}"

	@property
	def icon_source(self):
		if self.icon_image:
			return self.icon_image.url
		return self.icon_url


class TimelineEntry(models.Model):
	PAGE_CHOICES = [
		("home", "Home About Timeline"),
		("about", "About Page Timeline"),
	]

	page = models.CharField(max_length=20, choices=PAGE_CHOICES, default="about")
	meta_label = models.CharField(max_length=80, help_text="Examples: Present, Completed, 2025")
	title = models.CharField(max_length=200)
	description = models.TextField()
	display_order = models.PositiveIntegerField(default=1)
	is_active = models.BooleanField(default=True)

	class Meta:
		ordering = ["display_order", "id"]

	def __str__(self):
		return f"{self.get_page_display()} - {self.title}"


class ContactInfo(models.Model):
	location = models.CharField(max_length=200)
	phone = models.CharField(max_length=40)
	email = models.EmailField()
	contact_subtitle = models.TextField(blank=True)
	linkedin_url = models.URLField(blank=True)
	leetcode_url = models.URLField(blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Contact Info"
		verbose_name_plural = "Contact Info"

	def __str__(self):
		return f"Contact Info ({self.email})"


class ContactMessage(models.Model):
	name = models.CharField(max_length=120)
	email = models.EmailField()
	message = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-timestamp"]

	def __str__(self):
		return f"{self.name} - {self.email}"
