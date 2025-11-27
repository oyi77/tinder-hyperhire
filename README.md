# PHP Tinder App

A Tinder-like dating application with React Native mobile frontend and PHP Laravel backend.

## 📱 App Preview

### Screenshots

<div align="center">

| | |
|:---:|:---:|
| **1. Discover Screen** | **2. Like People** |
| ![Discover Screen](https://image.prntscr.com/image/NV2bh-olSWa5AhJhUzdpvQ.png) | ![Like People](https://image.prntscr.com/image/nOvyPJPHTyWl8ca8EkDFEQ.png) |
| Browse and discover people | Swipe right to like someone |
| | |
| **3. Dislike People** | **4. Liked People List** |
| ![Dislike People](https://image.prntscr.com/image/V_HmEtdiRkOsEhdiYIirAg.png) | ![Liked People List](https://image.prntscr.com/image/Af3mLtF_R2-YAi-5aex2nQ.png) |
| Swipe left to pass | View all your matches |

</div>

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

### 📥 Download APK for Testing

Download the production APK to test the app on your Android device:

**[⬇️ Download APK](tinder-hyperhire-production.apk)** (24.3 MB)

> **Note:** The APK is configured to connect to the production API at `https://tinder-hyperhire-production.up.railway.app/api`

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

### Production API
Access Swagger documentation at: **[https://tinder-hyperhire-production.up.railway.app/api/docs](https://tinder-hyperhire-production.up.railway.app/api/docs)**

### Local Development
For local development: `http://localhost:8000/api/docs`

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

