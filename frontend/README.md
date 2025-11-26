# Tinder App - React Native Frontend

React Native mobile application for Tinder-like dating app.

## Quick Start

### Prerequisites
- Node.js 16+
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **For iOS (Mac only):**
```bash
cd ios && pod install && cd ..
```

3. **For Android:**
   - Install Android Studio
   - Set up Android SDK
   - Create an emulator (see ANDROID_SETUP.md)
   - Or connect a physical device

### Running the App

**Start Backend First:**
```bash
cd ../backend
php artisan serve
```

**Then run the app:**

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
# Make sure emulator is running or device is connected
npm run android
```

**Start Metro Bundler:**
```bash
npm start
```

## Test Credentials

- Email: `test@example.com`
- Password: `password123`

## API Configuration

The API URL is automatically configured:
- **iOS Simulator**: `http://localhost:8000/api`
- **Android Emulator**: `http://10.0.2.2:8000/api`
- **Physical Device**: Update `src/utils/apiConfig.ts` with your computer's IP

## Project Structure (Atomic Design)

- **atoms**: Basic UI components (Text, Button, Card)
- **molecules**: Composite components (ProfileCard)
- **organisms**: Complex components (SwipeableCard)
- **screens**: Screen components (LoginScreen, PeopleListScreen, LikedPeopleScreen)
- **services**: API services
- **store**: Recoil state management
- **navigation**: Navigation configuration

## Features

- ✅ People List Screen with swipe functionality
- ✅ Liked People List Screen
- ✅ Undo like feature
- ✅ Login/Authentication
- ✅ React Query for data fetching
- ✅ Recoil for state management

## Troubleshooting

### Android Issues
See [ANDROID_SETUP.md](ANDROID_SETUP.md) for detailed Android setup instructions.

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### API Connection Issues
- Verify backend is running
- Check API URL in `src/utils/apiConfig.ts`
- For physical devices, use your computer's IP address
