import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersService } from './offers.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useOffers = (params?: any) => {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: () => offersService.getActiveOffers(params),
  });
};

export const useMyOffers = () => {
  return useQuery({
    queryKey: ['my-offers'],
    queryFn: () => offersService.getMyOffers(),
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: any) => offersService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
      toast.success('Oferta criada com sucesso!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar oferta');
    },
  });
};

export const useExpressInterest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ offerId, message }: { offerId: string; message: string }) => 
      offersService.expressInterest(offerId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-interests'] });
      toast.success('Interesse enviado! Sala de chat criada.');
      navigate('/mensagens');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar interesse');
    },
  });
};
