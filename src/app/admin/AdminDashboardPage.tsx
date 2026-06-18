import React from 'react';
import { useAdminStats } from '@/services/admin.hooks';
import { Users, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Carregando...</div>;
  }

  const cards = [
    {
      title: 'Utilizadores Activos',
      value: stats?.users.active || 0,
      total: stats?.users.total || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'KYC Pendentes',
      value: stats?.users.pending_kyc || 0,
      total: stats?.users.total || 0,
      icon: ShieldAlert,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Ofertas Activas',
      value: stats?.offers.active || 0,
      total: stats?.offers.total || 0,
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Negócios Fechados',
      value: stats?.offers.closed || 0,
      total: stats?.offers.total || 0,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10'
    }
  ];

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AdminDashboardPage;
