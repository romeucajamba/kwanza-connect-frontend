import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { transactionsService } from './transactions.service';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getTransactions(),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useTransactionDetails = (id: string) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionsService.getTransactionDetails(id),
    enabled: !!id,
  });
};

export const useConfirmTransaction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { offer: string; room: string }) => 
      transactionsService.confirmTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Negócio selado com sucesso!');
      navigate('/historico');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao confirmar negócio');
    },
  });
};

export const useReviewTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment?: string }) => 
      transactionsService.reviewTransaction(id, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Avaliação submetida com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao submeter avaliação');
    },
  });
};

export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => transactionsService.getUserReviews(userId),
    enabled: !!userId,
  });
};
