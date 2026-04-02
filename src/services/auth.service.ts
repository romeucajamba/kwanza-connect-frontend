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
    const formData = new FormData();
    formData.append('full_name', data.fullName.trim());
    formData.append('email', data.email.toLowerCase());
    formData.append('password', data.password);
    formData.append('password_confirm', data.confirmPassword);
    formData.append('phone', data.phone || '');
    formData.append('country_code', 'AO');

    if (data.docType) formData.append('doc_type', data.docType);
    if (data.docNumber) formData.append('doc_number', data.docNumber);
    if (data.frontDoc) formData.append('front_image', data.frontDoc);
    if (data.backDoc) formData.append('back_image', data.backDoc);

    const response = await api.post(API_ROUTES.AUTH.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
