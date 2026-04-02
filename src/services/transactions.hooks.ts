import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  return useMutation({
    mutationFn: (data: { offer: string; room: string; notes?: string }) => 
      transactionsService.confirmTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Transação confirmada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao confirmar transação');
    },
  });
};
