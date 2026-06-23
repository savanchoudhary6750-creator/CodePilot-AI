import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Registry for dynamic unauthorized/logout callback to avoid circular dependencies
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// Request Interceptor: Attach Auth Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized errors and handle data formatting
api.interceptors.response.use(
  (response) => {
    // Return data property directly
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (onUnauthorized) {
        await onUnauthorized();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Normalize error message to fit existing error boundaries
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    const normalizedError = new Error(errorMessage);
    normalizedError.status = error.response?.status;
    normalizedError.response = error.response;
    return Promise.reject(normalizedError);
  }
);

export default api;
