import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Apple,
  RefreshCcw,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Camera,
  CreditCard
} from 'lucide-react';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '@/schemas/auth.schema';
import { useLogin, useRegister } from '@/services/auth.hooks';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signUpStep, setSignUpStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const frontDocRef = useRef<HTMLInputElement>(null);
  const backDocRef = useRef<HTMLInputElement>(null);
  const [frontDocName, setFrontDocName] = useState<string | null>(null);
  const [backDocName, setBackDocName] = useState<string | null>(null);

  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: registerUser, isPending: isRegisterPending } = useRegister();

  // Login Form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  // Register Form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = (data: LoginFormData) => {
    login(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    if (signUpStep === 1) {
      setSignUpStep(2);
      return;
    }
    registerUser(data);
  };

  const isPending = isLoginPending || isRegisterPending;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display selection:bg-primary selection:text-white">
      <div className="layout-container flex h-full grow flex-col px-4 py-10 md:px-10 lg:px-20 justify-center items-center">
        
        <div className="layout-content-container flex flex-col w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-black dark:text-white tracking-tight text-3xl font-black leading-tight">
              Sua plataforma global de trocas de moedas
            </h1>
          </div>

          <div className="bg-white dark:bg-[#192633] p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-50 dark:bg-[#111922] p-1 mb-8">
              <button 
                onClick={() => { setAuthMode('signin'); setSignUpStep(1); }}
                className={`flex-1 h-full flex items-center justify-center rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  authMode === 'signin' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-400'
                }`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 h-full flex items-center justify-center rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  authMode === 'signup' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-400'
                }`}
              >
                Criar Conta
              </button>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="text-black dark:text-white text-2xl font-black leading-tight tracking-tight">
                {authMode === 'signin' ? 'Bem-vindo de volta!' : (signUpStep === 1 ? 'Comece sua jornada' : 'Verificação Segura')}
              </h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                {authMode === 'signin' ? 'Aceda à sua conta digital' : (signUpStep === 1 ? 'Crie sua conta em segundos' : 'Proteja seu património')}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'signin' ? (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">E-mail ou Usuário</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                        <User className="size-4" />
                      </div>
                      <input 
                        {...loginForm.register('email')}
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                        placeholder="ex: joao.p2p"
                      />
                    </div>
                    {loginForm.formState.errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight">{loginForm.formState.errors.email.message}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Senha</label>
                      <button 
                      onClick={() => navigate("/forgot-password")}
                      type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Esqueceu a senha?</button>
                    </div>
                    <div className="relative group">
                      <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                        <Lock className="size-4" />
                      </div>
                      <input 
                        {...loginForm.register('password')}
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
                    {loginForm.formState.errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-tight">{loginForm.formState.errors.password.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="mt-4 flex items-center justify-center w-full h-12 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 group"
                  >
                    {isPending ? (
                      <RefreshCcw className="size-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                         Entrar no Sistema
                         <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="flex flex-col gap-5"
                >
                  <AnimatePresence mode="wait">
                    {signUpStep === 1 ? (
                      <motion.div 
                        key="reg-step-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Nome Completo</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                              <User className="size-4" />
                            </div>
                            <input 
                              {...registerForm.register('fullName')}
                              className="w-full h-11 pl-11 pr-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                              placeholder="Como devemos chamá-lo?"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Endereço de E-mail</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                              <Mail className="size-4" />
                            </div>
                            <input 
                              {...registerForm.register('email')}
                              className="w-full h-11 pl-11 pr-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Senha</label>
                            <input 
                              {...registerForm.register('password')}
                              type="password"
                              className="w-full h-11 px-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                              placeholder="••••••"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Confirmar</label>
                            <input 
                              {...registerForm.register('confirmPassword')}
                              type="password"
                              className="w-full h-11 px-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                              placeholder="••••••"
                            />
                          </div>
                        </div>
                        
                        {(registerForm.formState.errors.fullName || registerForm.formState.errors.email || registerForm.formState.errors.confirmPassword) && (
                          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">
                              {registerForm.formState.errors.fullName?.message || registerForm.formState.errors.email?.message || registerForm.formState.errors.confirmPassword?.message || "Verifique os dados"}
                            </p>
                          </div>
                        )}
                        
                        <button 
                          type="submit"
                          className="mt-2 flex items-center justify-center w-full h-12 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] group"
                        >
                          Continuar para KYC
                          <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="reg-step-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Tipo de Documento</label>
                          <select 
                             {...registerForm.register('docType')}
                             className="w-full h-11 px-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          >
                             <option value="bi">Bilhete de Identidade</option>
                             <option value="passport">Passaporte</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Nº do Documento</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                              <CreditCard className="size-4" />
                            </div>
                            <input 
                              {...registerForm.register('docNumber')}
                              className="w-full h-11 pl-11 pr-4 bg-slate-50 dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                              placeholder="000123LA045"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex flex-col gap-1.5">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Frente</p>
                              <button 
                                type="button"
                                onClick={() => frontDocRef.current?.click()}
                                className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all transition-colors ${frontDocName ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'border-slate-100 dark:border-white/5 hover:border-primary/40 text-slate-400 bg-slate-50 dark:bg-white/5'}`}
                              >
                                 {frontDocName ? <CheckCircle2 className="size-5" /> : <Camera className="size-5 opacity-40" />}
                                 <span className="text-[8px] font-bold uppercase tracking-tighter truncate max-w-[80px]">{frontDocName || 'Upload Imagem'}</span>
                              </button>
                              <input 
                                type="file" ref={frontDocRef} className="hidden" accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFrontDocName(file.name);
                                    registerForm.setValue('frontDoc', file);
                                  }
                                }} 
                              />
                           </div>

                           <div className="flex flex-col gap-1.5">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Verso</p>
                              <button 
                                type="button"
                                onClick={() => backDocRef.current?.click()}
                                className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all transition-colors ${backDocName ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'border-slate-100 dark:border-white/5 hover:border-primary/40 text-slate-400 bg-slate-50 dark:bg-white/5'}`}
                              >
                                 {backDocName ? <CheckCircle2 className="size-5" /> : <Camera className="size-5 opacity-40" />}
                                 <span className="text-[8px] font-bold uppercase tracking-tighter truncate max-w-[80px]">{backDocName || 'Upload Imagem'}</span>
                              </button>
                              <input 
                                type="file" ref={backDocRef} className="hidden" accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setBackDocName(file.name);
                                    registerForm.setValue('backDoc', file);
                                  }
                                }} 
                              />
                           </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                           <button 
                             type="button" 
                             onClick={() => setSignUpStep(1)}
                             className="px-4 h-12 bg-slate-50 dark:bg-[#111922] text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100 dark:border-white/5"
                           >
                              <ArrowLeft className="size-4" />
                           </button>
                           <button 
                             type="submit" 
                             disabled={isPending}
                             className="flex-1 h-12 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
                           >
                              {isPending ? <RefreshCcw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                              Finalizar Cadastro
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="relative flex items-center py-8">
              <div className="flex-grow border-t border-slate-100 dark:border-white/10"></div>
              <span className="flex-shrink mx-4 text-slate-300 dark:text-slate-600 text-[9px] font-black uppercase tracking-widest">Acesso Rápido</span>
              <div className="flex-grow border-t border-slate-100 dark:border-white/10"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex items-center justify-center gap-3 h-12 bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="Google" />
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
