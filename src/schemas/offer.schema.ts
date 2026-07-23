import { z } from 'zod';

export const createOfferSchema = z.object({
  give_currency_code: z.string().min(1, 'Moeda de envio é obrigatória'),
  want_currency_code: z.string().min(1, 'Moeda de recebimento é obrigatória'),
  give_amount: z.string()
    .min(1, 'Valor a enviar é obrigatório')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Valor deve ser superior a 0'),
  want_amount: z.string()
    .min(1, 'Valor a receber é obrigatório')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Valor deve ser superior a 0'),
  offer_type: z.enum(['buy', 'sell']),
  notes: z.string().optional(),
  payment_methods: z.array(z.enum([
    "Multicaixa Express", "Aplicações Bancárias", "PayPay África",
    "Unitel Money", "Afrimoney", "e-Kwanza", "AkiPaga", "Agiliza",
    "eKumbu", "BNIX", "Wise", "Payoneer", "PayPal", "Remitly",
    "Binance", "Bybit", "outra"
  ])).min(1, 'Selecione pelo menos uma plataforma de pagamento.'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type CreateOfferFormValues = z.infer<typeof createOfferSchema>;
