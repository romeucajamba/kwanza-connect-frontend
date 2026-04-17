import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { ApiResponse } from '@types';

export interface AuditLog {
  id: string;
  event_type: string;
  actor: string;
  timestamp: string;
  ip_address: string;
  status: string;
  description: string;
  payload?: any;
}

export const auditService = {
  // GET /api/audit/logs/
  getLogs: async (params?: Record<string, string>): Promise<AuditLog[]> => {
    const response = await api.get<ApiResponse<AuditLog[]>>(API_ROUTES.AUDIT.LOGS, { params });
    return response.data.data;
  },

  // GET /api/audit/logs/<id>/
  getLogDetail: async (id: string): Promise<AuditLog> => {
    const response = await api.get<ApiResponse<AuditLog>>(API_ROUTES.AUDIT.LOG_DETAIL(id));
    return response.data.data;
  },
};
