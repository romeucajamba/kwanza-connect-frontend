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
    refetchInterval: 10000, // Atualizar lista de salas a cada 10s
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
    refetchInterval: 3000, // Poll for new messages every 3s
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) => 
      chatService.sendMessage(roomId, content),
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
