import React from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '@services/transactions.hooks';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { Transaction } from '../types';

const HistoricoTransacoesPage: React.FC = () => {
  const { data: transactions, isLoading } = useTransactions();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { label: 'Concluído', class: 'bg-emerald-500/10 text-emerald-500', dot: 'bg-emerald-500' };
      case 'pending':
        return { label: 'Pendente', class: 'bg-yellow-500/10 text-yellow-500', dot: 'bg-yellow-500 animate-pulse' };
      case 'cancelled':
        return { label: 'Cancelado', class: 'bg-rose-500/10 text-rose-500', dot: 'bg-rose-500' };
      case 'disputed':
        return { label: 'Em Disputa', class: 'bg-orange-500/10 text-orange-500', dot: 'bg-orange-500' };
      default:
        return { label: status, class: 'bg-gray-500/10 text-gray-500', dot: 'bg-gray-500' };
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'p2p': return 'swap_horiz';
      case 'deposit': return 'account_balance_wallet';
      case 'withdrawal': return 'arrow_upward';
      case 'conversion': return 'currency_exchange';
      default: return 'payments';
    }
  };

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

  return (
    <div className="flex-1 flex flex-col gap-6 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display transition-colors">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black tracking-tighter uppercase">Histórico de Transações</h1>
        <p className="text-gray-500 dark:text-[#92adc9] text-sm font-medium">Acompanhe detalhadamente todas as suas atividades financeiras na plataforma.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 p-5 bg-white dark:bg-[#192633] rounded-2xl border border-gray-100 dark:border-white/5 items-start lg:items-center justify-between shadow-sm">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            className="w-full h-12 rounded-xl bg-gray-50 dark:bg-[#101922] border-none pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none" 
            placeholder="Buscar por ID, moeda ou valor..." 
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {['Todos os Tipos', 'Últimos 30 dias', 'Todas as Moedas'].map((label, idx) => (
            <div key={idx} className="relative min-w-[140px] flex-1 lg:flex-none">
              <select className="w-full h-12 rounded-xl bg-gray-50 dark:bg-[#101922] border-none text-sm font-black text-gray-700 dark:text-[#92adc9] px-4 cursor-pointer focus:ring-2 focus:ring-primary/50 outline-none appearance-none">
                <option>{label}</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_content</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#192633] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a2632] border-b border-gray-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Transação</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID Transação</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Moeda/Par</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Valor</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {transactions?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-bold">Nenhuma transação encontrada.</td>
                </tr>
              )}
              {transactions?.map((tx: Transaction) => {
                const status = getStatusConfig(tx.status);
                return (
                  <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-[20px]">{getIcon('p2p')}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Transação P2P</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {format(new Date(tx.created_at), "dd MMM yyyy, HH:mm", { locale: pt })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded">
                        #{tx.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-gray-900 dark:text-white font-black text-sm uppercase tracking-wider">
                      {tx.give_currency.code} / {tx.want_currency.code}
                    </td>
                    <td className="p-6">
                      <span className={`text-sm font-black ${tx.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {tx.give_amount.toLocaleString('pt-AO')} {tx.give_currency.code}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.class} border border-current/20`}>
                        <span className={`size-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Mostrando {transactions?.length || 0} de {transactions?.length || 0} transações
          </span>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-xl border border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50 cursor-not-allowed">Anterior</button>
            <button className="px-5 py-3 rounded-xl border border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95 disabled:opacity-50" disabled>Próximo</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HistoricoTransacoesPage;
