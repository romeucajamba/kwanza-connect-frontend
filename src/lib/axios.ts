import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_X_API_KEY || '', // Mandatory API Key
  },
});

// Interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('kwanza_access_token'); // Updated cookie name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle unauthorized or token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('kwanza_access_token');
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    
    // Security: Filter/mask error response data if it contains sensitive keys
    const maskedError = { ...error };
    if (maskedError.response?.data) {
       // Only expose 'message' or common fields to UI
       const { message, errors } = maskedError.response.data;
       maskedError.response.data = { message, errors };
    }
    
    return Promise.reject(maskedError);
  }
);
