import React from 'react';
import { motion } from 'framer-motion';

const HistoricoTransacoesPage: React.FC = () => {
  const transactions = [
    { 
      id: '#TRX-882910', 
      type: 'Troca P2P', 
      date: '12 Out 2023, 14:30', 
      currency: 'USDT → AOA', 
      amount: '+ 450.000,00 AOA', 
      status: 'Concluído', 
      icon: 'swap_horiz', 
      statusColor: 'text-emerald-500', 
      bgColor: 'bg-primary/10' 
    },
    { 
      id: '#DEP-992100', 
      type: 'Depósito Bancário', 
      date: '12 Out 2023, 10:15', 
      currency: 'AOA', 
      amount: '+ 100.000,00 AOA', 
      status: 'Pendente', 
      icon: 'account_balance_wallet', 
      statusColor: 'text-yellow-500', 
      bgColor: 'bg-status-blue/10' 
    },
    { 
      id: '#WIT-332112', 
      type: 'Retirada para Conta', 
      date: '10 Out 2023, 09:45', 
      currency: 'USD', 
      amount: '- $ 500.00', 
      status: 'Concluído', 
      icon: 'arrow_upward', 
      statusColor: 'text-emerald-500', 
      bgColor: 'bg-gray-200 dark:bg-white/10' 
    },
    { 
      id: '#CNV-554123', 
      type: 'Conversão de Moeda', 
      date: '08 Out 2023, 16:20', 
      currency: 'AOA → EUR', 
      amount: '- 250.000,00 AOA', 
      status: 'Concluído', 
      icon: 'currency_exchange', 
      statusColor: 'text-emerald-500', 
      bgColor: 'bg-primary/10' 
    },
    { 
      id: '#SND-110293', 
      type: 'Envio Cancelado', 
      date: '05 Out 2023, 11:10', 
      currency: 'AOA', 
      amount: '- 50.000,00 AOA', 
      status: 'Cancelado', 
      icon: 'block', 
      statusColor: 'text-rose-500', 
      bgColor: 'bg-status-red/10',
      cancelled: true 
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 py-8 px-4 md:px-10 lg:px-20 xl:px-40 max-w-[1400px] mx-auto w-full pb-32 lg:pb-10 font-display">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black tracking-tighter">Histórico de Transações</h1>
        <p className="text-gray-500 dark:text-[#92adc9] text-base font-medium">Acompanhe detalhadamente todas as suas atividades financeiras na plataforma.</p>
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
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Moeda</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Valor</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center size-10 rounded-xl ${tx.bgColor} ${tx.statusColor.replace('text-', 'text-')} shadow-sm group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-gray-900 dark:text-white leading-tight">{tx.type}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{tx.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded">
                      {tx.id}
                    </span>
                  </td>
                  <td className="p-6 text-gray-900 dark:text-white font-black text-sm">{tx.currency}</td>
                  <td className="p-6">
                    <span className={`text-sm font-black ${tx.cancelled ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {tx.amount}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tx.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' :
                      tx.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-rose-500/10 text-rose-500'
                    } border border-current/20`}>
                      <span className={`size-1.5 rounded-full bg-current ${tx.status === 'Pendente' ? 'animate-pulse' : ''}`}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mostrando 1-5 de 24 transações</span>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-xl border border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50 cursor-not-allowed">Anterior</button>
            <button className="px-5 py-2 rounded-xl border border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95">Próximo</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HistoricoTransacoesPage;
