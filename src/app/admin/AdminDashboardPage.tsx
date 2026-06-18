import React, { useMemo } from 'react';
import { useAdminStats } from '@/services/admin.hooks';
import { useDashboardStats } from '@/services/rates.hooks';
import { Users, Activity, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const { data: adminStats, isLoading: loadingAdmin } = useAdminStats();
  const { data: marketStats, isLoading: loadingMarket } = useDashboardStats();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    const topCurrencies = marketStats?.top_currencies || [];
    return topCurrencies.map(c => ({
      name: c.code,
      Ofertas: c.count,
    }));
  }, [marketStats]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (loadingAdmin || loadingMarket) {
    return <div className="flex h-64 items-center justify-center"><span>Carregando...</span></div>;
  }

  const cards = [
    {
      title: 'Utilizadores Activos',
      value: adminStats?.users.active || 0,
      total: adminStats?.users.total || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'KYC Pendentes',
      value: adminStats?.users.pending_kyc || 0,
      total: adminStats?.users.total || 0,
      icon: ShieldAlert,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Ofertas Activas',
      value: adminStats?.offers.active || 0,
      total: adminStats?.offers.total || 0,
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Negócios Fechados',
      value: adminStats?.offers.closed || 0,
      total: adminStats?.offers.total || 0,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Dashboard Geral</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Resumo das atividades da plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`size-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{card.title}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-500">De um total de {card.total}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Market Stats Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Visão Global do Mercado</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="size-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-[#92adc9] uppercase tracking-widest">Traders Ativos</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {marketStats?.daily_active_traders || 0} <span className="text-sm font-medium text-slate-400">total</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Activity className="size-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-[#92adc9] uppercase tracking-widest">Ofertas no Mercado</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {marketStats?.active_offers || 0} <span className="text-sm font-medium text-slate-400">disponíveis</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <CheckCircle2 className="size-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-[#92adc9] uppercase tracking-widest">Negócios Fechados</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {marketStats?.successful_deals || 0} <span className="text-sm font-medium text-slate-400">total</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="flex flex-col rounded-2xl shadow-sm bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 p-6 h-[400px]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Moedas Mais Procuradas</h3>
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
                  Sem dados suficientes
                </div>
              )}
            </div>
          </div>

          {/* Currencies Scroll */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Moedas Disponíveis</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {marketStats?.available_currencies?.slice(0, 8).map((c: any) => (
                <div key={c.code} className="flex items-center gap-4 bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-colors">
                  <div className="text-3xl">{c.flag_emoji}</div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 dark:text-white leading-tight">{c.code}</span>
                    <span className="text-xs text-slate-500 dark:text-[#92adc9] line-clamp-1">{c.name}</span>
                  </div>
                </div>
              ))}
              {marketStats?.available_currencies?.length === 0 && (
                <div className="col-span-2 text-slate-400 text-sm py-4">Nenhuma moeda ativada.</div>
              )}
            </div>
            {marketStats?.available_currencies && marketStats.available_currencies.length > 8 && (
              <button className="text-sm font-bold text-primary mt-2 uppercase tracking-widest text-left" onClick={() => navigate('/admin/moedas')}>
                Ver Todas as Moedas →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
