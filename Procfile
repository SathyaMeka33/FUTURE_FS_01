web: python manage.py ensure_admin || true; exec gunicorn portfolio_site.wsgi:application --bind 0.0.0.0:${PORT:-10000} --log-file -
