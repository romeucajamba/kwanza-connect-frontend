import React from 'react';
import { motion } from 'framer-motion';
import { useOffers, useExpressInterest } from '@services';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@constants';
import type { Offer } from '../types';

const ReceberOfertaPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: offers, isLoading: offersLoading } = useOffers();
  const { mutate: expressInterest } = useExpressInterest();

  const handleInterest = (offerId: string) => {
    expressInterest({ offerId, message: 'Gostaria de aceitar sua oferta e iniciar a negociação.' });
  };

  if (offersLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-12 border-4 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display transition-colors">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation Sidebar Placeholder / Info */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] p-8 shadow-2xl sticky top-24"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Minha Carteira</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-70">Saldo disponível para trocas</p>
            </div>

            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Saldo Total (AOA)</span>
                  <p className="text-3xl font-black text-primary">{user?.balance?.toLocaleString('pt-AO')} Kz</p>
               </div>
               
               <button 
                 onClick={() => navigate(APP_ROUTES.P2P_POST)}
                 className="w-full h-14 bg-primary hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
               >
                 <span className="material-symbols-outlined text-sm">add_circle</span>
                 Publicar Minha Oferta
               </button>

               <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hidden md:block">
                  <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Dica de Segurança
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 leading-relaxed">
                    Sempre utilize o chat interno para detalhes da transação. Nunca compartilhe comprovantes via canais externos antes da confirmação do sistema.
                  </p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Market List */}
        <div className="xl:col-span-2 order-1 xl:order-2 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Ofertas no Mural</h1>
            <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">As melhores taxas do mercado P2P disponíveis agora.</p>
          </div>

          <div className="rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633] p-2 shadow-xl">
             <div className="p-4">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-[#101922] border-none rounded-2xl text-xs font-black outline-none focus:ring-2 focus:ring-primary/30 transition-all uppercase tracking-widest"
                    placeholder="Filtrar por moeda ou usuário..."
                  />
                </div>
             </div>
             <div className="flex gap-3 px-4 pb-4">
                <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Recomendado</span>
                </button>
             </div>
          </div>

          <div className="space-y-4">
            {offers?.length === 0 && (
                <div className="p-20 text-center border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nenhuma oferta disponível no momento.</p>
                </div>
            )}
            {offers?.map((offer: Offer, idx: number) => (
              <motion.div 
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] border transition-all hover:shadow-2xl cursor-pointer group ${
                  idx === 0 ? 'border-primary/30 bg-primary/5 dark:bg-primary/20' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#192633]'
                }`}
              >
                {idx === 0 && (
                  <div className={`absolute -top-3 left-8 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg bg-primary text-white`}>
                    Melhor Taxa
                  </div>
                )}
                
                <div className="flex flex-col gap-6 flex-1 w-full">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full border-4 border-white dark:border-[#101922] shadow-xl overflow-hidden bg-background-light dark:bg-background-dark">
                        <img src={offer.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.owner.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">{offer.owner.full_name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-500 !text-sm">verified</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{offer.owner.is_verified ? 'Verificado' : 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Troca P2P</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase">
                            {offer.give_amount.toLocaleString('pt-AO')} {offer.give_currency.code} → {offer.want_amount.toLocaleString('pt-AO')} {offer.want_currency.code}
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Taxa Individual</p>
                        <p className="text-sm font-black text-primary uppercase">1 {offer.give_currency.code} = {(offer.want_amount / offer.give_amount).toFixed(2)} {offer.want_currency.code}</p>
                     </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                   {offer.owner.id !== user?.id && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleInterest(offer.id); }}
                       className="flex-1 sm:flex-none h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                     >
                        Aceitar Oferta
                     </button>
                   )}
                   {offer.owner.id === user?.id && (
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Sua Oferta</span>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceberOfertaPage;
