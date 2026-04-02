import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { Transaction, ApiResponse } from '@types';

export const transactionsService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<ApiResponse<Transaction[]>>(API_ROUTES.TRANSACTIONS.BASE);
    return response.data.data;
  },

  getTransactionDetails: async (id: string): Promise<Transaction> => {
    const response = await api.get<ApiResponse<Transaction>>(`${API_ROUTES.TRANSACTIONS.BASE}${id}/`);
    return response.data.data;
  },

  confirmTransaction: async (data: { offer: string; room: string; notes?: string }): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>(API_ROUTES.TRANSACTIONS.CONFIRM, data);
    return response.data.data;
  },
};
