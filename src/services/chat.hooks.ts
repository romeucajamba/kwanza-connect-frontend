import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from './chat.service';
import toast from 'react-hot-toast';

export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  room: (id: string) => [...chatKeys.all, 'room', id] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
};

export const useChatRooms = () => {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: chatService.getRooms,
    refetchInterval: 1000 * 20, // Atualizar lista de salas a cada 20s
    staleTime: 1000 * 5, // Considerar salas frescas por 5s
  });
};

export const useChatRoom = (roomId: string) => {
  return useQuery({
    queryKey: chatKeys.room(roomId),
    queryFn: () => chatService.getRoomDetails(roomId),
    enabled: !!roomId,
  });
};

export const useChatMessages = (roomId: string) => {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => chatService.getMessages(roomId),
    enabled: !!roomId,
    refetchInterval: 1000 * 5, // Poll for new messages every 5s (antes era 3s)
    staleTime: 1000 * 2, // Mensagens são frescas por 2s
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, ...data }: { 
      roomId: string; 
      content: string;
      msg_type?: 'text' | 'image' | 'file';
      reply_to?: string;
      file?: File | null;
    }) => 
      chatService.sendMessage(roomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.roomId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar mensagem');
    }
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      toast.success('Mensagem eliminada');
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) => 
      chatService.updateMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      toast.success('Mensagem editada');
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => chatService.markAsRead(roomId),
    onSuccess: (_, roomId) => {
      // Atualizar localmente a contagem de não lidas para 0
      queryClient.setQueryData<any[]|any>(chatKeys.rooms(), (oldRooms: any) => {
        if (!oldRooms) return oldRooms;
        return oldRooms.map((room: any) => 
          room.id === roomId ? { ...room, unread_count: 0 } : room
        );
      });
      // Invalida para sincronizar com o backend
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};
