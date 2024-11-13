/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/axios';
import { ConfirmEmailRequest, ForgotPasswordRequest, LoginRequest, UserRegistrationRequest, UserResponse } from '@/types/auth';

export const authService = {

    async login(data: LoginRequest): Promise<UserResponse> {
      try {
        const response = await api.post<UserResponse>('/authentication/login', data);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          console.log("Error triggered:", error);
          throw new Error(error.response.data.detail || 'Login failed');
        }
        throw new Error('Network error occurred');
      }
    },

  async register(data: UserRegistrationRequest): Promise<void> {
    try {
      await api.post('/authentication/register', {
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

  async confirmEmail(data: ConfirmEmailRequest): Promise<void> {
    try {
      await api.post('/authentication/confirm-email', data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Email confirmation failed');
      }
      throw new Error('Network error occurred');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/authentication/logout');
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Logout failed');
      }
      throw new Error('Network error occurred');
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await api.post('/authentication/forgot-password', data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Password reset request failed');
      }
      throw new Error('Network error occurred');
    }
  },
};

