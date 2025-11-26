# PHP Tinder App

A Tinder-like dating application with React Native mobile frontend and PHP Laravel backend.

## Project Structure

```
.
├── backend/          # Laravel API backend
├── frontend/         # React Native mobile app
└── README.md
```

## Backend Setup

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Quick Start

1. Install dependencies: `composer install`
2. Configure `.env` file
3. Run migrations: `php artisan migrate`
4. Seed database: `php artisan db:seed`
5. Start server: `php artisan serve`

### Test User

- Email: `test@example.com`
- Password: `password123`

## Frontend Setup

See [frontend/README.md](frontend/README.md) for detailed setup instructions.

### Quick Start

1. Install dependencies: `npm install`
2. Update API URL in `src/services/api.ts`
3. Run iOS: `npm run ios`
4. Run Android: `npm run android`

## Features

### Backend
- User authentication (register, login, logout)
- Recommended people list with pagination
- Like/dislike functionality
- Liked people list
- Undo like feature
- Admin email notifications (cronjob for 50+ likes)
- Swagger API documentation

### Frontend
- People list screen with swipe functionality
- Liked people list screen
- Undo like feature
- Atomic Design component structure
- Recoil state management
- React Query for data fetching

## API Documentation

Access Swagger documentation at: `http://localhost:8000/api/documentation`

## Development

### Backend
- PHP 8.1+
- Laravel 10
- MySQL/PostgreSQL

### Frontend
- React Native 0.72
- TypeScript
- Recoil
- React Query

