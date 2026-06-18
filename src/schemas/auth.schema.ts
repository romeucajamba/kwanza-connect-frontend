import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'O nome deve conter apenas letras'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
  province: z.string().min(1, 'Selecione uma província'),
  municipality: z.string().min(1, 'Selecione um município'),
  neighborhood: z.string().min(2, 'O bairro/rua é obrigatório'),
  phone: z.string().optional().refine(val => {
    if (!val) return true;
    const cleaned = val.replace(/\s/g, '');
    return /^\+2449\d{8}$/.test(cleaned);
  }, 'O número deve ser angolano, ex: +244 9XX XXX XXX'),
  docType: z.string().optional(),
  docNumber: z.string().optional(),
  frontDoc: z.any().optional(),
  backDoc: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
