from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from portfolio.models import Achievement, About, Certification, CodingProfile, ContactInfo, Project, Skill, TimelineEntry


class Command(BaseCommand):
    help = "Seed sample portfolio data for About, Skills, Projects, Achievements, Certifications, Timeline, and Contact Info."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing portfolio section records before seeding.",
        )

    def handle(self, *args, **options):
        if options["reset"]:
            TimelineEntry.objects.all().delete()
            Achievement.objects.all().delete()
            Certification.objects.all().delete()
            CodingProfile.objects.all().delete()
            ContactInfo.objects.all().delete()
            Project.objects.all().delete()
            Skill.objects.all().delete()
            About.objects.all().delete()
            self.stdout.write(self.style.WARNING("Existing portfolio data cleared."))

        self._seed_about()
        self._seed_skills()
        self._seed_projects()
        self._seed_achievements()
        self._seed_certifications()
        self._seed_coding_profiles()
        self._seed_timeline()
        self._seed_contact_info()

        self.stdout.write(self.style.SUCCESS("Portfolio sample data seeded successfully."))

    def _image_path(self, file_name: str) -> Path:
        return Path(settings.BASE_DIR) / "static" / "images" / file_name

    def _attach_image(self, model_instance, field_name: str, file_name: str):
        image_path = self._image_path(file_name)
        if not image_path.exists():
            self.stdout.write(self.style.WARNING(f"Image not found: {image_path}"))
            return

        with image_path.open("rb") as image_file:
            getattr(model_instance, field_name).save(file_name, File(image_file), save=False)

    def _seed_about(self):
        about = About.objects.order_by("-updated_at").first()
        if not about:
            about = About(
                subtitle=(
                    "Motivated engineering student focused on scalable software, "
                    "data-driven thinking, and collaborative product building."
                ),
                description=(
                    "I am Sathya Narayana Meka, a Data Science student and aspiring software "
                    "developer. I enjoy building practical, user-focused applications with "
                    "Python, Django, SQL, and modern frontend tools."
                ),
                cgpa=9.00,
                career_objective=(
                    "I aim to apply strong fundamentals in Python, Java, SQL, and Git while "
                    "learning through real-world engineering challenges and collaborative development."
                ),
                education_snapshot=(
                    "B.Tech in Data Science at Aditya College of Engineering and Technology, "
                    "with strong academic performance in intermediate and SSC levels."
                ),
                intro_secondary=(
                    "I actively practice problem-solving through competitive programming and "
                    "LeetCode, and I value code quality with continuous learning."
                ),
            )
            self._attach_image(about, "profile_image", "sathya_nobg.png")
            about.save()
            self.stdout.write(self.style.SUCCESS("About section created."))
        else:
            self.stdout.write("About section already exists. Skipped.")

    def _seed_skills(self):
        skills = [
            ("React", 75, "frontend", "physics.png"),
            ("JavaScript", 78, "frontend", "js.png"),
            ("CSS3", 84, "frontend", "css-3.png"),
            ("HTML5", 88, "frontend", "html.png"),
            ("Python", 90, "programming", "python.png"),
            ("Java", 80, "programming", "java.png"),
            ("C", 74, "programming", "letter-c.png"),
            ("SQL Databases", 82, "programming", "sql-server.png"),
            ("Git / GitHub", 80, "tools", "github-sign.png"),
            ("VS Code", 85, "tools", "vs code.png"),
            ("DSA & Algorithms", 83, "tools", "brain-circuit.png"),
            ("DBMS & OOP", 82, "tools", "sql-server.png"),
        ]

        for name, percentage, category, icon_name in skills:
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={"percentage": percentage, "category": category},
            )
            skill.percentage = percentage
            skill.category = category

            if not skill.icon_image:
                self._attach_image(skill, "icon_image", icon_name)

            skill.save()

        self.stdout.write(self.style.SUCCESS("Skills seeded/updated."))

    def _seed_projects(self):
        project_data = [
            {
                "title": "Career OS Platform",
                "description": (
                    "AI-powered career guidance platform that provides personalized "
                    "recommendations based on user skills and interests."
                ),
                "image_name": "ATF.png",
                "tech_stack": "Python,Django,SQL,REST API",
                "github_link": "https://github.com/",
                "live_demo_link": "",
                "category": "web",
                "image_url": "",
            },
            {
                "title": "GFG and GDG Hackathon Project",
                "description": (
                    "Team collaboration project built during a hackathon with focus on "
                    "clean architecture, version control, and rapid prototyping."
                ),
                "image_name": "GFG.jpeg",
                "tech_stack": "GitHub,Teamwork,Problem Solving,Web",
                "github_link": "https://github.com/",
                "live_demo_link": "",
                "category": "data",
                "image_url": "",
            },
            {
                "title": "Competitive Programming Journey",
                "description": (
                    "Structured problem-solving practice through algorithmic challenges "
                    "and coding contests to improve DSA fundamentals."
                ),
                "image_name": "FS.png",
                "tech_stack": "DSA,Algorithms,LeetCode,OOP",
                "github_link": "https://github.com/",
                "live_demo_link": "https://leetcode.com/",
                "category": "core",
                "image_url": "",
            },
        ]

        for payload in project_data:
            image_name = payload.pop("image_name")
            project, created = Project.objects.get_or_create(
                title=payload["title"],
                defaults=payload,
            )

            if not created:
                for key, value in payload.items():
                    setattr(project, key, value)

            if not project.image:
                self._attach_image(project, "image", image_name)

            project.save()

        self.stdout.write(self.style.SUCCESS("Projects seeded/updated."))

    def _seed_achievements(self):
        achievements = [
            ("ATF 2025", "Qualified as a second round candidate.", "ATF.png", 1),
            (
                "Hackathon Participation",
                "Participated in GFG and GDG collaborative hackathon events.",
                "GFG.jpeg",
                2,
            ),
            (
                "Azure Essentials",
                "Completed Microsoft and LinkedIn Learning certification track.",
                "FS.png",
                3,
            ),
        ]

        for title, description, image_name, order in achievements:
            achievement, _ = Achievement.objects.get_or_create(
                title=title,
                defaults={
                    "description": description,
                    "display_order": order,
                    "is_active": True,
                },
            )
            achievement.description = description
            achievement.display_order = order
            achievement.is_active = True
            if not achievement.image:
                self._attach_image(achievement, "image", image_name)
            achievement.save()

        self.stdout.write(self.style.SUCCESS("Achievements seeded/updated."))

    def _seed_certifications(self):
        certifications = [
            (
                "Azure Essentials",
                "Microsoft + LinkedIn Learning",
                "Completed Azure Essentials certification track.",
                "FS.png",
                1,
                "",
            ),
            (
                "ATF 2025 Qualification",
                "ATF",
                "Qualified as a second round candidate in ATF 2025.",
                "ATF.png",
                2,
                "",
            ),
        ]

        for title, issuer, description, image_name, display_order, credential_url in certifications:
            certification, _ = Certification.objects.get_or_create(
                title=title,
                defaults={
                    "issuer": issuer,
                    "description": description,
                    "display_order": display_order,
                    "credential_url": credential_url,
                    "is_active": True,
                },
            )
            certification.issuer = issuer
            certification.description = description
            certification.display_order = display_order
            certification.credential_url = credential_url
            certification.is_active = True
            if not certification.image:
                self._attach_image(certification, "image", image_name)
            certification.save()

        self.stdout.write(self.style.SUCCESS("Certifications seeded/updated."))

    def _seed_timeline(self):
        entries = [
            (
                "home",
                "Present",
                "B.Tech in Data Science",
                "Aditya College of Engineering and Technology. Coursework includes Data Structures, OOP, DBMS, Statistics, Python Programming, and SQL.",
                1,
            ),
            (
                "home",
                "Completed",
                "Intermediate / 12th Standard",
                "Rajiv Gandhi University of Knowledge Technologies with 94.6%.",
                2,
            ),
            (
                "home",
                "Completed",
                "SSC / 10th Standard",
                "ZPHS Vetlapalem with 94.5%.",
                3,
            ),
            (
                "about",
                "Present",
                "B.Tech in Data Science",
                "Aditya College of Engineering and Technology. Coursework includes Data Structures, OOP, DBMS, Statistics, Python Programming, and SQL.",
                1,
            ),
            (
                "about",
                "Completed",
                "Intermediate / 12th Standard",
                "Rajiv Gandhi University of Knowledge Technologies with 94.6%.",
                2,
            ),
            (
                "about",
                "Completed",
                "SSC / 10th Standard",
                "ZPHS Vetlapalem with 94.5%.",
                3,
            ),
        ]

        for page, meta_label, title, description, display_order in entries:
            TimelineEntry.objects.update_or_create(
                page=page,
                title=title,
                defaults={
                    "meta_label": meta_label,
                    "description": description,
                    "display_order": display_order,
                    "is_active": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("Timeline entries seeded/updated."))

    def _seed_coding_profiles(self):
        profiles = [
            ("leetcode", "sathya", "https://leetcode.com/", "", 1),
            ("codechef", "sathya", "https://www.codechef.com/", "", 2),
            ("codeforces", "sathya", "https://codeforces.com/", "", 3),
        ]

        for platform, username, profile_url, rating, order in profiles:
            coding_profile, _ = CodingProfile.objects.get_or_create(
                platform=platform,
                username=username,
                defaults={
                    "profile_url": profile_url,
                    "rating": rating,
                    "display_order": order,
                    "is_active": True,
                },
            )
            coding_profile.profile_url = profile_url
            coding_profile.rating = rating
            coding_profile.display_order = order
            coding_profile.is_active = True
            coding_profile.save()

        self.stdout.write(self.style.SUCCESS("Coding profiles seeded/updated."))

    def _seed_contact_info(self):
        info, _ = ContactInfo.objects.get_or_create(
            email="innovativeden0@gmail.com",
            defaults={
                "location": "Rajahmundry, Andhra Pradesh",
                "phone": "+91 9703629727",
                "contact_subtitle": "Open to software and data-focused internship opportunities.",
                "linkedin_url": "https://www.linkedin.com/in/mekasathya/",
                "leetcode_url": "https://leetcode.com",
            },
        )

        info.location = info.location or "Rajahmundry, Andhra Pradesh"
        info.phone = info.phone or "+91 9703629727"
        info.contact_subtitle = info.contact_subtitle or "Open to software and data-focused internship opportunities."
        info.save()
        self.stdout.write(self.style.SUCCESS("Contact info seeded/updated."))
