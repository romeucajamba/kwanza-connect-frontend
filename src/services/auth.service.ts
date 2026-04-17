import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { User, AuthResponse } from '@types';
import type { LoginFormData, RegisterFormData } from 'src/schemas/auth.schema';

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

  forgotPassword: async (email: string) => {
    const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    // A API do backend espera o token na URL: /auth/verify-email/<token>/
    const response = await api.get(`${API_ROUTES.AUTH.VERIFY_EMAIL}${token}/`);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch(API_ROUTES.AUTH.ME, data);
    return response.data.data;
  },

  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.patch(API_ROUTES.AUTH.ME, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  changePassword: async (data: any): Promise<void> => {
    await api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
  },

  submitKYC: async (data: any): Promise<void> => {
    const formData = new FormData();
    formData.append('doc_type', data.doc_type);
    formData.append('doc_number', data.doc_number);
    formData.append('front_image', data.front_image);
    formData.append('back_image', data.back_image);

    await api.post(API_ROUTES.AUTH.KYC_SUBMIT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getKYCStatus: async (): Promise<any> => {
    const response = await api.get(API_ROUTES.AUTH.KYC_STATUS);
    return response.data;
  },

  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get(API_ROUTES.AUTH.USER_PROFILE(userId));
    return response.data.data;
  },
};
