import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ChevronRight, 
  Download
} from 'lucide-react';
import { useTransactions } from '@services/transactions.hooks';
import { useAuthStore } from '@store/authStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HistoricoTransacoesPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = (transactions as any[])?.filter(tx => {
    const matchesSearch = tx.give_currency.code.toLowerCase().includes(search.toLowerCase()) ||
                         tx.want_currency.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || tx.status === statusFilter;
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
      
      {/* Header Section Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Atividade <span className="text-primary italic">P2P</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Monitorização de trocas e fluxos de activos.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold uppercase text-[9px] tracking-widest px-6 h-10 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
          <Download className="size-3.5" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#111922] p-1 rounded-lg w-full xl:w-auto">
            {['all', 'completed', 'pending', 'cancelled'].map((f) => (
              <button 
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex-1 xl:flex-none px-4 py-1.5 text-[9px] font-bold uppercase rounded-md transition-all ${statusFilter === f ? 'bg-white dark:bg-[#192633] text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f === 'all' ? 'Tudo' : f === 'completed' ? 'Sucesso' : f === 'pending' ? 'Espera' : 'Falha'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-64 group">
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
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/20 dark:bg-[#111922]/20 border-b border-slate-100 dark:border-white/5 opacity-50">
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tipo / Data</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Enviado</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Recebido</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                <th className="p-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right text-transparent">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredTransactions?.map((tx: any) => {
                   const isSeller = tx.seller.id === user?.id;
                   return (
                    <motion.tr 
                      key={tx.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-default"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-9 rounded-lg flex items-center justify-center shadow-inner ${isSeller ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {isSeller ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase leading-none">{isSeller ? 'Venda P2P' : 'Compra P2P'}</p>
                            <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-widest opacity-60">{format(new Date(tx.created_at), "dd MMM, HH:mm", { locale: ptBR })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{(tx.give_amount).toLocaleString()} <span className="text-[9px] text-slate-300 uppercase ml-1 opacity-50">{tx.give_currency.code}</span></p>
                      </td>
                      <td className="p-4 text-right font-mono">
                        <p className={`text-xs font-bold ${isSeller ? 'text-slate-400 opacity-60' : 'text-emerald-500'}`}>{(tx.want_amount).toLocaleString()} <span className={`text-[9px] uppercase ml-1 opacity-50 ${isSeller ? 'text-slate-300' : 'text-emerald-500/60'}`}>{tx.want_currency.code}</span></p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                          tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                          tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-200 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                          <ChevronRight className="size-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                   );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-50 dark:divide-white/5">
          {filteredTransactions?.map((tx: any) => {
             const isSeller = tx.seller.id === user?.id;
             return (
               <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors active:scale-[0.98]">
                <div className="flex items-center gap-3 min-w-0">
                   <div className={`size-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-inner ${isSeller ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {isSeller ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                   </div>
                   <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase truncate">{isSeller ? 'Venda P2P' : 'Compra P2P'}</p>
                      <p className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest opacity-60">
                        {format(new Date(tx.created_at), "dd/MM/yyyy HH:mm")}
                      </p>
                   </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${isSeller ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isSeller ? '-' : '+'} {tx.give_amount.toLocaleString()} <span className="text-[8px] opacity-50">{tx.give_currency.code}</span>
                  </p>
                  <span className={`text-[7px] font-bold uppercase mt-1 block opacity-60 ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</span>
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {/* Summary Banner Compacto */}
      <div className="p-6 bg-slate-900 dark:bg-black rounded-xl text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full opacity-50 pointer-events-none" />
        <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-600 flex items-center justify-center shadow-xl flex-shrink-0">
          <History className="size-6 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-bold uppercase tracking-tight mb-1">Actividade de Fluxo <span className="text-primary italic">Livre</span></h2>
          <p className="text-[9px] font-medium text-white/40 leading-relaxed uppercase tracking-widest max-w-lg mx-auto sm:mx-0">Monitorizamos cada transação para garantir que os volumes apresentados coincidem com os activos reais.</p>
        </div>
        <button className="w-full sm:w-auto px-6 h-10 bg-white text-slate-900 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-md">Nova Troca</button>
      </div>
    </div>
  );
};

export default HistoricoTransacoesPage;
