import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  Calculator,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { useExchangeRates, useCurrencies } from '@/services/rates.hooks';
import type { ExchangeRate, Currency } from '@/types';
import { useNavigate } from 'react-router-dom';

const ConversaoPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rates, isLoading: isLoadingRates } = useExchangeRates();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  
  const [giveAmount, setGiveAmount] = useState('1');
  const [giveCurrency, setGiveCurrency] = useState('USD');
  const [receiveCurrency, setReceiveCurrency] = useState('AOA');

  const localRate = useMemo(() => {
    if (!rates) return 0;
    const directRate = (rates as ExchangeRate[])?.find(
        r => r.from_currency.code === giveCurrency && r.to_currency.code === receiveCurrency
      )?.rate;
    
    if (directRate) return directRate;

    // Fallback calculation via USD
    const usdToGive = (rates as ExchangeRate[])?.find(r => r.to_currency.code === giveCurrency)?.rate || 1;
    const usdToReceive = (rates as ExchangeRate[])?.find(r => r.to_currency.code === receiveCurrency)?.rate || 1;
    
    return usdToReceive / usdToGive;
  }, [rates, giveCurrency, receiveCurrency]);

  const receiveAmount = (parseFloat(giveAmount || '0') * localRate).toFixed(2);
  const isLoading = isLoadingRates || isLoadingCurrencies;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-black leading-tight tracking-tight uppercase">
            Simulador <span className="text-primary italic">Activos</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Conversão instantânea com taxas de mercado em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-white dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
           <Clock className="size-3 text-primary animate-pulse" />
           <span className="text-[8px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest leading-none">Status: Sincronizado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Converter Card */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-6 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-50 pointer-events-none group-hover:bg-primary/10 transition-colors" />
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pares de Conversão</label>
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest opacity-60">1 {giveCurrency} = {localRate.toFixed(4)} {receiveCurrency}</span>
                 </div>
                 <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-primary/40 shadow-inner transition-all group/input">
                    <input 
                      type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-3xl font-black text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200 outline-none" 
                      value={giveAmount} onChange={(e) => setGiveAmount(e.target.value)}
                    />
                    <div className="flex flex-col items-end gap-1">
                        <select 
                           className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm rounded-lg text-xs font-black text-primary focus:ring-2 focus:ring-primary/20 px-4 py-2 cursor-pointer uppercase tracking-widest outline-none transition-all hover:border-primary" 
                           value={giveCurrency} onChange={(e) => setGiveCurrency(e.target.value)}
                        >
                           {currencies?.map((c: Currency) => <option key={`give-${c.id}`} value={c.code}>{c.code}</option>)}
                        </select>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mr-1">Tenho</span>
                    </div>
                 </div>
              </div>

              <div className="flex justify-center relative py-2">
                 <button 
                  onClick={() => {
                    const temp = giveCurrency;
                    setGiveCurrency(receiveCurrency);
                    setReceiveCurrency(temp);
                  }}
                  className="size-12 rounded-xl bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center transform hover:rotate-180 transition-all duration-500 cursor-pointer active:scale-90 relative z-20 border-4 border-white dark:border-[#192633]"
                 >
                    <ArrowRightLeft className="size-5" />
                 </button>
                 <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 dark:bg-white/5 z-10" />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor Final Estimado</label>
                 <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5 shadow-inner group/output">
                    <p className="flex-1 text-3xl font-black text-primary tracking-tighter">{receiveAmount}</p>
                    <div className="flex flex-col items-end gap-1">
                        <select 
                           className="bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm rounded-lg text-xs font-black text-primary focus:ring-2 focus:ring-primary/20 px-4 py-2 cursor-pointer uppercase tracking-widest outline-none transition-all hover:border-primary" 
                           value={receiveCurrency} onChange={(e) => setReceiveCurrency(e.target.value)}
                        >
                           {currencies?.map((c: Currency) => <option key={`receive-${c.id}`} value={c.code}>{c.code}</option>)}
                        </select>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mr-1">Recebo</span>
                    </div>
                 </div>
              </div>

              <div className="pt-4 flex flex-col items-center gap-4">
                <button 
                  onClick={() => navigate('/p2p/browse', { state: { give_currency: giveCurrency, want_currency: receiveCurrency } })}
                  className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/95 transition-all group active:scale-95 flex items-center justify-center gap-3 outline-none"
                >
                  Negociar no Mercado P2P
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">As taxas do mercado P2P podem variar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="p-8 bg-slate-900 rounded-xl text-white space-y-8 relative overflow-hidden shadow-2xl">
              <Calculator className="absolute -bottom-8 -right-8 size-32 text-white/[0.03] -rotate-12 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                 <div className="size-12 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shadow-lg">
                    <TrendingUp className="size-6 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Câmbio <span className="text-primary italic">Live Feed</span></h3>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Fonte: Market Global API</span>
                 </div>
              </div>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Taxa Referencial</span>
                    <span className="text-white">1 {giveCurrency} = {localRate.toFixed(4)} {receiveCurrency}</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <RefreshCcw className="size-4 text-primary animate-spin-slow" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">As taxas flutuam conforme a liquidez global. O valor final é acordado no chat P2P.</p>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="size-5 text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Escrow de Proteção Ativo</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                O capital das ofertas no mercado é protegido por custódia inteligente até a confirmação de recebimento.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConversaoPage;
