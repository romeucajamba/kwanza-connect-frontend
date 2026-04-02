import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  ShieldCheck, 
  Clock,
  Calculator
} from 'lucide-react';
import { useExchangeRates } from '../services/rates.hooks';
import type { ExchangeRate } from '../types';

const ConversaoPage: React.FC = () => {
  const { data: rates, isLoading } = useExchangeRates();
  const [giveAmount, setGiveAmount] = useState('1');
  const [giveCurrency, setGiveCurrency] = useState('USD');
  const [receiveCurrency, setReceiveCurrency] = useState('AOA');

  const currentRate = (rates as ExchangeRate[])?.find(r => r.to_currency.code === giveCurrency)?.rate || 850;
  const receiveAmount = (parseFloat(giveAmount || '0') * currentRate).toFixed(2);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Simulador <span className="text-primary italic">Activos</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Conversão instantânea com taxas de mercado em tempo real.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 bg-white dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-100 dark:border-white/5 overflow-hidden">
           <Clock className="size-3 text-primary animate-pulse" />
           <span className="text-[8px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest leading-none">Sync Live: Luanda</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Converter Card */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-50 pointer-events-none group-hover:bg-primary/10 transition-colors" />
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Converter</label>
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest opacity-60">Disponível: 1,250 USD</span>
                 </div>
                 <div className="flex items-center gap-3 p-4 md:p-5 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent focus-within:border-primary/10 shadow-inner transition-all">
                    <input 
                      type="number" step="0.01" className="flex-1 bg-transparent border-none p-0 text-xl font-bold text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-200" 
                      value={giveAmount} onChange={(e) => setGiveAmount(e.target.value)}
                    />
                    <select className="bg-transparent border-none text-[9px] font-bold text-primary focus:ring-0 pr-8 cursor-pointer uppercase tracking-widest" value={giveCurrency} onChange={(e) => setGiveCurrency(e.target.value)}>
                       <option>USD</option>
                       <option>EUR</option>
                       <option>BTC</option>
                    </select>
                 </div>
              </div>

              <div className="flex justify-center relative py-1">
                 <div className="size-10 rounded-lg bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center transform hover:rotate-180 transition-transform duration-500 cursor-pointer active:scale-90 relative z-20 border-2 border-white dark:border-[#192633]">
                    <ArrowRightLeft className="size-4" />
                 </div>
                 <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 dark:bg-white/5 z-10" />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Receber Estimado</label>
                 <div className="flex items-center gap-3 p-4 md:p-5 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent shadow-inner">
                    <p className="flex-1 text-xl font-bold text-primary tracking-tight">{receiveAmount}</p>
                    <select className="bg-transparent border-none text-[9px] font-bold text-primary focus:ring-0 pr-8 cursor-pointer uppercase tracking-widest" value={receiveCurrency} onChange={(e) => setReceiveCurrency(e.target.value)}>
                       <option>AOA</option>
                       <option>USD</option>
                    </select>
                 </div>
              </div>

              <div className="pt-4">
                <button className="w-full h-11 bg-primary text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all group active:scale-95">
                  Trocar agora no P2P
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="p-6 md:p-8 bg-slate-900 rounded-xl text-white space-y-6 relative overflow-hidden shadow-lg">
              <Calculator className="absolute -bottom-6 -right-6 size-24 text-white/[0.03] -rotate-12 pointer-events-none" />
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center shadow-lg">
                    <TrendingUp className="size-4.5 text-primary" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-tight">Câmbio <span className="text-primary italic">Live</span></h3>
              </div>
              <div className="space-y-5">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Taxa Média Mercado</span>
                    <span>1 USD = {currentRate} AOA</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary" />
                 </div>
                 <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest leading-relaxed opacity-60">Actualizado via API Global Directa. Variação +/- 0.2% nas últimas horas.</p>
              </div>
           </div>

           <div className="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-3">
              <div className="flex items-center gap-3 opacity-80">
                 <ShieldCheck className="size-4 text-emerald-500" />
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Proteção via Smart Escrow</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight opacity-70">
                Seu activo será mantido em custódia segura até à confirmação final da liquidez da operação.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConversaoPage;
