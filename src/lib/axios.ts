import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import i18n from '@/i18n';

const baseURL = 'http://localhost:5256/api/v1';

// Helper to convert string IDs to numbers where needed
const ensureNumberId = (id: string | number | undefined): number | undefined => {
  if (id === undefined) return undefined;
  return typeof id === 'string' ? parseInt(id, 10) : id;
}

// Helper to determine the dieticianId for the current user
const determineDieticianId = (user: any): number | undefined => {
  // If the user already has a dieticianId, use it
  if (user && user.dieticianId !== undefined) {
    return ensureNumberId(user.dieticianId);
  }

  // For users with the 'Dietician' role, their own ID is likely their dieticianId 
  if (user && user.roles && user.roles.includes('Dietician') && user.id) {
    console.warn('Using user.id as dieticianId for Dietician role:', user.id);
    return ensureNumberId(user.id);
  }

  return undefined;
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Allow-Control-Allow-Origin': '*', 
  },
  withCredentials: true,
  timeout: 15000, // 15 second timeout
});

// Enhance the request interceptor with better debugging
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 Sending API request to: ${fullUrl}`, {
      method: config.method?.toUpperCase(),
      params: config.params,
      data: config.data,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    config.withCredentials = true;
    
    const user = useAuthStore.getState().user;
    
    if (user?.tenantId) {
      config.headers['x-tenant-id'] = user.tenantId;
    }
    
    // Check if this is a financial endpoint and we need to add dieticianId
    if (fullUrl.includes('/financials') && config.params) {
      // Only add dieticianId if not already present in params
      if (!config.params.dieticianId) {
        const dieticianId = determineDieticianId(user);
        if (dieticianId) {
          console.log('Adding dieticianId to request params:', dieticianId);
          config.params.dieticianId = dieticianId;
        }
      }
    }
    
    const currentLanguage = i18n.language;

    const acceptLanguage = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';

    config.headers['Accept-Language'] = acceptLanguage || 'tr-TR';
    
    return config;
  },
  (error) => {
    console.error('❌ API request setup error:', error);
    return Promise.reject(error);
  }
);

// Enhance the response interceptor with better debugging
api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL}${response.config.url}`;
    console.log(`✅ API response from ${fullUrl}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    const config = error.config || {};
    const fullUrl = config.url ? `${config.baseURL || ''}${config.url}` : 'unknown endpoint';
    
    console.error(`❌ API error from ${fullUrl}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Return a more descriptive error with the endpoint info
    const enhancedError = new Error(`API Error: ${error.message} [${fullUrl}]`);
    enhancedError.stack = error.stack;
    
    return Promise.reject(error);
  }
);