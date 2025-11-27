import React, {useEffect} from 'react';
import {RecoilRoot, useSetRecoilState} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';
import {userState, isAuthenticatedState} from './store/authState';
import {authService} from './services/api';
import {getErrorMessage} from './utils/errorHandler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        // Errors are already transformed by axios interceptor
        // This is just a fallback for any errors that bypass the interceptor
        console.error('Query error:', getErrorMessage(error));
      },
    },
    mutations: {
      onError: (error: any) => {
        // Errors are already transformed by axios interceptor
        // This is just a fallback for any errors that bypass the interceptor
        console.error('Mutation error:', getErrorMessage(error));
      },
    },
  },
});

const AppContent: React.FC = () => {
  const setUser = useSetRecoilState(userState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Token exists, assume user is authenticated
          // The API will handle invalid tokens
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;

