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
  sendMessage: async (roomId: string, data: { 
    content: string; 
    msg_type?: 'text' | 'image' | 'file'; 
    reply_to?: string;
    file?: File | null;
  }): Promise<Message> => {
    // If there's a file, we should use FormData
    if (data.file) {
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.msg_type) formData.append('msg_type', data.msg_type);
      if (data.reply_to) formData.append('reply_to', data.reply_to);
      formData.append('file', data.file);

      const response = await api.post<ApiResponse<Message>>(API_ROUTES.CHAT.ROOM_MESSAGES(roomId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    }

    const response = await api.post<ApiResponse<Message>>(API_ROUTES.CHAT.ROOM_MESSAGES(roomId), data);
    return response.data.data;
  },

  // DELETE /api/chat/messages/<message_id>/
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(API_ROUTES.CHAT.MESSAGE_DETAIL(messageId));
  },

  // GET /api/chat/messages/<message_id>/
  getMessageDetail: async (messageId: string): Promise<Message> => {
    const response = await api.get<ApiResponse<Message>>(API_ROUTES.CHAT.MESSAGE_DETAIL(messageId));
    return response.data.data;
  },

  // PUT /api/chat/messages/<message_id>/
  updateMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await api.put<ApiResponse<Message>>(API_ROUTES.CHAT.MESSAGE_DETAIL(messageId), { content });
    return response.data.data;
  },

  // POST /api/chat/rooms/<room_id>/mark-read/
  markAsRead: async (roomId: string): Promise<void> => {
    await api.post(API_ROUTES.CHAT.MARK_READ(roomId));
  },
};
