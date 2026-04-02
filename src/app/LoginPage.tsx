import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCcw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  Zap,
  Fingerprint
} from 'lucide-react';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '@schema/auth.schema';
import { useLogin, useRegister } from '@services/auth.hooks';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signUpStep, setSignUpStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
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
    registerUser(data);
  };

  const nextStep = () => setSignUpStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setSignUpStep((s) => Math.max(s - 1, 1));

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display selection:bg-primary selection:text-white">
      
      {/* Background Accents - Fluid */}
      <div className="absolute top-0 right-0 w-full h-[50dvh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 -left-1/4 w-1/2 h-[60dvh] bg-primary/5 blur-[10rem] rounded-full pointer-events-none animate-pulse" />

      <div className="flex h-full grow flex-col relative z-10 px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:py-10 lg:py-12">
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col w-full max-w-md lg:max-w-lg">
            
            {/* Logo and Header - Responsive Scale */}
            <header className="text-center mb-6 md:mb-8 space-y-3 md:space-y-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/40 mx-auto transform-gpu hover:rotate-12 transition-transform"
              >
                <RefreshCcw className="size-6 sm:size-7" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-slate-900 dark:text-white tracking-tighter text-2xl sm:text-3xl font-black leading-tight uppercase">
                  Kwanza<span className="text-primary italic">Connect</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed opacity-70 max-w-sm mx-auto">
                  {authMode === 'signin' 
                    ? 'O mercado global de câmbio P2P na palma da sua mão.' 
                    : 'Cadastre-se para começar a negociar com segurança.'}
                </p>
              </div>
            </header>

            {/* Auth Container - Compacted */}
            <div className="bg-white dark:bg-[#192633] p-5 sm:p-8 md:p-10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors pointer-events-none" />
              
              {/* Toggle Switch - Compacted */}
              <div className="flex p-1 mb-6 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5">
                <button
                  onClick={() => { setAuthMode('signin'); setSignUpStep(1); }}
                  className={`flex h-10 flex-1 items-center justify-center rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    authMode === 'signin' 
                      ? 'bg-white dark:bg-[#192633] shadow-md text-primary' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex h-10 flex-1 items-center justify-center rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    authMode === 'signup' 
                      ? 'bg-white dark:bg-[#192633] shadow-md text-primary' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Criar Conta
                </button>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {authMode === 'signin' ? (
                    <motion.div
                      key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    >
                      <h2 className="text-slate-900 dark:text-white text-xl md:text-2xl font-black leading-tight tracking-tighter uppercase mb-2">
                        Bem-vindo <span className="text-primary opacity-50 ml-1 italic">PRO</span>
                      </h2>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col gap-4 py-4 md:py-6">
                        <div className="flex flex-col w-full group">
                          <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pb-2 ml-1">E-mail ou Utilizador</label>
                          <input
                            {...loginForm.register('email')}
                            className={`w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 ${loginForm.formState.errors.email ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
                            placeholder="exemplo@mail.com"
                          />
                          {loginForm.formState.errors.email && (
                            <span className="text-rose-500 text-[9px] uppercase font-black mt-2 ml-1 tracking-widest">{loginForm.formState.errors.email.message}</span>
                          )}
                        </div>

                        <div className="flex flex-col w-full group">
                          <div className="flex justify-between items-center pb-2 ml-1">
                            <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Sua Palavra-Passe</label>
                            <Link to="/forgot-password" px-2 className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline opacity-80">Esquecida?</Link>
                          </div>
                          <div className="relative flex w-full items-center">
                            <input
                              {...loginForm.register('password')}
                              type={showPassword ? 'text' : 'password'}
                              className={`w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 ${loginForm.formState.errors.password ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 text-slate-400 hover:text-primary transition-all p-1 active:scale-90">
                              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                          </div>
                          {loginForm.formState.errors.password && (
                            <span className="text-rose-500 text-[9px] uppercase font-black mt-2 ml-1 tracking-widest">{loginForm.formState.errors.password.message}</span>
                          )}
                        </div>

                        <div className="pt-2">
                          <button
                            disabled={isLoginPending}
                            type="submit"
                            className="w-full h-12 bg-primary text-white rounded-xl font-black uppercase text-xs sm:text-sm tracking-[0.2em] shadow-xl shadow-primary/40 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group/primary"
                          >
                            {isLoginPending ? (
                              <RefreshCcw className="size-6 animate-spin" />
                            ) : (
                              <>
                                <span>Entrar na Rede</span>
                                <ChevronRight className="size-5 group-hover/primary:translate-x-1.5 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      <div className="relative flex items-center py-6">
                        <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
                        <span className="flex-shrink mx-6 text-slate-300 dark:text-slate-600 text-[9px] font-black tracking-[0.3em] uppercase">Vias Alternativas</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-white/5"></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-3 border border-slate-100 dark:border-white/10 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-11 transition-all active:scale-95 shadow-sm">
                          <img alt="Google" className="size-4" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" />
                          <span>Google Sync</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 border border-slate-100 dark:border-white/10 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-11 transition-all active:scale-95 shadow-sm">
                           <Fingerprint className="size-4 text-primary" />
                           <span>PassKey</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    >
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                          {signUpStep === 1 ? (
                            <motion.div
                              key="step1" 
                              initial={{ opacity: 0, x: -20 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              exit={{ opacity: 0, x: 20 }}
                              className="space-y-4"
                            >
                               <div className="flex flex-col group">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 ml-1">Nome de Exibição / Completo</label>
                                <input
                                  {...registerForm.register('fullName')}
                                  className={`w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800 ${registerForm.formState.errors.fullName ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
                                  placeholder="Como devemos chamá-lo?"
                                />
                                {registerForm.formState.errors.fullName && <span className="text-rose-500 text-[9px] font-black uppercase mt-2 ml-1 tracking-widest">{registerForm.formState.errors.fullName.message}</span>}
                              </div>
                              <div className="flex flex-col group">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 ml-1">Endereço de E-mail</label>
                                <input
                                  {...registerForm.register('email')}
                                  className={`w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800 ${registerForm.formState.errors.email ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
                                  placeholder="seu@dominio.com"
                                />
                                {registerForm.formState.errors.email && <span className="text-rose-500 text-[9px] font-black uppercase mt-2 ml-1 tracking-widest">{registerForm.formState.errors.email.message}</span>}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col group">
                                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 ml-1">Senha PRO</label>
                                  <input
                                    {...registerForm.register('password')}
                                    type="password"
                                    className="w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                    placeholder="8+ Carateres"
                                  />
                                </div>
                                <div className="flex flex-col group">
                                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 ml-1">Validar Senha</label>
                                  <input
                                    {...registerForm.register('confirmPassword')}
                                    type="password"
                                    className="w-full bg-slate-50 dark:bg-[#111922] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                    placeholder="Confirme"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="step2" 
                              initial={{ opacity: 0, x: 20 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                            >
                               <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                <div className="size-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 relative z-10">
                                  <ShieldCheck className="size-6" />
                                </div>
                                <div className="relative z-10">
                                  <h3 className="text-xs font-black text-white uppercase tracking-tighter">Criptografia Ativa</h3>
                                  <p className="text-[8px] text-white/50 font-black uppercase tracking-[0.2em] mt-1">Verificação KYC</p>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] ml-1 text-center">Upload de Documentação</h4>
                                <div className="flex flex-col sm:flex-row gap-4">
                                  {/* Hidden Inputs */}
                                  <input type="file" ref={frontDocRef} className="hidden" onChange={(e) => setFrontDocName(e.target.files?.[0]?.name || null)} />
                                  <input type="file" ref={backDocRef} className="hidden" onChange={(e) => setBackDocName(e.target.files?.[0]?.name || null)} />

                                  <button 
                                    type="button" onClick={() => frontDocRef.current?.click()}
                                    className={`flex-1 group/upload flex items-center gap-3 rounded-xl border-2 border-dashed h-20 px-4 transition-all relative overflow-hidden active:scale-95
                                      ${frontDocName 
                                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' 
                                        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#111922] text-slate-400 hover:border-primary/40'
                                      }`}
                                  >
                                    <div className={`p-2 rounded-lg shadow-sm group-hover/upload:scale-110 transition-transform ${frontDocName ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/5'}`}>
                                       {frontDocName ? <CheckCircle2 className="size-5" /> : <UploadCloud className="size-5" />}
                                    </div>
                                    <div className="text-left min-w-0">
                                       <span className="text-[9px] font-black uppercase tracking-widest">{frontDocName ? 'Identidade' : 'BI / Passaporte'}</span>
                                       <p className="text-[8px] font-bold opacity-60 truncate mt-0.5">{frontDocName || 'Frente'}</p>
                                    </div>
                                  </button>

                                  <button 
                                    type="button" onClick={() => backDocRef.current?.click()}
                                    className={`flex-1 group/upload flex items-center gap-3 rounded-xl border-2 border-dashed h-20 px-4 transition-all relative overflow-hidden active:scale-95
                                      ${backDocName 
                                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' 
                                        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#111922] text-slate-400 hover:border-primary/40'
                                      }`}
                                  >
                                    <div className={`p-2 rounded-lg shadow-sm group-hover/upload:scale-110 transition-transform ${backDocName ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/5'}`}>
                                       {backDocName ? <CheckCircle2 className="size-5" /> : <UploadCloud className="size-5" />}
                                    </div>
                                    <div className="text-left min-w-0">
                                       <span className="text-[9px] font-black uppercase tracking-widest">{backDocName ? 'Identidade' : 'BI / Passaporte'}</span>
                                       <p className="text-[8px] font-bold opacity-60 truncate mt-0.5">{backDocName || 'Verso'}</p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Responsive Button Group */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          {signUpStep > 1 && (
                            <button
                              type="button" onClick={prevStep}
                              className="w-full sm:w-auto px-6 h-12 rounded-xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[9px] tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                              <ArrowLeft className="size-3.5" />
                              <span>Anterior</span>
                            </button>
                          )}

                          <button
                            type={signUpStep < 2 ? "button" : "submit"}
                            onClick={signUpStep < 2 ? nextStep : undefined}
                            disabled={signUpStep === 2 && isRegisterPending}
                            className={`grow h-12 bg-primary text-white rounded-xl font-black uppercase text-[9px] sm:text-xs tracking-[0.2em] shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 group/btn hover:bg-primary/95
                              ${signUpStep === 2 && isRegisterPending ? 'opacity-50' : ''}`}
                          >
                            {signUpStep === 2 && isRegisterPending ? (
                              <RefreshCcw className="size-5 animate-spin" />
                            ) : (
                              <>
                                <span>{signUpStep < 2 ? 'Continuar para KYC' : 'Finalizar Encriptação'}</span>
                                <ChevronRight className="size-4 group-hover/btn:translate-x-1.5 transition-transform" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Trust Signal - Compacted */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-8 md:mt-10 flex flex-col items-center text-center gap-4"
            >
              <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="size-4 text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Banco Central Compliant</span>
                </div>
                <div className="size-1.5 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2">
                   <Zap className="size-4 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">End-to-End Encription</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">© 2026 KwanzaConnect – Todos os direitos reservados</p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
