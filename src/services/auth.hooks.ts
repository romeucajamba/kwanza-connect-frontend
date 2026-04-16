import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LoginFormData, RegisterFormData } from 'src/schemas/auth.schema';

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
      const data = error.response?.data;
      let message = 'Erro ao realizar login';
      if (typeof data === 'string') message = data;
      else if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      else if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) message = firstError[0];
        else if (typeof firstError === 'string') message = firstError;
      }
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
    onSuccess: (data: any) => {
      if (data?.access && data?.user) {
        login(data.user, data.access, false);
        queryClient.setQueryData(['me'], data.user);
        toast.success('Bem-vindo ao KwanzaConnect!');
        navigate('/dashboard');
      } else {
        toast.success(data?.message || 'Conta criada com sucesso!', {
          duration: 6000,
        });
        navigate('/login');
      }
    },
    onError: (error: any) => {
      const data = error.response?.data;
      let message = 'Erro ao criar conta';
      if (typeof data === 'string') message = data;
      else if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      else if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) message = firstError[0];
        else if (typeof firstError === 'string') message = firstError;
      }
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao solicitar recuperação');
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
      toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
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
      toast.error(error.response?.data?.message || 'Erro ao verificar e-mail');
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
      toast.error(error.response?.data?.message || 'Erro ao actualizar perfil');
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
      toast.error(error.response?.data?.message || 'Erro ao carregar foto');
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
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    },
  });
};
