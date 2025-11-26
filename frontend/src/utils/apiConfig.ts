import {Platform} from 'react-native';

// Get API base URL based on platform
// iOS Simulator: localhost works
// Android Emulator: use 10.0.2.2 instead of localhost
// Physical Device: use your computer's IP address
export const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    // iOS simulator or web
    return 'http://localhost:8000/api';
  }
  // Production - update this to your production API URL
  return 'https://your-api-domain.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

