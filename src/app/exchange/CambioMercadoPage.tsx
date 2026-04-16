import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Search, 
  Star, 
  Filter, 
  ChevronUp, 
  Activity,
  ArrowRightLeft,
  Calendar,
  Zap
} from 'lucide-react';
import { useExchangeRates } from '@services/rates.hooks';
import { APP_ROUTES } from '@constants';
import { Link } from 'react-router-dom';

const CambioMercadoPage: React.FC = () => {
  const { data: rates, isLoading } = useExchangeRates();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredRates = rates?.filter((rate: any) => {
    const matchesSearch = rate.to_currency.name.toLowerCase().includes(search.toLowerCase()) || 
                         rate.to_currency.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || favorites.includes(rate.id.toString());
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Câmbio <span className="text-primary italic">Global</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 flex items-center gap-2">
            <Calendar className="size-3" />
            Atualizado em tempo real
          </p>
        </div>
        <Link 
          to={APP_ROUTES.CONVERSAO}
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 rounded-lg hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
        >
          <TrendingUp className="size-3.5" />
          <span>Converter moeda</span>
        </Link>
      </div>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Volume (24h)', value: 'Kz 1.2B', change: '+12%', icon: Activity, color: 'text-emerald-500' },
          { label: 'Taxa USD', value: 'Kz 850.00', change: '-0.5%', icon: TrendingUp, color: 'text-primary' },
          { label: 'Pares', value: '24 Ativos', change: 'Estável', icon: Star, color: 'text-amber-500' },
          { label: 'Spread', value: '0.2%', change: '+0.01%', icon: Filter, color: 'text-slate-500' },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="size-3.5" />
              </div>
              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${filter === 'all' ? 'bg-white dark:bg-[#111922] text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${filter === 'favorites' ? 'bg-white dark:bg-[#111922] text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Favoritos
            </button>
          </div>
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar moeda..."
              className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg pl-9 pr-4 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/20 dark:bg-[#111922]/20 border-b border-slate-100 dark:border-white/5 opacity-50">
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Código</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Compra</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Venda</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Tendência</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Acção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <AnimatePresence>
                {filteredRates?.map((rate: any) => (
                  <motion.tr 
                    key={rate.to_currency.code}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleFavorite(rate.to_currency.code)}
                          className={`transition-all h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 ${favorites.includes(rate.to_currency.code) ? 'text-amber-500' : 'text-slate-200'}`}
                        >
                          <Star className={`size-3.5 ${favorites.includes(rate.to_currency.code) ? 'fill-amber-500' : ''}`} />
                        </button>
                        <div className="size-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-base shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                           {rate.to_currency.flag_emoji || rate.to_currency.code[0]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase leading-none">{rate.to_currency.code}</p>
                          <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{rate.to_currency.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-xs font-medium text-slate-900 dark:text-white">
                      {(rate.rate * 0.995).toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-xs font-medium text-slate-900 dark:text-white">
                      {(rate.rate * 1.005).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1 text-emerald-500 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">
                         <ChevronUp className="size-3" />
                         <span>0.8%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`${APP_ROUTES.P2P_BROWSE}?currency=${rate.to_currency.code}`}
                        className="inline-flex items-center justify-center h-8 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        Trocar
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Filter View */}
        <div className="md:hidden p-4 space-y-3">
           {filteredRates?.map((rate: any) => (
             <div key={rate.to_currency.code} className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white dark:bg-[#111922] flex items-center justify-center text-base shadow-sm">
                        {rate.to_currency.flag_emoji}
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{rate.to_currency.code}</p>
                   </div>
                   <Star className={`size-3.5 ${favorites.includes(rate.to_currency.code) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                   <div className="space-y-0.5">
                      <span className="text-slate-400 opacity-60 uppercase">Compra</span>
                      <p className="text-slate-900 dark:text-white">{(rate.rate * 0.995).toLocaleString()}</p>
                   </div>
                   <div className="space-y-0.5 text-right">
                      <span className="text-slate-400 opacity-60 uppercase">Venda</span>
                      <p className="text-slate-900 dark:text-white">{(rate.rate * 1.005).toLocaleString()}</p>
                   </div>
                </div>
                <Link to={`${APP_ROUTES.P2P_BROWSE}?currency=${rate.to_currency.code}`} className="mt-4 w-full h-10 bg-primary text-white rounded-lg text-[9px] font-bold uppercase flex items-center justify-center">Negociar</Link>
             </div>
           ))}
        </div>
      </div>
      
      {/* Banner Section */}
      <div className="p-5 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
         <div className="size-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
            <ArrowRightLeft className="size-4.5" />
         </div>
         <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Taxas Médias de Mercado</h3>
            <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed opacity-70">Valores referenciais. Use o Mercado P2P para as melhores taxas directas.</p>
         </div>
         <button className="hidden sm:block px-6 py-2 bg-white dark:bg-[#192633] text-primary font-bold uppercase text-[9px] tracking-widest rounded-lg shadow-sm">Detalhes</button>
      </div>
    </div>
  );
};

export default CambioMercadoPage;
