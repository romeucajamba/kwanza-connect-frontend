import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { Currency, Offer, ApiResponse, OfferInterest } from '@types';

export const offersService = {
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await api.get<ApiResponse<Currency[]>>(`${API_ROUTES.OFFERS.BASE}currencies/`);
    return response.data.data;
  },

  getActiveOffers: async (params?: any): Promise<Offer[]> => {
    const response = await api.get<ApiResponse<Offer[]>>(API_ROUTES.OFFERS.BASE, { params });
    return response.data.data;
  },

  getMyOffers: async (): Promise<Offer[]> => {
    const response = await api.get<ApiResponse<Offer[]>>(`${API_ROUTES.OFFERS.BASE}mine/`);
    return response.data.data;
  },

  createOffer: async (data: any): Promise<Offer> => {
    const response = await api.post<ApiResponse<Offer>>(API_ROUTES.OFFERS.BASE, data);
    return response.data.data;
  },

  getOfferDetails: async (id: string): Promise<Offer> => {
    const response = await api.get<ApiResponse<Offer>>(`${API_ROUTES.OFFERS.BASE}${id}/`);
    return response.data.data;
  },

  expressInterest: async (offerId: string, message: string): Promise<OfferInterest> => {
    const response = await api.post<ApiResponse<OfferInterest>>(`${API_ROUTES.OFFERS.BASE}${offerId}/interest/`, { message });
    return response.data.data;
  },
};
