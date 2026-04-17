import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { Transaction, ApiResponse } from '@types';

export const transactionsService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<ApiResponse<Transaction[]>>(API_ROUTES.TRANSACTIONS.BASE);
    return response.data.data;
  },

  getTransactionDetails: async (id: string): Promise<Transaction> => {
    const response = await api.get<ApiResponse<Transaction>>(API_ROUTES.TRANSACTIONS.DETAIL(id));
    return response.data.data;
  },

  confirmTransaction: async (data: { offer: string; room: string }): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>(API_ROUTES.TRANSACTIONS.CONFIRM, data);
    return response.data.data;
  },

  reviewTransaction: async (id: string, data: { rating: number; comment?: string }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(API_ROUTES.TRANSACTIONS.REVIEW(id), data);
    return response.data.data;
  },

  getUserReviews: async (userId: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`${API_ROUTES.TRANSACTIONS.REVIEWS(userId)}`);
    return response.data.data;
  },
};
