import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { adminService } from './admin.service';
import { APP_ROUTES } from '@/constants';

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => ['admin', 'stats'] as const,
  users: (params?: Record<string, any>) => ['admin', 'users', params] as const,
  userDetails: (id: string) => ['admin', 'users', id] as const,
  offers: (params?: Record<string, any>) => ['admin', 'offers', params] as const,
  logs: (page: number) => ['admin', 'logs', page] as const,
  currencies: () => ['admin', 'currencies'] as const,
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

export const useAdminCurrencies = () =>
  useQuery({
    queryKey: adminKeys.currencies(),
    queryFn: () => adminService.getCurrencies(),
  });

export const useAdminSeedCurrencies = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminService.seedCurrencies(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.currencies() });
      toast.success(data.message || 'Moedas atualizadas com sucesso.');
    },
    onError: () => toast.error('Erro ao inserir moedas.')
  });
};

export const useAdminLogin = () => {
  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: any) => adminService.login(data),
    onSuccess: (data) => {
      loginAction(data.user, data.access);
      toast.success(`Bem-vindo ao Painel de Administração, ${data.user.full_name.split(' ')[0]}!`);
      navigate(APP_ROUTES.ADMIN_DASHBOARD);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Credenciais inválidas ou acesso negado.';
      toast.error(msg);
    }
  });
};

export const useAdminRegister = () => {
  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: any) => adminService.register(data),
    onSuccess: (data) => {
      loginAction(data.user, data.access);
      toast.success('Conta de administração criada com sucesso!');
      navigate(APP_ROUTES.ADMIN_DASHBOARD);
    },
    onError: (error: any) => {
      console.error("FULL ERROR OBJECT:", error);
      console.error("ERROR RESPONSE DATA:", error.response?.data);
      let msg = error.response?.data?.message || 'Erro ao criar conta de administração.';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
           msg = errors[0];
        } else {
           const firstKey = Object.keys(errors)[0];
           if (firstKey) {
              const fieldError = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
              const fieldName = firstKey === 'full_name' ? 'Nome' : firstKey === 'password' ? 'Senha' : firstKey;
              msg = `${fieldName}: ${fieldError}`;
           }
        }
      }
      toast.error(msg);
    }
  });
};
