import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users,
  Repeat,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { APP_ROUTES } from '@constants';
import { useDashboardStats, useExchangeRates } from '@services/rates.hooks';
import { useTransactions } from '@services/transactions.hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAvatarUrl } from '@lib/media';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  const { data: rates } = useExchangeRates('AOA');
  const { data: recentTransactions } = useTransactions();

  // Market stats from backend
  const topCurrencies = stats?.top_currencies || [];
  const availableCurrencies = stats?.available_currencies || [];

  const kwanzaToUsd = rates?.find(r => r.to_currency.code === 'USD')?.rate || 0;
  const kwanzaToEur = rates?.find(r => r.to_currency.code === 'EUR')?.rate || 0;

  const chartData = useMemo(() => {
    return topCurrencies.map(c => ({
      name: c.code,
      Ofertas: c.count,
    }));
  }, [topCurrencies]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'completed': 'Concluída',
      'pending': 'Pendente',
      'processing': 'Processando',
      'cancelled': 'Cancelada',
      'failed': 'Falhou'
    };
    return labels[status.toLowerCase()] || status;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-10"
    >
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Visão de Mercado
          </h1>
          <p className="text-slate-500 dark:text-[#92adc9] text-sm mt-1">
            Métricas e oportunidades em tempo real na KwanzaConnect
          </p>
        </div>
        <button 
          onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
          className="flex items-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95"
        >
          <BarChart3 className="size-4" />
          <span>Ver Mercado P2P</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Chart Section */}
          <div className="flex flex-col rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 p-6 h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Moedas Mais Procuradas</h2>
            <div className="flex-1 w-full h-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#111922', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="Ofertas" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                  Sem dados suficientes no mercado
                </div>
              )}
            </div>
          </div>

          {/* Available Currencies Horizontal Scroll */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Moedas Disponíveis na Plataforma</h2>
            <div className="flex overflow-hidden overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {availableCurrencies.map((c: any) => (
                <div key={c.code} className="snap-start flex-shrink-0 flex items-center gap-4 bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 rounded-2xl p-4 w-64 shadow-sm hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}>
                  <div className="text-4xl">{c.flag_emoji}</div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 dark:text-white leading-tight">{c.code}</span>
                    <span className="text-xs text-slate-500 dark:text-[#92adc9] line-clamp-1">{c.name}</span>
                  </div>
                </div>
              ))}
              {availableCurrencies.length === 0 && (
                <div className="text-slate-400 text-sm py-4">Nenhuma moeda configurada no sistema.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Market Rates Card */}
          <div className="bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
             <TrendingUp className="absolute -bottom-4 -right-4 size-24 text-slate-900/[0.03] dark:text-white/[0.03] -rotate-12" />
             <div className="flex flex-col gap-1 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-tight">Câmbio <span className="text-primary italic text-[11px]">Mercado Global</span></h3>
                <span className="text-[8px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Sincronizado: Frankfurt (Live)</span>
             </div>
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">🇺🇸</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">USD/AOA</span>
                   </div>
                   <span className="text-sm font-black text-primary">{kwanzaToUsd > 0 ? (1/kwanzaToUsd).toFixed(2) : '-'} <span className="text-[10px] text-slate-400 dark:text-white/40">Kz</span></span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">🇪🇺</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">EUR/AOA</span>
                   </div>
                   <span className="text-sm font-black text-primary">{kwanzaToEur > 0 ? (1/kwanzaToEur).toFixed(2) : '-'} <span className="text-[10px] text-slate-400 dark:text-white/40">Kz</span></span>
                </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#192633] rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
            <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-tight mb-5">O que deseja fazer?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate(APP_ROUTES.CONVERSAO)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <Repeat className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-[10px] font-bold uppercase tracking-tight">Calculadora</span>
              </button>
              <button 
                onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <Users className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-[10px] font-bold uppercase tracking-tight">Trocas P2P</span>
              </button>
              <button 
                onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group col-span-2"
              >
                <PlusCircle className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-xs font-bold uppercase tracking-tight">Publicar Oferta</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-[#192633] rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-tight">A sua Atividade Recente</h2>
          <button 
            onClick={() => navigate(APP_ROUTES.HISTORICO)}
            className="text-primary font-bold text-sm hover:underline uppercase tracking-widest"
          >
            Ver Tudo
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentTransactions && recentTransactions.length > 0 ? (
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-slate-50 dark:border-white/10">
                <tr>
                  <th className="p-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
                  <th className="p-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Valor</th>
                  <th className="p-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Data</th>
                  <th className="p-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/10">
                {recentTransactions.slice(0, 5).map((tx, idx) => {
                  const isSeller = tx.seller?.id === user?.id;
                  const counterparty = isSeller ? tx.buyer : tx.seller;
                  return (
                    <tr key={idx} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="size-8 rounded-lg border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden bg-slate-50 dark:bg-white/5">
                              <AvatarImage src={getAvatarUrl(counterparty?.avatar, counterparty?.full_name)} />
                              <AvatarFallback className="rounded-lg">
                                <UserIcon className="size-3.5 text-slate-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-[#192633] flex items-center justify-center shadow-sm ${isSeller ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                               {isSeller ? <ArrowUpRight className="size-2" /> : <ArrowDownLeft className="size-2" />}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">{isSeller ? 'Envio P2P' : 'Recebimento P2P'}</span>
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">{counterparty?.full_name || 'Utilizador'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-sm font-bold ${isSeller ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {isSeller ? '-' : '+'} {tx.give_amount.toLocaleString()} {tx.give_currency.code}
                        </span>
                      </td>
                      <td className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {format(new Date(tx.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="h-24 flex items-center justify-center">
              <p className="text-xs font-black uppercase tracking-widest text-slate-300">Nenhuma transação recente</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
