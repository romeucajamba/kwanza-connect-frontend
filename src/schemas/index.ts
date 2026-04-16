import { z } from 'zod';

// ─── Login Schema ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório.')
    .email('Por favor, insira um email válido.'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória.')
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Settings Schemas ─────────────────────────────────────────────────────────
export const aiSettingsSchema = z.object({
  recognitionThreshold: z.number().min(0).max(100),
  routeOptimizationEnabled: z.boolean(),
  retrainingFrequency: z.enum(['daily', 'weekly', 'monthly']),
});

export const gamificationSettingsSchema = z.object({
  maxPointsPerDay: z
    .number()
    .min(1, 'O limite mínimo é 1 ponto.')
    .max(100000, 'O limite máximo é 100.000 pontos.'),
});

export const notificationSettingsSchema = z.object({
  globalPushEnabled: z.boolean(),
});

export type AISettingsFormValues = z.infer<typeof aiSettingsSchema>;
export type GamificationSettingsFormValues = z.infer<typeof gamificationSettingsSchema>;
export type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;

// ─── Offer Schemas ─────────────────────────────────────────────────────────────
export * from './offer.schema';
