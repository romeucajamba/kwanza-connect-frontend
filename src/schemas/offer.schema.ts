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
  offer_type: z.enum(['buy', 'sell'])
});

export type CreateOfferFormValues = z.infer<typeof createOfferSchema>;
