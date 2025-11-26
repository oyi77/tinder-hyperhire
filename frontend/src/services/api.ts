import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthResponse, Profile, LikeResponse} from '../types';
import {API_BASE_URL} from '../utils/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      await AsyncStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    age: number;
    pictures: string[];
    location?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
  },
};

export const peopleService = {
  getRecommended: async (page: number = 1, perPage: number = 15) => {
    const response = await api.get<{
      data: Profile[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/people/recommended', {
      params: {page, per_page: perPage},
    });
    return response.data;
  },

  like: async (id: number): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/people/${id}/like`);
    return response.data;
  },

  dislike: async (id: number): Promise<{message: string}> => {
    const response = await api.post<{message: string}>(`/people/${id}/dislike`);
    return response.data;
  },

  getLiked: async (): Promise<Profile[]> => {
    const response = await api.get<Profile[]>('/people/liked');
    return response.data;
  },

  undoLike: async (id: number): Promise<{message: string}> => {
    const response = await api.delete<{message: string}>(`/people/${id}/like`);
    return response.data;
  },
};

export default api;

