import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Star, 
  MessageCircle, 
  ShieldCheck, 
  PlusCircle, 
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { useOffers, useExpressInterest } from '@/services/offers.hooks';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/constants';
import { Link, useNavigate } from 'react-router-dom';

const ReceberOfertaPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: offers, isLoading } = useOffers();
  const { mutate: expressInterest } = useExpressInterest();
  const [search, setSearch] = useState('');

  const filteredOffers = (offers as any[])?.filter((o: any) => 
    o.give_currency.code.toLowerCase().includes(search.toLowerCase()) ||
    o.want_currency.code.toLowerCase().includes(search.toLowerCase()) ||
    o.owner.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInterest = (offerId: string) => {
    expressInterest({ offerId, message: 'Estou interessado nesta oferta.' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Section Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Explorar <span className="text-primary italic">P2P</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Troque ativos diretamente com utilizadores verificados.
          </p>
        </div>
        <Link 
          to={APP_ROUTES.P2P_POST}
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 rounded-lg hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
        >
          <PlusCircle className="size-3.5" />
          <span>Criar Oferta</span>
        </Link>
      </div>

      {/* Filtros e Pesquisa Compactos */}
      <div className="bg-white dark:bg-[#192633] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar moedas (USD, AOA, BTC)..."
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 bg-slate-50 dark:bg-white/5 text-slate-400 font-bold uppercase text-[9px] tracking-widest rounded-lg hover:text-primary transition-colors border border-transparent">
            <Filter className="size-3.5" />
            <span>Filtros</span>
          </button>
          <div className="hidden sm:flex items-center justify-center size-9 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Sparkles className="size-4 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid de Ofertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredOffers?.map((offer: any) => {
            const isOwner = offer.owner.id === user?.id;
            return (
              <motion.div 
                key={offer.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/20 dark:bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="size-8 rounded-lg bg-center bg-cover border-2 border-slate-50 dark:border-[#111922] group-hover:border-primary/20 transition-all shadow-sm"
                      style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.owner.email})` }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase truncate max-w-[80px] leading-none">{offer.owner.email.split('@')[0]}</p>
                        <CheckCircle2 className="size-2.5 text-emerald-500" />
                      </div>
                      <p className="text-[7px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">ID: #{offer.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#111922] px-1.5 py-0.5 rounded shadow-sm border border-slate-50 dark:border-white/5">
                      <Star className="size-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-[8px] font-bold text-slate-400">4.9</span>
                  </div>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  <div className="p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-slate-100/50 dark:border-white/5 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                     <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Dá</span>
                           <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                              {offer.give_amount.toLocaleString()} <span className="text-[9px] opacity-40 ml-0.5">{offer.give_currency.code}</span>
                           </p>
                        </div>
                        <ArrowRightLeft className="size-3 text-primary opacity-30 mx-2" />
                        <div className="flex flex-col text-right">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Recebe</span>
                           <p className="text-sm font-bold text-primary leading-none">
                              {offer.want_amount.toLocaleString()} <span className="text-[9px] opacity-70 ml-0.5">{offer.want_currency.code}</span>
                           </p>
                        </div>
                     </div>
                     <div className="h-px w-full bg-slate-200/50 dark:bg-white/5 my-3" />
                     <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-60">
                        <p className="text-slate-400">Taxa Câmbio</p>
                        <p className="text-slate-900 dark:text-white">1 {offer.give_currency.code} = {(offer.want_amount / offer.give_amount).toFixed(2)}</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['AO IBAN', 'Imediato'].map(m => (
                      <span key={m} className="px-2 py-0.5 rounded border border-slate-100 dark:border-white/5 text-[7px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-white/5">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 flex gap-2">
                    <button 
                      disabled={isOwner}
                      onClick={() => handleInterest(offer.id)}
                      className="flex-1 h-9 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-md shadow-primary/10 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Interesse
                    </button>
                    <button className="h-9 w-9 bg-slate-50 dark:bg-[#111922] text-slate-300 hover:text-primary rounded-lg flex items-center justify-center transition-all border border-slate-100 dark:border-white/5 hover:border-primary/10">
                      <MessageCircle className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOffers?.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="size-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 mb-5 border border-dashed border-slate-200/50 dark:border-white/10">
                 <Search className="size-6 opacity-30" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Nenhuma oferta</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-relaxed opacity-60">Tente ajustar os filtros ou pesquisar outra moeda.</p>
           </div>
        )}
      </div>

      {/* Escrow Banner Compacto */}
      <div className="bg-slate-900 dark:bg-[#0a0f18] rounded-xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center gap-6">
         <ShieldCheck className="absolute -bottom-6 -right-6 size-32 text-white/[0.03] -rotate-12 pointer-events-none" />
         <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <ShieldCheck className="size-6" />
         </div>
         <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold uppercase tracking-tight mb-1">Câmbio Seguro <span className="text-primary italic">P2P</span></h2>
            <p className="text-[9px] font-medium text-white/40 leading-relaxed max-w-lg uppercase tracking-wide">
               Activos protegidos por sistema de custódia até à confirmação do pagamento.
            </p>
         </div>
         <button className="w-full sm:w-auto px-6 h-10 bg-white text-slate-900 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-md">
            Saber Mais
         </button>
      </div>
    </div>
  );
};

export default ReceberOfertaPage;
