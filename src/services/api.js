// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Navigation callback - will be set by AuthContext
let navigationCallback = null;

// Function to set navigation callback from React Router
export const setNavigationCallback = (callback) => {
  navigationCallback = callback;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle FormData - don't force JSON Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Use React Router navigation instead of window.location
      if (navigationCallback) {
        navigationCallback('/login');
      } else {
        // Fallback for cases where callback isn't set yet
        console.warn('Navigation callback not set, using window.location as fallback');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;