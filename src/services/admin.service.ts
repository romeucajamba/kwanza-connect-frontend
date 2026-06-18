import api from './api';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_active: bool;
  is_staff: bool;
  is_verified: bool;
  verification_status: string;
  date_joined: string;
  identity_document?: {
    id: string;
    doc_type: string;
    doc_number: string;
    status: string;
    front_image: string;
    back_image: string;
    pdf_file: string;
    rejection_reason: string;
    submitted_at: string;
  };
}

export interface AdminStats {
  users: { total: number; active: number; pending_kyc: number };
  offers: { total: number; active: number; closed: number };
}

export const adminService = {
  // Dashboard
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/dashboard-stats/');
    return res.data.data;
  },
  
  getAuditLogs: async (page = 1) => {
    const res = await api.get('/admin/audit-logs/', { params: { page } });
    return res.data;
  },

  // Users
  getUsers: async (params?: Record<string, any>) => {
    const res = await api.get('/admin/users/', { params });
    return res.data;
  },

  getUserDetails: async (userId: string): Promise<AdminUser> => {
    const res = await api.get(`/admin/users/${userId}/`);
    return res.data.data;
  },

  updateKYC: async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    const res = await api.post(`/admin/users/${userId}/kyc/`, { action, reason });
    return res.data;
  },

  updateUserStatus: async (userId: string, action: 'block' | 'unblock') => {
    const res = await api.post(`/admin/users/${userId}/status/`, { action });
    return res.data;
  },

  // Offers
  getOffers: async (params?: Record<string, any>) => {
    const res = await api.get('/admin/offers/', { params });
    return res.data;
  },

  updateOfferStatus: async (offerId: string, action: 'close' | 'pause') => {
    const res = await api.post(`/admin/offers/${offerId}/action/`, { action });
    return res.data;
  }
};
