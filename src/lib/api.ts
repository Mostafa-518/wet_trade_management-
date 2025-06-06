
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { env } from '@/config/env';

// Create the main Axios instance
const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (you can modify this based on your auth strategy)
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (env.IS_DEVELOPMENT) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (env.IS_DEVELOPMENT) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data as any;
      const message = responseData?.message || error.message;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', message);
          break;
        case 500:
          // Server error
          console.error('Server error:', message);
          break;
        default:
          console.error(`API Error ${status}:`, message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
    } else {
      // Other error
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
