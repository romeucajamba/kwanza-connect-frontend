import { api } from '../lib/axios';
import { API_ROUTES } from '../constants';
import type { Room, Message } from '../types';

export const chatService = {
  getRooms: async () => {
    const response = await api.get(API_ROUTES.CHAT.ROOMS);
    return response.data;
  },
  getMessages: async (roomId: string) => {
    const response = await api.get(`${API_ROUTES.CHAT.MESSAGES}${roomId}/`);
    return response.data;
  },
  sendMessage: async (roomId: string, content: string) => {
    const response = await api.post(`${API_ROUTES.CHAT.MESSAGES}${roomId}/`, { content });
    return response.data;
  },
};
