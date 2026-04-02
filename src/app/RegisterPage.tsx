import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { registerSchema, type RegisterFormData } from '@schema/auth.schema';
import { useRegister } from '@services/auth.hooks';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { mutate: registerUser, isPending } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
      <div className="w-full max-w-lg space-y-8">
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <span className="material-symbols-outlined text-3xl">currency_exchange</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Crie a sua conta</h1>
          <p className="text-base text-slate-600 dark:text-slate-400">Abra a sua conta gratuitamente para começar.</p>
        </header>

        <main className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Informações de Acesso</h2>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-800 dark:text-slate-300 pb-2">Nome Completo</label>
                    <input
                      {...register('fullName')}
                      className={`form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      } bg-white dark:bg-background-dark focus:border-primary h-12 px-3.5 text-base`}
                      placeholder="Seu nome completo"
                    />
                    {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-800 dark:text-slate-300 pb-2">E-mail</label>
                    <input
                      {...register('email')}
                      className={`form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                        errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      } bg-white dark:bg-background-dark focus:border-primary h-12 px-3.5 text-base`}
                      placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-slate-800 dark:text-slate-300 pb-2">Senha</label>
                      <input
                        {...register('password')}
                        type="password"
                        className={`form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                          errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-background-dark focus:border-primary h-12 px-3.5 text-base`}
                        placeholder="Senha"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-slate-800 dark:text-slate-300 pb-2">Confirmar</label>
                      <input
                        {...register('confirmPassword')}
                        type="password"
                        className={`form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-background-dark focus:border-primary h-12 px-3.5 text-base`}
                        placeholder="Senha"
                      />
                    </div>
                  </div>
                  {(errors.password || errors.confirmPassword) && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.password?.message || errors.confirmPassword?.message}
                    </span>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verificação de Identidade</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Habilite todas as funcionalidades verificando sua identidade.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      <span>Progresso da Verificação</span>
                      <span>Passo 2 de 3</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[66%]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Documento de Identidade</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-6 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">upload_file</span>
                        Frente
                      </button>
                      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-6 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">upload_file</span>
                        Verso
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent h-12 px-6 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Voltar
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-semibold text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Próximo Passo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-semibold text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isPending ? 'Criando Conta...' : 'Finalizar Cadastro'}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Já tem uma conta? <Link to="/login" className="font-semibold text-primary hover:underline">Entrar</Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;
