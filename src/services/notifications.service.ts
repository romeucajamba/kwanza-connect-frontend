import { api } from '@lib/axios';
import { API_ROUTES } from '@/constants';
import type { ApiResponse, Notification, NotificationPreferences } from '@/types';

export const notificationsService = {
  // GET /api/notifications/
  getNotifications: async (unreadOnly = false): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>(
      `${API_ROUTES.NOTIFICATIONS.BASE}${unreadOnly ? '?unread=true' : ''}`
    );
    return response.data.data;
  },

  // GET /api/notifications/unread-count/
  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await api.get<ApiResponse<{ unread_count: number }>>(
      API_ROUTES.NOTIFICATIONS.UNREAD
    );
    return response.data.data;
  },

  // POST /api/notifications/mark-read/
  markAllAsRead: async (): Promise<void> => {
    await api.post(API_ROUTES.NOTIFICATIONS.MARK_READ);
  },

  // POST /api/notifications/mark-read/<id>/
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.post(`${API_ROUTES.NOTIFICATIONS.MARK_READ}${notificationId}/`);
  },

  // GET /api/notifications/preferences/
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<ApiResponse<NotificationPreferences>>(
      API_ROUTES.NOTIFICATIONS.PREFERENCES
    );
    return response.data.data;
  },

  // PATCH /api/notifications/preferences/
  updatePreferences: async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await api.patch<ApiResponse<NotificationPreferences>>(
      API_ROUTES.NOTIFICATIONS.PREFERENCES,
      data
    );
    return response.data.data;
  },
};
