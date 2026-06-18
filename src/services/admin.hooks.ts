import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from './admin.service';

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => ['admin', 'stats'] as const,
  users: (params?: Record<string, any>) => ['admin', 'users', params] as const,
  userDetails: (id: string) => ['admin', 'users', id] as const,
  offers: (params?: Record<string, any>) => ['admin', 'offers', params] as const,
  logs: (page: number) => ['admin', 'logs', page] as const,
};

export const useAdminStats = () => 
  useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats(),
  });

export const useAdminUsers = (params?: Record<string, any>) =>
  useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
  });

export const useAdminUserDetails = (userId: string) =>
  useQuery({
    queryKey: adminKeys.userDetails(userId),
    queryFn: () => adminService.getUserDetails(userId),
    enabled: !!userId,
  });

export const useAdminOffers = (params?: Record<string, any>) =>
  useQuery({
    queryKey: adminKeys.offers(params),
    queryFn: () => adminService.getOffers(params),
  });

export const useVerifyKYC = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action, reason }: { userId: string, action: 'approve' | 'reject', reason?: string }) => 
      adminService.updateKYC(userId, action, reason),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetails(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Estado KYC atualizado com sucesso.');
    },
    onError: () => toast.error('Erro ao atualizar KYC.')
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string, action: 'block' | 'unblock' }) => 
      adminService.updateUserStatus(userId, action),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetails(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Estado da conta atualizado com sucesso.');
    },
    onError: () => toast.error('Erro ao atualizar estado da conta.')
  });
};

export const useAdminUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, action }: { offerId: string, action: 'close' | 'pause' }) => 
      adminService.updateOfferStatus(offerId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.offers() });
      toast.success('Oferta atualizada com sucesso.');
    },
    onError: () => toast.error('Erro ao atualizar oferta.')
  });
};
