import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update an admin user from environment variables."

    def handle(self, *args, **options):
        username = (
            os.getenv("ADMIN_USERNAME", "").strip()
            or os.getenv("DJANGO_SUPERUSER_USERNAME", "").strip()
        )
        password = (
            os.getenv("ADMIN_PASSWORD", "").strip()
            or os.getenv("DJANGO_SUPERUSER_PASSWORD", "").strip()
        )
        email = (
            os.getenv("ADMIN_EMAIL", "").strip()
            or os.getenv("DJANGO_SUPERUSER_EMAIL", "").strip()
            or "admin@example.com"
        )

        if not username or not password:
            User = get_user_model()
            existing = list(
                User.objects.filter(is_superuser=True).values_list("username", flat=True)
            )
            if existing:
                self.stdout.write(
                    "ensure_admin skipped: no ADMIN/DJANGO_SUPERUSER credentials set. "
                    f"Existing superusers: {', '.join(existing)}"
                )
            else:
                self.stdout.write(
                    "ensure_admin skipped: no ADMIN/DJANGO_SUPERUSER credentials set "
                    "and no superuser exists."
                )
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
