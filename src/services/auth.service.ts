import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { User, AuthResponse } from '@types';
import type { LoginFormData, RegisterFormData } from '@schema/auth.schema';

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },

  getMe: async (): Promise<User> => {
    const response = await api.get(API_ROUTES.AUTH.ME);
    return response.data;
  },
};
