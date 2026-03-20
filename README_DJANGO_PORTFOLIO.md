# Dynamic Portfolio (Django)

This project converts your static portfolio into a dynamic Django-powered portfolio where content is editable from admin.

Important:
- Do not run this site with VS Code Live Server.
- Always run with Django: `python manage.py runserver`

## Features Implemented

- Dynamic models for Skills, Projects, About, Contact Messages
- Extra dynamic models for Achievements, Timeline Entries, and Contact Info
- Admin customization: list display, search, filters
- Dynamic template rendering for home, about, skills, projects, contact
- Certifications section with image upload/URL support
- Working contact form with success message and database save
- Media upload support for project/about images and resume
- Projects search, category filter, pagination
- REST API endpoints (DRF)

## Project Structure

- portfolio_site/ (project settings and root URLs)
- portfolio/ (app with models, admin, views, forms, serializers, URLs, API URLs)
- templates/portfolio/ (Django templates)
- static/ (existing CSS, JS, images moved for Django static serving)
- media/ (uploaded files created at runtime)

## Models

1. Skill
- name
- percentage

2. Project
- title
- description
- image
- image_url
- tech_stack
- github_link
- live_demo_link
- category
- created_at
- updated_at

3. About
- subtitle
- description
- career_objective
- education_snapshot
- intro_secondary
- profile_image
- profile_image_url
- resume_file (optional)
- updated_at

4. ContactMessage
- name
- email
- message
- timestamp

5. Achievement
- title
- description
- image
- image_url
- display_order
- is_active

6. TimelineEntry
- page (home/about)
- meta_label
- title
- description
- display_order
- is_active

7. ContactInfo
- location
- phone
- email
- contact_subtitle
- linkedin_url
- leetcode_url

8. Certification
- title
- issuer
- description
- image
- image_url
- credential_url
- issued_on
- display_order
- is_active

## Run Steps

1. Activate virtual environment (PowerShell):
   .\.venv\Scripts\Activate.ps1

2. Install dependencies (if needed):
   pip install django djangorestframework pillow

3. Run migrations:
   python manage.py makemigrations
   python manage.py migrate

4. Create admin user:
   python manage.py createsuperuser

5. Seed sample data (one command):
   python manage.py seed_portfolio

   Optional reset + reseed:
   python manage.py seed_portfolio --reset

6. Start development server:
   python manage.py runserver

7. Open URLs:
- Portfolio: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- API root: http://127.0.0.1:8000/api/

Do not open top-level static files with Live Server for this project workflow.

## API Endpoints

- /api/skills/
- /api/projects/
- /api/about/
- /api/achievements/
- /api/timeline/
- /api/certifications/
- /api/contact-info/
- /api/contact-messages/ (POST)

## Admin Workflow

1. Add About record first (description, profile image, optional resume)
2. Add Skills with percentages, category, icon image/icon URL
3. Add Projects with image or image URL, category, GitHub/live links
4. Add Achievements with image or image URL
5. Extend timeline anytime from Timeline Entry table (set page + display order)
6. Update direct contact details from Contact Info table
7. Add Certifications (image upload or image URL) from Certification table
8. View Contact Messages from contact form submissions

## Notes

- Frontend style and JS are preserved by reusing your existing CSS/JS in static/.
- All dynamic content now comes from Django models and admin.
