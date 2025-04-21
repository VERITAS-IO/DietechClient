import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const baseURL = 'http://localhost:5256/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    
    // Get the current user from auth store
    const user = useAuthStore.getState().user;
    
    // If user is authenticated and has a tenant ID, add it to headers
    if (user?.tenantId) {
      config.headers['x-tenant-id'] = user.tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);