import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LoginFormData, RegisterFormData } from 'src/schemas/auth.schema';

const getErrorMessage = (error: any, defaultMsg: string): string => {
  const data = error?.response?.data;
  if (!data) return defaultMsg;
  if (typeof data === 'string') return data;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.detail === 'string') return data.detail;
  
  if (typeof data === 'object') {
    const firstError = Object.values(data)[0];
    if (Array.isArray(firstError) && typeof firstError[0] === 'string') return firstError[0];
    if (typeof firstError === 'string') return firstError;
  }
  return defaultMsg;
};

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
      toast.error(getErrorMessage(error, 'Erro ao realizar login'));
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (data: any) => {
      const msg = typeof data?.message === 'string' ? data.message : 'Conta criada com sucesso! Pode agora iniciar sessão.';
      toast.success(msg, { duration: 6000 });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao criar conta'));
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao solicitar recuperação'));
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso! Pode entrar com a nova senha.');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao redefinir senha'));
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('E-mail verificado com sucesso! Sua conta está ativa.');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao verificar e-mail'));
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: any) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['me'], updatedUser);
      toast.success('Perfil actualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao actualizar perfil'));
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (file: File) => authService.updateAvatar(file),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['me'], updatedUser);
      toast.success('Foto de perfil actualizada!');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao carregar foto'));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: any) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao alterar senha'));
    },
  });
};

export const useSubmitKYC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => authService.submitKYC(data),
    onSuccess: () => {
      toast.success('Documentos submetidos para análise!');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, 'Erro ao submeter documentos. Verifique os ficheiros e tente novamente.'));
    },
  });
};

export const useKYCStatus = () => {
  return useQuery({
    queryKey: ['kyc-status'],
    queryFn: () => authService.getKYCStatus(),
    refetchInterval: (query) => {
      // Se estiver pendente, verificar a cada 1 minuto
      const status = query.state.data?.status || query.state.data?.data?.status;
      if (status === 'pending' || status === 'submitted') return 60000;
      return false;
    },
  });
};

export const useUserProfile = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => authService.getUserProfile(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
