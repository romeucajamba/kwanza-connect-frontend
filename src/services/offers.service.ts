import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { Currency, Offer, ApiResponse, OfferInterest } from '@types';

// ─── Payload Types ────────────────────────────────────────────────────────────
export interface CreateOfferPayload {
  give_currency_code: string;
  want_currency_code: string;
  give_amount: string;
  want_amount: string;
}

export interface ExpressInterestPayload {
  message?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export const offersService = {
  // GET /api/offers/currencies/
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await api.get<ApiResponse<Currency[]>>(API_ROUTES.OFFERS.CURRENCIES);
    return response.data.data;
  },

  // GET /api/offers/
  getActiveOffers: async (params?: Record<string, string>): Promise<Offer[]> => {
    const response = await api.get<ApiResponse<Offer[]>>(API_ROUTES.OFFERS.BASE, { params });
    return response.data.data;
  },

  // POST /api/offers/
  createOffer: async (data: CreateOfferPayload): Promise<Offer> => {
    const response = await api.post<ApiResponse<Offer>>(API_ROUTES.OFFERS.BASE, data);
    return response.data.data;
  },

  // GET /api/offers/mine/
  getMyOffers: async (): Promise<Offer[]> => {
    const response = await api.get<ApiResponse<Offer[]>>(API_ROUTES.OFFERS.MINE);
    return response.data.data;
  },

  // GET /api/offers/<offer_id>/
  getOfferDetails: async (id: string): Promise<Offer> => {
    const response = await api.get<ApiResponse<Offer>>(`${API_ROUTES.OFFERS.BASE}${id}/`);
    return response.data.data;
  },

  // POST /api/offers/<offer_id>/pause/
  pauseOffer: async (id: string): Promise<Offer> => {
    const response = await api.post<ApiResponse<Offer>>(`${API_ROUTES.OFFERS.BASE}${id}/pause/`);
    return response.data.data;
  },

  // POST /api/offers/<offer_id>/resume/
  resumeOffer: async (id: string): Promise<Offer> => {
    const response = await api.post<ApiResponse<Offer>>(`${API_ROUTES.OFFERS.BASE}${id}/resume/`);
    return response.data.data;
  },

  // POST /api/offers/<offer_id>/close/
  closeOffer: async (id: string): Promise<Offer> => {
    const response = await api.post<ApiResponse<Offer>>(`${API_ROUTES.OFFERS.BASE}${id}/close/`);
    return response.data.data;
  },

  // GET /api/offers/<offer_id>/interests/
  getOfferInterests: async (offerId: string): Promise<OfferInterest[]> => {
    const response = await api.get<ApiResponse<OfferInterest[]>>(
      `${API_ROUTES.OFFERS.BASE}${offerId}/interests/`
    );
    return response.data.data;
  },

  // POST /api/offers/<offer_id>/interest/
  expressInterest: async (offerId: string, payload: ExpressInterestPayload = {}): Promise<OfferInterest> => {
    const response = await api.post<ApiResponse<OfferInterest>>(
      `${API_ROUTES.OFFERS.BASE}${offerId}/interest/`,
      payload
    );
    return response.data.data;
  },

  // GET /api/offers/interests/mine/
  getMyInterests: async (): Promise<OfferInterest[]> => {
    const response = await api.get<ApiResponse<OfferInterest[]>>(API_ROUTES.OFFERS.INTERESTS_MINE);
    return response.data.data;
  },

  // POST /api/offers/interests/<interest_id>/accept/
  acceptInterest: async (interestId: string): Promise<OfferInterest> => {
    const response = await api.post<ApiResponse<OfferInterest>>(
      `${API_ROUTES.OFFERS.BASE}interests/${interestId}/accept/`
    );
    return response.data.data;
  },

  // POST /api/offers/interests/<interest_id>/reject/
  rejectInterest: async (interestId: string): Promise<OfferInterest> => {
    const response = await api.post<ApiResponse<OfferInterest>>(
      `${API_ROUTES.OFFERS.BASE}interests/${interestId}/reject/`
    );
    return response.data.data;
  },

  // POST /api/offers/interests/<interest_id>/cancel/
  cancelInterest: async (interestId: string): Promise<OfferInterest> => {
    const response = await api.post<ApiResponse<OfferInterest>>(
      `${API_ROUTES.OFFERS.BASE}interests/${interestId}/cancel/`
    );
    return response.data.data;
  },
};
