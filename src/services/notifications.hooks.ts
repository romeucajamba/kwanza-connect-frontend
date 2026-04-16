import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from './notifications.service';
import type { NotificationPreferences } from '@/types';
import { toast } from 'react-hot-toast';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (unreadOnly?: boolean) => [...notificationKeys.all, 'list', { unreadOnly }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

export const useNotifications = (unreadOnly = false) =>
  useQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: () => notificationsService.getNotifications(unreadOnly),
  });

export const useNotificationUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('Todas as notificações marcadas como lidas');
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useNotificationPreferences = () =>
  useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsService.getPreferences(),
  });

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<NotificationPreferences>) => 
      notificationsService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
      toast.success('Preferências atualizadas com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar preferências');
    },
  });
};
