import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { ExchangeRate, ApiResponse, DashboardStats } from '@types';

export const ratesService = {
  getExchangeRates: async (): Promise<ExchangeRate[]> => {
    const response = await api.get<ApiResponse<ExchangeRate[]>>(API_ROUTES.RATES.BASE);
    return response.data.data;
  },

  convert: async (params: { from: string; to: string; amount: number }): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(API_ROUTES.RATES.CONVERT, { params });
    return response.data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(API_ROUTES.RATES.DASHBOARD);
    return response.data.data;
  },
};
