import { api } from '@/lib/axios';
import { LoginRequest, UserRegistrationRequest, UserResponse } from '@/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  async register(data: UserRegistrationRequest): Promise<void> {
    try {
      await api.post('/auth/register', {
        ...data,
        roles: ['Client'],
      });
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Logout failed');
      }
      throw new Error('Network error occurred');
    }
  },
};