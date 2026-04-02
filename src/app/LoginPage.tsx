import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { loginSchema, type LoginFormData } from '@schema/auth.schema';
import { useLogin } from '@services/auth.hooks';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center items-center py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="layout-content-container flex flex-col w-full max-w-md flex-1"
          >
            <div className="text-center mb-8">
              <h1 className="text-black dark:text-white tracking-light text-3xl font-bold leading-tight">
                Sua plataforma global de câmbio
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-base font-normal leading-normal pt-2">
                Segurança e agilidade para suas transações internacionais.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 p-2 sm:p-4 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex p-1">
                <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-zinc-100 dark:bg-background-dark p-1">
                  <button
                    onClick={() => setAuthMode('signin')}
                    className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium transition-all duration-200 ${
                      authMode === 'signin' 
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium transition-all duration-200 ${
                      authMode === 'signup' 
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Criar Conta
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-4">
                <AnimatePresence mode="wait">
                  {authMode === 'signin' ? (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-black dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] pb-2">
                        Bem-vindo de volta!
                      </h2>
                      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-3">
                        <div className="flex flex-col w-full">
                          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                            E-mail ou Usuário
                          </p>
                          <input
                            {...register('email')}
                            className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                              errors.email ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                            } bg-zinc-50 dark:bg-zinc-800 focus:border-primary h-12 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-3 text-base font-normal leading-normal`}
                            placeholder="Digite seu e-mail ou usuário"
                          />
                          {errors.email && (
                            <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
                          )}
                        </div>

                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center pb-2">
                            <p className="text-black dark:text-white text-sm font-medium leading-normal">Senha</p>
                            <Link to="/forgot-password" className="text-primary text-sm font-medium hover:underline">
                              Esqueceu a senha?
                            </Link>
                          </div>
                          <input
                            {...register('password')}
                            type="password"
                            className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                              errors.password ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                            } bg-zinc-50 dark:bg-zinc-800 focus:border-primary h-12 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-3 text-base font-normal leading-normal`}
                            placeholder="Digite sua senha"
                          />
                          {errors.password && (
                            <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            {...register('remember')}
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="remember" className="text-zinc-600 dark:text-zinc-400 text-sm cursor-pointer">
                            Lembrar de mim
                          </label>
                        </div>

                        <div className="pt-4">
                          <button
                            disabled={isPending}
                            type="submit"
                            className="flex items-center justify-center text-center font-medium text-base rounded-lg px-6 py-3 w-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 h-12 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                          >
                            {isPending ? (
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              'Entrar'
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-center py-8"
                    >
                      <h2 className="text-black dark:text-white text-2xl font-bold leading-tight pb-4">
                        Crie sua conta agora!
                      </h2>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Junte-se a milhares de usuários e comece a operar hoje mesmo.
                      </p>
                      <button 
                        onClick={() => setAuthMode('signin')}
                        className="text-primary font-semibold hover:underline"
                      >
                        Já tem uma conta? Faça login
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                  <span className="flex-shrink mx-4 text-zinc-400 dark:text-zinc-500 text-xs font-bold">OU</span>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-white font-medium text-sm rounded-lg px-4 py-2 h-12 transition-all duration-200 active:scale-[0.98]">
                    <img 
                      alt="Google logo" 
                      className="w-5 h-5" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbivzfGUs6ohqkcpQ6wg-mII7ebZ7Cmg3qcSGuqCRpGDydvMCs7h1MNuBDVwg_xT_nxxNv_M0M_JN8V1UPmjrbk3Q5sTHQTf7ecYoHVAytVYYxnH3-zjjSLKIXXHA8qiPcp6H5CdMOzcuZHsy6iq7LuLuo4-YfUrURG2MeIG82g8mRr2nKCLRYicgSZxv8mdvxPbJO4jg8n2E6922LNBerldDUlDp2K0ZKF5D-IcrGojvuSznDtz5C0evE7aEUjMyOWIuYjythNYI" 
                    />
                    <span>Google</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-white font-medium text-sm rounded-lg px-4 py-2 h-12 transition-all duration-200 active:scale-[0.98]">
                    <img 
                      alt="Apple logo" 
                      className="w-5 h-5" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMG5l68x0rCdHMQDg_rM_FuUY5PDwQnuzNz3mo0yPslpCUDEkhSiLExK5u8SuEF1Wi9tlspwzaZ3rMUAq8BtYG-hvkOffmDc5HX8IOT6ZYgEukgmjuvInJBJFZTIo66Z6tXHjacjuOGmvrMMbMFAm4_2VeJoMN1fmZU3NQq5w8QkkAfJkG6AgB555qWEWwzLVInyrF206knohaQwqhDJITRrwTb1OLhR-qTgRwl2J4N6EsZVgscPoE2aZDRB7k-1Oz9UpRpjxST2s" 
                    />
                    <span>Apple</span>
                  </button>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 rounded-xl border border-brand-secondary/30 bg-primary/10 dark:bg-primary/10 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-secondary text-2xl">shield_lock</span>
                <h3 className="text-black dark:text-white text-base font-bold">Sua Segurança é a Nossa Prioridade</h3>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm font-normal leading-normal text-center">
                Usamos criptografia de ponta a ponta e autenticação de dois fatores (2FA) para proteger sua conta e suas transações.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
