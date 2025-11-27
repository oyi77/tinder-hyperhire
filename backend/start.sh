#!/bin/bash
set -e

# Create required directories
mkdir -p bootstrap/cache
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Ensure directories are writable
chmod -R 775 bootstrap/cache storage || true

# Start the application
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}

