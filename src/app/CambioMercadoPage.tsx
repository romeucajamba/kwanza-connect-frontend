import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExchangeRates } from '@services/rates.hooks';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@constants';

const CambioMercadoPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rates, isLoading, refetch } = useExchangeRates();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          refetch();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [refetch]);

  if (isLoading) {
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

  // Map API rates to stats cards (top 4)
  const stats = (rates || []).slice(0, 4).map(r => ({
    pair: `${r.from_currency.code} / ${r.to_currency.code}`,
    price: r.rate.toLocaleString('pt-AO', { minimumFractionDigits: 2 }),
    change: '+0.00%', // API currently doesn't provide change, using placeholder
    trend: 'flat',
    vol: '--',
    flag: r.from_currency.flag_emoji || 'https://api.dicebear.com/7.x/initials/svg?seed=' + r.from_currency.code
  }));

  return (
    <div className="flex-1 flex flex-col gap-6 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 transition-colors">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] uppercase">
              Mercado de Câmbio
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live
            </span>
          </div>
          <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">
            Taxas de câmbio oficiais atualizadas em tempo real. Base: Kwanza (AOA).
          </p>
        </div>
        <div className="text-right text-sm text-gray-400 dark:text-[#92adc9] font-bold">
          <p>Próxima atualização em: <span className="font-mono text-primary">{timeLeft}s</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 overflow-hidden">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col gap-2 rounded-2xl p-6 border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center text-xs">
                  {stat.flag.startsWith('http') ? (
                     <img src={stat.flag} alt={stat.pair} className="w-full h-full object-cover" />
                  ) : (
                     <span>{stat.flag}</span>
                  )}
                </div>
                <p className="text-black dark:text-white text-sm font-black uppercase tracking-wider">{stat.pair}</p>
              </div>
              <span className={`material-symbols-outlined text-slate-400`}>trending_flat</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-black dark:text-white text-2xl font-black">{stat.price}</p>
              <p className={`text-xs font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500`}>
                {stat.change}
              </p>
            </div>
            <p className="text-gray-400 dark:text-[#92adc9] text-[10px] uppercase font-bold tracking-widest mt-1">Atualizado agora</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="px-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold text-sm"
              placeholder="Buscar moeda (ex: USD, EUR, GBP)"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">star</span>
              Favoritos
            </button>
            <button className="flex items-center justify-center h-12 w-12 rounded-xl bg-white dark:bg-[#1c2a38] border border-gray-100 dark:border-white/5 text-gray-500 hover:text-primary transition-all">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c2a38] shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-[#1a2632]">
                <tr>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Moeda</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Compra (AOA)</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Venda (AOA)</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Var. 24h</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Gráfico</th>
                  <th className="px-6 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {(rates || []).map((curr, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background-light dark:bg-background-dark border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden">
                          {curr.from_currency.flag_emoji ? (
                            <span className="text-xl">{curr.from_currency.flag_emoji}</span>
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${curr.from_currency.code}`} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-black dark:text-white uppercase tracking-wider">{curr.from_currency.code}</p>
                          <p className="text-[10px] font-bold text-gray-400">{curr.from_currency.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-black text-black dark:text-white font-mono">{(curr.rate * 0.98).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-sm font-black text-black dark:text-white font-mono">{(curr.rate * 1.02).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-sm font-black text-emerald-500`}>
                        <span className="material-symbols-outlined text-[20px]">arrow_drop_up</span>
                        +0.05%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <svg viewBox="0 0 100 30" width="80" height="24" className="text-emerald-500">
                          <path 
                            d="M0 25 L20 15 L40 20 L60 5 L80 10 L100 0" 
                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => navigate(APP_ROUTES.CONVERSAO)}
                        className="bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95"
                      >
                        Trocar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CambioMercadoPage;
