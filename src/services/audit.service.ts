import { api } from '@lib/axios';
import type { ApiResponse } from '@types';

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resource_id?: string;
  metadata: any;
  timestamp: string;
  ip_address?: string;
  user_name?: string;
}

export const auditService = {
  getLogs: async (params?: any): Promise<AuditLog[]> => {
    const response = await api.get<ApiResponse<AuditLog[]>>('/api/audit/logs/', { params });
    // Alguns endpoints do DRF com ViewSet sem paginação retornam direto
    // Mas se o ApiResponse for o padrão do projeto:
    return (response.data as any).results || response.data.data || response.data;
  },
};
