import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { offersService, type CreateOfferPayload, type ExpressInterestPayload } from './offers.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const offersKeys = {
  all: ['offers'] as const,
  active: (params?: Record<string, string>) => ['offers', 'active', params] as const,
  mine: () => ['offers', 'mine'] as const,
  detail: (id: string) => ['offers', 'detail', id] as const,
  interests: (offerId: string) => ['offers', 'interests', offerId] as const,
  myInterests: () => ['offers', 'my-interests'] as const,
};

// ─── Feed de Ofertas Activas ──────────────────────────────────────────────────
export const useOffers = (params?: Record<string, string>) =>
  useQuery({
    queryKey: offersKeys.active(params),
    queryFn: () => offersService.getActiveOffers(params),
  });

// ─── Detalhes de Uma Oferta ───────────────────────────────────────────────────
export const useOfferDetails = (id: string) =>
  useQuery({
    queryKey: offersKeys.detail(id),
    queryFn: () => offersService.getOfferDetails(id),
    enabled: !!id,
  });

// ─── Minhas Ofertas ───────────────────────────────────────────────────────────
export const useMyOffers = () =>
  useQuery({
    queryKey: offersKeys.mine(),
    queryFn: () => offersService.getMyOffers(),
  });

// ─── Criar Oferta ─────────────────────────────────────────────────────────────
export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateOfferPayload) => offersService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.all });
      toast.success('Oferta publicada com sucesso!');
      navigate('/p2p/browse');
    },
    onError: (error: any) => {
      const data = error.response?.data;
      if (!data) {
        toast.error('Erro de rede. Verifique a sua ligação.');
        return;
      }
      // Django field validation errors: { field: ["msg"] } or { detail: "msg" } or { message: "msg" }
      if (typeof data === 'string') {
        toast.error(data);
      } else if (data.detail) {
        toast.error(data.detail);
      } else if (data.message) {
        toast.error(data.message);
      } else {
        // Extrair primeiros erros de campo
        const fieldErrors = Object.entries(data as Record<string, string[]>)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
          .join(' | ');
        toast.error(fieldErrors || 'Erro ao criar oferta');
      }
    },
  });
};

// ─── Pausar Oferta ────────────────────────────────────────────────────────────
export const usePauseOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offersService.pauseOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.mine() });
      toast.success('Oferta pausada.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao pausar oferta');
    },
  });
};

// ─── Retomar Oferta ───────────────────────────────────────────────────────────
export const useResumeOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offersService.resumeOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.mine() });
      toast.success('Oferta retomada.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao retomar oferta');
    },
  });
};

// ─── Encerrar Oferta ──────────────────────────────────────────────────────────
export const useCloseOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offersService.closeOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.mine() });
      toast.success('Oferta encerrada.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao encerrar oferta');
    },
  });
};

// ─── Interesses na Minha Oferta ───────────────────────────────────────────────
export const useOfferInterests = (offerId: string) =>
  useQuery({
    queryKey: offersKeys.interests(offerId),
    queryFn: () => offersService.getOfferInterests(offerId),
    enabled: !!offerId,
  });

// ─── Manifestar Interesse ─────────────────────────────────────────────────────
export const useExpressInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, payload }: { offerId: string; payload?: ExpressInterestPayload }) =>
      offersService.expressInterest(offerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.myInterests() });
      toast.success('Interesse enviado!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar interesse');
    },
  });
};

// ─── Meus Interesses Enviados ─────────────────────────────────────────────────
export const useMyInterests = () =>
  useQuery({
    queryKey: offersKeys.myInterests(),
    queryFn: () => offersService.getMyInterests(),
  });

// ─── Aceitar Interesse ────────────────────────────────────────────────────────
export const useAcceptInterest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (interestId: string) => offersService.acceptInterest(interestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.all });
      toast.success('Proposta aceite! A sala de chat foi criada.');
      navigate('/mensagens');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao aceitar proposta');
    },
  });
};

// ─── Rejeitar Interesse ───────────────────────────────────────────────────────
export const useRejectInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interestId: string) => offersService.rejectInterest(interestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.all });
      toast.success('Proposta rejeitada.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao rejeitar proposta');
    },
  });
};

// ─── Cancelar o Meu Interesse ─────────────────────────────────────────────────
export const useCancelInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interestId: string) => offersService.cancelInterest(interestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offersKeys.myInterests() });
      toast.success('Interesse cancelado.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cancelar interesse');
    },
  });
};
