import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from './chat.service';
import toast from 'react-hot-toast';

export const useChatRooms = () => {
  return useQuery({
    queryKey: ['chat-rooms'],
    queryFn: chatService.getRooms,
  });
};

export const useChatMessages = (roomId: string) => {
  return useQuery({
    queryKey: ['chat-messages', roomId],
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
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Erro ao enviar mensagem');
    }
  });
};
