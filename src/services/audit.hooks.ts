import { useQuery } from '@tanstack/react-query';
import { auditService } from './audit.service';

export const useAuditLogs = (params?: any) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditService.getLogs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
