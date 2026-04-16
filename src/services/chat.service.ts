import { api } from '../lib/axios';
import { API_ROUTES } from '../constants';
import type { Room, Message, ApiResponse } from '../types';

export const chatService = {
  // GET /api/chat/rooms/
  getRooms: async (): Promise<Room[]> => {
    const response = await api.get<ApiResponse<Room[]>>(API_ROUTES.CHAT.ROOMS);
    return response.data.data;
  },

  // GET /api/chat/rooms/<room_id>/
  getRoomDetails: async (roomId: string): Promise<Room> => {
    const response = await api.get<ApiResponse<Room>>(API_ROUTES.CHAT.ROOM_DETAIL(roomId));
    return response.data.data;
  },

  // GET /api/chat/rooms/<room_id>/messages/
  getMessages: async (roomId: string): Promise<Message[]> => {
    const response = await api.get<ApiResponse<Message[]>>(API_ROUTES.CHAT.ROOM_MESSAGES(roomId));
    return response.data.data;
  },

  // POST /api/chat/rooms/<room_id>/messages/
  sendMessage: async (roomId: string, content: string): Promise<Message> => {
    const response = await api.post<ApiResponse<Message>>(API_ROUTES.CHAT.ROOM_MESSAGES(roomId), { content });
    return response.data.data;
  },

  // DELETE /api/chat/messages/<message_id>/
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`${API_ROUTES.CHAT.MESSAGES}${messageId}/`);
  },
};
