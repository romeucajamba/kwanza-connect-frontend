import { useQuery } from '@tanstack/react-query';
import { auditService } from './audit.service';

export const useAuditLogs = (params?: Record<string, string>, enabled = true) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditService.getLogs(params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAuditLogDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: () => auditService.getLogDetail(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
