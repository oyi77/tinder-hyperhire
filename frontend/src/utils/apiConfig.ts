import {Platform} from 'react-native';

// Production API URL
const PRODUCTION_API_URL = 'https://tinder-hyperhire-production.up.railway.app/api';

// Get API base URL based on platform
// iOS Simulator: localhost works
// Android Emulator: use 10.0.2.2 instead of localhost
// Physical Device: use your computer's IP address
// Production: uses Railway production URL
export const getApiBaseUrl = () => {
  // Use production URL if explicitly set or in production build
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    // iOS simulator or web
    return 'http://localhost:8000/api';
  }
  
  // Production build - use Railway production URL
  return PRODUCTION_API_URL;
};

export const API_BASE_URL = getApiBaseUrl();

