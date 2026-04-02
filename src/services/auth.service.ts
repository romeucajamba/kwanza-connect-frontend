import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { User, AuthResponse } from '@types';
import type { LoginFormData, RegisterFormData } from '@schema/auth.schema';

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
    // API returns { status: 'success', data: { access, refresh, user } }
    return response.data.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    // API expects full_name
    const payload = {
      full_name: data.fullName.trim(),
      email: data.email,
      password: data.password,
    };
    const response = await api.post(API_ROUTES.AUTH.REGISTER, payload);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },

  getMe: async (): Promise<User> => {
    const response = await api.get(API_ROUTES.AUTH.ME);
    return response.data.data;
  },
};
