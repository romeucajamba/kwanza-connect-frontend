import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  MoreVertical, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet,
  TrendingUp,
  Repeat,
  Send,
  Users,
  Trophy,
  Activity
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { APP_ROUTES } from '@constants';
import { useDashboardStats } from '@services/rates.hooks';
import { useTransactions } from '@services/transactions.hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentTransactions, isLoading: txLoading } = useTransactions();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  const quickActions = [
    { icon: Repeat, label: 'Trocar', path: APP_ROUTES.CONVERSAO, color: 'text-primary' },
    { icon: Send, label: 'Enviar', path: APP_ROUTES.P2P_BROWSE, color: 'text-indigo-500' },
    { icon: Users, label: 'P2P', path: APP_ROUTES.P2P_BROWSE, color: 'text-emerald-500' },
    { icon: Wallet, label: 'Carteira', path: '/wallets', color: 'text-amber-500' },
  ];

  if (statsLoading || txLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="size-10 border-4 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  const balances = stats?.rates.map(r => ({
    label: r.to_currency.name,
    value: `${r.rate.toLocaleString('pt-AO')} ${r.to_currency.code}`,
    flag: r.to_currency.flag_emoji || 'https://api.dicebear.com/7.x/initials/svg?seed=' + r.to_currency.code
  })) || [];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full pb-10"
    >
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Dashboard
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-[#192633] p-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
           <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-7 rounded-full border-2 border-white dark:border-[#101922] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
           <div className="flex flex-col px-1.5">
              <span className="text-[8px] font-black text-emerald-500 uppercase leading-none">{stats?.active_offers || 0} Ativas</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <motion.div variants={itemVariants} className="group relative overflow-hidden flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-primary border border-primary/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-[6rem] -mr-12 -mt-12 blur-xl" />
            <div className="flex w-full grow flex-col items-stretch justify-center gap-4 p-6 relative z-10 text-white">
              <div className="flex items-center gap-2 opacity-80">
                <Wallet className="size-3.5" />
                <p className="text-[9px] font-bold uppercase tracking-widest">Saldo Total Consolidado</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                    {(stats?.total_balance_aoa || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} <span className="text-sm opacity-70">AOA</span>
                  </p>
                  <div className="flex items-center gap-2 text-white/60 font-bold uppercase tracking-widest text-[8px]">
                    <TrendingUp className="size-3" />
                    ≈ {(stats?.total_balance_usd || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
                <button 
                  onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-6 bg-white text-primary text-[10px] font-bold rounded-lg shadow-md hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  <PlusCircle className="size-3.5" />
                  <span>Adicionar Fundos</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((balance, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="flex flex-col gap-4 p-5 rounded-xl bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="size-9 rounded-lg bg-slate-50 dark:bg-[#111922] flex items-center justify-center text-lg">
                    {balance.flag}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                    {balance.value}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-widest">{balance.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Action List */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
            <h2 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-5">Operações</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="group flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-primary/10 transition-all active:scale-95"
                >
                  <div className={`p-2 rounded-lg bg-white dark:bg-[#111922] shadow-sm ${action.color}`}>
                    <action.icon className="size-4" />
                  </div>
                  <span className="text-slate-900 dark:text-white text-[9px] font-bold uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Social Proof/Status */}
          <motion.div 
            variants={itemVariants}
            className="rounded-xl bg-slate-900 dark:bg-white/5 p-6 text-white overflow-hidden relative shadow-md"
          >
            <Trophy className="absolute -bottom-4 -right-4 size-24 text-white/5 rotate-12" />
            <h3 className="text-sm font-bold uppercase tracking-tight relative z-10">Convide Amigos</h3>
            <p className="text-[9px] text-white/50 mt-2 font-medium relative z-10">Bónus de indicação disponível.</p>
            <button className="mt-5 w-full py-2.5 bg-primary text-white text-[9px] font-bold rounded-lg uppercase tracking-widest relative z-10">
              Gerar Link
            </button>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
             <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Activity className="size-4" />
             </div>
             <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Atividade Recente</h2>
          </div>
          <button 
            onClick={() => navigate(APP_ROUTES.HISTORICO)}
            className="text-primary font-bold uppercase text-[9px] tracking-widest hover:underline"
          >
            Ver Tudo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-50 dark:border-white/5 opacity-50">
                <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Data</th>
                <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {(recentTransactions || []).slice(0, 5).map((tx, idx) => {
                const isSeller = tx.seller.id === user?.id;
                return (
                  <tr key={idx} className="group transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-lg flex items-center justify-center ${isSeller ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {isSeller ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{isSeller ? 'Venda' : 'Compra'}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[11px] font-bold ${tx.status === 'completed' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {tx.give_amount.toLocaleString()} {tx.give_currency.code}
                      </span>
                    </td>
                    <td className="py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                      {format(new Date(tx.created_at), "dd MMM HH:mm")}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`text-[8px] font-bold tracking-widest uppercase ${
                        tx.status === 'completed' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>

  );
};

export default DashboardPage;
