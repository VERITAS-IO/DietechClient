import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import i18n from '@/i18n';

const baseURL = 'http://localhost:5256/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Allow-Control-Allow-Origin': '*', 
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    
    const user = useAuthStore.getState().user;
    
    if (user?.tenantId) {
      config.headers['x-tenant-id'] = user.tenantId;
    }
    
    const currentLanguage = i18n.language;

    const acceptLanguage = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';

    config.headers['Accept-Language'] = acceptLanguage || 'tr-TR';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);