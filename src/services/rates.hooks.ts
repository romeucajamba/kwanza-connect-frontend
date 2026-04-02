import { useQuery } from '@tanstack/react-query';
import { ratesService } from './rates.service';

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['rates'],
    queryFn: () => ratesService.getExchangeRates(),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useConvertRate = (params: { from: string; to: string; amount: number }) => {
  return useQuery({
    queryKey: ['convert', params],
    queryFn: () => ratesService.convert(params),
    enabled: !!params.from && !!params.to && !!params.amount,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ratesService.getDashboardStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
