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
  RefreshCcw,
} from 'lucide-react';
import { useOffers, useExpressInterest } from '@/services/offers.hooks';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/constants';
import { Link } from 'react-router-dom';
import type { Offer } from '@/types';

const ReceberOfertaPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  
  // Estados para pesquisa
  const [searchInput, setSearchInput] = useState('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  
  const { data: offers, isLoading } = useOffers(queryParams);
  const { mutate: expressInterest, isPending: isInteresting } = useExpressInterest();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setQueryParams(searchInput.trim() ? { search: searchInput.trim() } : {});
  };

  const handleInterest = (offerId: string) => {
    setPendingId(offerId);
    expressInterest(
      { offerId, payload: { message: 'Estou interessado nesta oferta.' } },
      { onSettled: () => setPendingId(null) }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
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

      {/* Filtros e Pesquisa */}
      <form 
        onSubmit={handleSearch}
        className="bg-white dark:bg-[#192633] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Pesquisar moedas ou utilizadores..."
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            type="submit"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-6 bg-primary text-white font-bold uppercase text-[9px] tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
          >
            {isLoading ? <RefreshCcw className="size-3 animate-spin" /> : <Search className="size-3.5" />}
            <span>Pesquisar</span>
          </button>
          
          <button 
            type="button"
            className="flex items-center justify-center size-9 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-lg hover:text-primary transition-colors"
          >
            <Filter className="size-3.5" />
          </button>
        </div>
      </form>

      {/* Grid de Ofertas */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {(offers as Offer[])?.map((offer) => {
              const isOwner = offer.owner?.id === user?.id;
              const isLoadingThis = pendingId === offer.id && isInteresting;
              const rate = offer.give_amount > 0 ? (Number(offer.want_amount) / Number(offer.give_amount)).toFixed(4) : '—';

              return (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/20 dark:bg-white/5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-8 rounded-lg bg-center bg-cover border-2 border-slate-50 dark:border-[#111922] group-hover:border-primary/20 transition-all shadow-sm"
                        style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.owner?.email || offer.id})` }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase truncate max-w-[80px] leading-none">
                            {offer.owner?.full_name || offer.owner?.email?.split('@')[0] || 'Utilizador'}
                          </p>
                          <CheckCircle2 className="size-2.5 text-emerald-500" />
                        </div>
                        <p className="text-[7px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                          ID: #{offer.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${offer.offer_type === 'sell' ? 'bg-primary/5 text-primary' : 'bg-emerald-500/5 text-emerald-500'}`}>
                      {offer.offer_type === 'sell' ? 'Vende' : 'Compra'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4 flex-1 flex flex-col">
                    <div className="p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-slate-100/50 dark:border-white/5 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Dá</span>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                            {Number(offer.give_amount).toLocaleString('pt-AO')}{' '}
                            <span className="text-[9px] opacity-40 ml-0.5">{offer.give_currency?.code}</span>
                          </p>
                        </div>
                        <ArrowRightLeft className="size-3 text-primary opacity-30 mx-2" />
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Recebe</span>
                          <p className="text-sm font-bold text-primary leading-none">
                            {Number(offer.want_amount).toLocaleString('pt-AO')}{' '}
                            <span className="text-[9px] opacity-70 ml-0.5">{offer.want_currency?.code}</span>
                          </p>
                        </div>
                      </div>
                      <div className="h-px w-full bg-slate-200/50 dark:bg-white/5 my-3" />
                      <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-60">
                        <p className="text-slate-400">Taxa Câmbio</p>
                        <p className="text-slate-900 dark:text-white">
                          1 {offer.give_currency?.code} = {rate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-100 dark:border-white/5 text-[7px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5">
                        <ShieldCheck className="size-2.5" /> KYC Verificado
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-100 dark:border-white/5 text-[7px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-white/5">
                        <Star className="size-2.5 fill-amber-400 text-amber-400" /> 4.9
                      </span>
                    </div>

                    <div className="mt-auto pt-4 flex gap-2">
                      <button
                        disabled={isOwner || isLoadingThis}
                        onClick={() => handleInterest(offer.id)}
                        className="flex-1 h-9 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-md shadow-primary/10 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {isLoadingThis ? (
                          <RefreshCcw className="size-3 animate-spin" />
                        ) : (
                          'Manifestar Interesse'
                        )}
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

          {(!offers || (offers as Offer[]).length === 0) && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="size-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 mb-5 border border-dashed border-slate-200/50 dark:border-white/10">
                <Search className="size-6 opacity-30" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Nenhuma oferta</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-relaxed opacity-60">
                Tente ajustar os filtros ou pesquisar outra moeda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceberOfertaPage;
