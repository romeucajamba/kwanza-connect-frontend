import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LoginFormData, RegisterFormData } from '@schema/auth.schema';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data, variables) => {
      login(data.user, data.access, !!variables.remember);
      queryClient.setQueryData(['me'], data.user);
      toast.success('Bem-vindo ao KwanzaConnect!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao realizar login';
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (data) => {
      login(data.user, data.access, false);
      queryClient.setQueryData(['me'], data.user);
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao criar conta';
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login');
      toast.success('Logout realizado com sucesso');
    },
    onError: () => {
      // Still logout locally if API fails
      logout();
      navigate('/login');
    },
  });
};

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
