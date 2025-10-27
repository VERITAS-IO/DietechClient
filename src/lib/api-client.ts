import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import i18n from '@/i18n';

// Environment configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5256/api/v1';

// Helper to convert string IDs to numbers where needed
const ensureNumberId = (id: string | number | undefined): number | undefined => {
  if (id === undefined) return undefined;
  return typeof id === 'string' ? parseInt(id, 10) : id;
};

// Helper to determine the dieticianId for the current user
const determineDieticianId = (user: { dieticianId?: number | string; id?: number | string; roles?: string[] } | null): number | undefined => {
  if (!user) return undefined;
  
  // If the user already has a dieticianId, use it
  if (user.dieticianId !== undefined) {
    return ensureNumberId(user.dieticianId);
  }

  // For users with the 'Dietician' role, their own ID is likely their dieticianId 
  if (user.roles && Array.isArray(user.roles) && user.roles.includes('Dietician') && user.id) {
    return ensureNumberId(user.id);
  }

  return undefined;
};

// Create the unified API client
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get user from auth store
    const user = useAuthStore.getState().user;
    
    // Add tenant ID if available
    if (user?.tenantId) {
      config.headers['x-tenant-id'] = user.tenantId;
    }
    
    // Add dieticianId for financial endpoints
    if (config.url?.includes('/financials') && config.params) {
      if (!config.params.dieticianId) {
        const dieticianId = determineDieticianId(user);
        if (dieticianId) {
          config.params.dieticianId = dieticianId;
        }
      }
    }
    
    // Add language header
    const currentLanguage = i18n.language;
    const acceptLanguage = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';
    config.headers['Accept-Language'] = acceptLanguage || 'tr-TR';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
    }
    
    return Promise.reject(error);
  }
);

// Export types for better TypeScript support
export type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
