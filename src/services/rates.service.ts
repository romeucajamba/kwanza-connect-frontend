import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { ExchangeRate, ApiResponse, DashboardStats } from '@types';

export const ratesService = {
  getExchangeRates: async (): Promise<ExchangeRate[]> => {
    const response = await api.get<ApiResponse<ExchangeRate[]>>(API_ROUTES.RATES.BASE);
    return response.data.data;
  },

  getCurrencies: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<ExchangeRate[]>>(API_ROUTES.RATES.BASE);
    const rates = response.data.data;
    
    // Extrair moedas únicas de from_currency e to_currency
    const currencyMap = new Map<string, any>();
    rates.forEach(rate => {
      if (rate.from_currency) currencyMap.set(rate.from_currency.code, rate.from_currency);
      if (rate.to_currency) currencyMap.set(rate.to_currency.code, rate.to_currency);
    });
    
    return Array.from(currencyMap.values());
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
