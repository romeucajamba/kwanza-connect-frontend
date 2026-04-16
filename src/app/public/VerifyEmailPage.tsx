import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useVerifyEmail } from '@services/auth.hooks';
import { APP_ROUTES } from '@constants';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display selection:bg-primary selection:text-white">
      <div className="layout-container flex h-full grow flex-col px-4 py-10 md:px-10 lg:px-20 justify-center items-center">
        
        <div className="layout-content-container flex flex-col w-full max-w-md">
          <div className="bg-white dark:bg-[#192633] p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-center mb-8">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3"
               >
                 <ShieldCheck className="size-10" />
               </motion.div>
            </div>

            <div className="space-y-6">
               {isPending && (
                  <div className="flex flex-col items-center gap-4">
                     <RefreshCcw className="size-10 text-primary animate-spin" />
                     <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Verificando Conta...</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Aguarde um momento enquanto validamos o seu e-mail.</p>
                  </div>
               )}

               {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                     <CheckCircle2 className="size-16 text-emerald-500 mb-2" />
                     <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Conta Verificada!</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                       O seu e-mail foi validado com sucesso. Agora pode aceder a todas as funcionalidades do KwanzaConnect.
                     </p>
                     <button 
                       onClick={() => navigate(APP_ROUTES.LOGIN)}
                       className="mt-4 flex items-center justify-center gap-2 w-full h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                     >
                       Ir para Login
                       <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </motion.div>
               )}

               {isError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                     <AlertCircle className="size-16 text-rose-500 mb-2" />
                     <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Erro na Verificação</h2>
                     <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest leading-relaxed">
                       {(error as any)?.response?.data?.message || 'O link de verificação expirou ou é inválido.'}
                     </p>
                     <button 
                       onClick={() => navigate(APP_ROUTES.LOGIN)}
                       className="mt-4 w-full h-12 bg-slate-50 dark:bg-[#111922] text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 dark:border-white/5 hover:bg-white transition-all"
                     >
                       Voltar ao Início
                     </button>
                  </motion.div>
               )}

               {!token && !isPending && (
                  <div className="flex flex-col items-center gap-4">
                     <AlertCircle className="size-16 text-amber-500 mb-2" />
                     <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Link Inválido</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Não foi encontrado um token de verificação válido.</p>
                     <button 
                       onClick={() => navigate(APP_ROUTES.LOGIN)}
                       className="mt-4 w-full h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg"
                     >
                       Ir para Login
                     </button>
                  </div>
               )}
            </div>
          </div>

          <div className="mt-8 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                © 2024 KwanzaConnect • P2P Crypto Exchange
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmailPage;
