# Tinder App Backend API

Laravel-based REST API for Tinder-like dating application.

## Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure database in `.env` file

5. Run migrations:
```bash
php artisan migrate
```

6. Seed database with mock data:
```bash
php artisan db:seed
```

## Test User Credentials

- Email: `test@example.com`
- Password: `password123`

## API Documentation

After setup, access Swagger documentation at:
```
http://localhost:8000/api/documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)

### People
- `GET /api/people/recommended` - Get recommended people (paginated)
- `POST /api/people/{id}/like` - Like a person
- `POST /api/people/{id}/dislike` - Dislike a person
- `GET /api/people/liked` - Get list of liked people
- `DELETE /api/people/{id}/like` - Undo like

## Cronjob

The admin notification cronjob runs hourly:
```bash
php artisan app:check-admin-notifications
```

Add to crontab:
```
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

