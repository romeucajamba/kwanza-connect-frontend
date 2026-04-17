import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  ChevronRight, 
  RefreshCcw, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useForgotPassword, useResetPassword } from '@/services/auth.hooks';
import { APP_ROUTES } from '@/constants';

// Schemas localizados para esta página
const forgotSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
});

const resetSchema = z.object({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ForgotFormData = z.infer<typeof forgotSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { token: pathToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const token = searchParams.get('token') || pathToken;
  
  const [step, setStep] = useState<'request' | 'success' | 'reset'>(token ? 'reset' : 'request');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: forgotPassword, isPending: isForgotPending } = useForgotPassword();
  const { mutate: resetPassword, isPending: isResetPending } = useResetPassword();

  const forgotForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onForgotSubmit = (data: ForgotFormData) => {
    forgotPassword(data.email, {
      onSuccess: () => setStep('success'),
    });
  };

  const onResetSubmit = (data: ResetFormData) => {
    if (!token) return;
    resetPassword({
      token,
      new_password: data.password,
      confirm_password: data.confirmPassword,
    }, {
      onSuccess: () => {
        setTimeout(() => navigate(APP_ROUTES.LOGIN), 2000);
      }
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display selection:bg-primary selection:text-white">
      <div className="layout-container flex h-full grow flex-col px-4 py-10 md:px-10 lg:px-20 justify-center items-center">
        
        <div className="layout-content-container flex flex-col w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-black dark:text-white tracking-tight text-3xl font-black leading-tight">
              Recuperar <span className="text-primary italic">Conta</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-normal pt-2 uppercase tracking-widest opacity-80">
              Segurança reforçada em cada etapa
            </p>
          </div>

          <div className="bg-white dark:bg-[#192633] p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {step === 'request' && (
                <motion.div 
                  key="request"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-black dark:text-white text-xl font-black leading-tight tracking-tight uppercase">Esqueceu a Senha?</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      Introduza o seu e-mail para receber um link de redefinição seguro.
                    </p>
                  </div>

                  <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Endereço de E-mail</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                             <Mail className="size-4" />
                          </div>
                          <input 
                             {...forgotForm.register('email')}
                             className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                             placeholder="ex: joao@email.com"
                          />
                       </div>
                       {forgotForm.formState.errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight">{forgotForm.formState.errors.email.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isForgotPending}
                      className="flex items-center justify-center w-full h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] group"
                    >
                      {isForgotPending ? <RefreshCcw className="size-5 animate-spin" /> : (
                        <span className="flex items-center gap-2">
                          Enviar Link Seguro
                          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </form>

                  <div className="pt-2 text-center">
                    <Link to={APP_ROUTES.LOGIN} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors group">
                      <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                      Voltar ao Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 flex flex-col items-center text-center space-y-6"
                >
                  <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-black dark:text-white text-xl font-black uppercase tracking-tight">Verifique o E-mail</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                      Enviamos um link de redefinição para o seu endereço de e-mail. Por favor, verifique também a pasta de spam.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(APP_ROUTES.LOGIN)}
                    className="w-full h-12 bg-slate-50 dark:bg-[#111922] text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 dark:border-white/5 hover:bg-white transition-all shadow-sm"
                  >
                    OK, Entendido
                  </button>
                </motion.div>
              )}

              {step === 'reset' && (
                <motion.div 
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-black dark:text-white text-xl font-black leading-tight tracking-tight uppercase">Nova Senha</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      Crie uma combinação forte para proteger seus activos digitais.
                    </p>
                  </div>

                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Nova Senha</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                             <Lock className="size-4" />
                          </div>
                          <input 
                             {...resetForm.register('password')}
                             type={showPassword ? 'text' : 'password'}
                             className="w-full h-12 pl-11 pr-12 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                             placeholder="••••••••"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                       </div>
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Confirmar Nova Senha</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                             <Lock className="size-4" />
                          </div>
                          <input 
                             {...resetForm.register('confirmPassword')}
                             type="password"
                             className="w-full h-12 pl-11 pr-12 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                             placeholder="••••••••"
                          />
                       </div>
                       {(resetForm.formState.errors.password || resetForm.formState.errors.confirmPassword) && (
                         <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight">
                           {resetForm.formState.errors.password?.message || resetForm.formState.errors.confirmPassword?.message}
                         </p>
                       )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isResetPending}
                      className="mt-2 flex items-center justify-center w-full h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] group"
                    >
                      {isResetPending ? <RefreshCcw className="size-5 animate-spin" /> : (
                        <span className="flex items-center gap-2">
                          Actualizar Senha
                          <ShieldCheck className="size-4" />
                        </span>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
