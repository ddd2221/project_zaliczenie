#!/bin/sh
set -e

echo "==> [LocalPulse Backend] Waiting for PostgreSQL database to be ready..."

# Run database migrations
echo "==> [LocalPulse Backend] Running database migrations..."
python manage.py migrate --noinput

# Seed initial database records idempotently
echo "==> [LocalPulse Backend] Seeding initial Polish venues, categories, and events..."
python manage.py seed_events

# Collect static files if needed
echo "==> [LocalPulse Backend] Collecting static files..."
python manage.py collectstatic --noinput || true

# Start development server
echo "==> [LocalPulse Backend] Starting development server on 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000
