from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about_page, name="about"),
    path("skills/", views.skills_page, name="skills"),
    path("projects/", views.projects_page, name="projects"),
    path("contact/", views.contact_page, name="contact"),
]
