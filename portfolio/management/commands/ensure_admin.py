import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update an admin user from environment variables."

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME", "").strip()
        password = os.getenv("ADMIN_PASSWORD", "").strip()
        email = os.getenv("ADMIN_EMAIL", "admin@example.com").strip() or "admin@example.com"

        if not username or not password:
            self.stdout.write("ensure_admin skipped: ADMIN_USERNAME/ADMIN_PASSWORD not set.")
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if not created:
            user.email = email
            user.is_staff = True
            user.is_superuser = True

        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(f"ensure_admin: {action} superuser '{username}'.")
