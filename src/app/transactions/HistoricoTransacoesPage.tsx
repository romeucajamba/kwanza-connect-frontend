import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Download,
  FileText,
  Star,
  CheckCircle2,
  X,
  ArrowRightLeft,
  ShieldCheck,
  MessageSquare,
  RefreshCcw
} from 'lucide-react';
import { useTransactions, useReviewTransaction } from '@services/transactions.hooks';
import { useAuthStore } from '@store/authStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '@/types';

const HistoricoTransacoesPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estados para Modais
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [reviewTxId, setReviewTxId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { mutate: submitReview, isPending: isSubmittingReview } = useReviewTransaction();

  const filteredTransactions = (transactions as Transaction[])?.filter(tx => {
    const matchesSearch = (tx.give_currency?.code || '').toLowerCase().includes(search.toLowerCase()) ||
                         (tx.want_currency?.code || '').toLowerCase().includes(search.toLowerCase()) ||
                         (tx.seller?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
                         (tx.buyer?.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleReview = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReviewTxId(id);
    setRating(0);
    setComment('');
  };

  const onSubmitReview = () => {
    if (!reviewTxId || rating === 0) return;
    submitReview({ id: reviewTxId, rating, comment }, {
      onSuccess: () => setReviewTxId(null)
    });
  };

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
          {filteredTransactions && filteredTransactions.length > 0 ? (
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
                  {filteredTransactions.map((tx: any) => {
                    const isSeller = tx.seller?.id === user?.id;
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
                               <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                                    {isSeller ? `Para: ${tx.buyer?.full_name || '---'}` : `De: ${tx.seller?.full_name || '---'}`}
                                  </span>
                                  <span className="text-slate-200 dark:text-white/10">•</span>
                                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                                    {format(new Date(tx.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                                  </p>
                               </div>
                             </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{Number(tx.give_amount || 0).toLocaleString()} <span className="text-[9px] text-slate-300 uppercase ml-1 opacity-50">{tx.give_currency?.code || '---'}</span></p>
                        </td>
                        <td className="p-4 text-right font-mono">
                          <p className={`text-xs font-bold ${isSeller ? 'text-slate-400 opacity-60' : 'text-emerald-500'}`}>{Number(tx.want_amount || 0).toLocaleString()} <span className={`text-[9px] uppercase ml-1 opacity-50 ${isSeller ? 'text-slate-300' : 'text-emerald-500/60'}`}>{tx.want_currency?.code || '---'}</span></p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                            tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                            tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {getStatusLabel(tx.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {tx.status === 'completed' && !tx.has_review && (
                               <button 
                                 onClick={(e) => handleReview(e, tx.id)}
                                 className="h-8 px-3 bg-amber-500/10 text-amber-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1.5"
                               >
                                 <Star className="size-3" />
                                 Avaliar
                               </button>
                            )}
                            <button 
                              onClick={() => setSelectedTx(tx)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary transition-all"
                            >
                              <FileText className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <History className="size-10 text-slate-100 dark:text-white/5 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-50 dark:divide-white/5">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx: any) => {
              const isSeller = tx.seller?.id === user?.id;
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
                     {isSeller ? '-' : '+'} {Number(tx.give_amount || 0).toLocaleString()} <span className="text-[8px] opacity-50">{tx.give_currency?.code || '---'}</span>
                   </p>
                   <span className={`text-[7px] font-bold uppercase mt-1 block opacity-60 ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{getStatusLabel(tx.status)}</span>
                 </div>
               </div>
              );
            })
          ) : (
            <div className="p-10 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Sem resultados</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Transação */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#192633] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              {/* Receipt Header */}
              <div className="p-6 bg-slate-900 dark:bg-black text-white relative">
                 <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all text-white/40 hover:text-white">
                    <X className="size-4" />
                 </button>
                 <div className="flex flex-col items-center text-center">
                    <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/20">
                       <ShieldCheck className="size-8" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Recibo de Transação</h3>
                    <p className="text-[8px] font-bold text-white/40 mt-1 uppercase tracking-[0.2em]">Hash ID: {selectedTx.id}</p>
                 </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Data e Hora</p>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white">{format(new Date(selectedTx.created_at), "dd 'de' MMMM, yyyy HH:mm", { locale: ptBR })}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Estado</p>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            selectedTx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {getStatusLabel(selectedTx.status)}
                          </span>
                       </div>
                    </div>
                    <div className="space-y-4 text-right">
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Tipo de Operação</p>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{selectedTx.seller?.id === user?.id ? 'Venda Directa' : 'Compra Directa'}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Ambiente</p>
                          <p className="text-[10px] font-bold text-primary uppercase">Escrow P2P</p>
                       </div>
                    </div>
                 </div>

                 <div className="h-px w-full bg-slate-100 dark:bg-white/5 my-2" />

                 <div className="bg-slate-50 dark:bg-[#111922] p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Vendeu</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                            {Number(selectedTx.give_amount || 0).toLocaleString()} <span className="opacity-40">{selectedTx.give_currency?.code || '---'}</span>
                          </span>
                       </div>
                       <ArrowRightLeft className="size-4 text-primary opacity-30" />
                       <div className="flex flex-col text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Recebeu</span>
                          <span className="text-sm font-black text-emerald-500 leading-none">
                            {Number(selectedTx.want_amount || 0).toLocaleString()} <span className="opacity-60">{selectedTx.want_currency?.code || '---'}</span>
                          </span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-white/5">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Taxa de Liquidação</span>
                       <span className="text-[10px] font-bold text-slate-900 dark:text-white">1 {selectedTx.give_currency?.code || '---'} = {Number(selectedTx.rate || 0).toFixed(4)} {selectedTx.want_currency?.code || '---'}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pt-4">
                    <button className="flex-1 h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                       <Download className="size-4" /> Exportar Recibo
                    </button>
                    <button 
                      onClick={() => setSelectedTx(null)}
                      className="px-6 h-11 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-700 transition-all font-sans"
                    >
                      Fechar
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Avaliação (Review) */}
      <AnimatePresence>
        {reviewTxId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#192633] w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              <div className="p-8">
                 <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 mx-auto">
                    <Star className="size-8 fill-amber-500" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center">Avaliar Parceiro</h3>
                 <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed text-center">
                    Como foi a sua experiência nesta troca? O seu feedback ajuda a manter a comunidade segura.
                 </p>

                 <div className="flex justify-center gap-2 my-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setRating(star)}
                        className="transition-all hover:scale-125"
                      >
                         <Star className={`size-8 ${rating >= star ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-white/10'}`} />
                      </button>
                    ))}
                 </div>

                 <div className="space-y-4">
                    <div className="relative">
                       <MessageSquare className="absolute top-3 left-3 size-4 text-slate-300" />
                       <textarea 
                          placeholder="Escreva um breve comentário (opcional)..."
                          className="w-full h-24 bg-slate-50 dark:bg-[#111922] border-none rounded-2xl pl-10 pr-4 py-3 text-[11px] font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300 resize-none"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                       />
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                          onClick={() => setReviewTxId(null)}
                          className="flex-1 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-all"
                       >
                          Cancelar
                       </button>
                       <button 
                          onClick={onSubmitReview}
                          disabled={rating === 0 || isSubmittingReview}
                          className="flex-[2] h-12 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                       >
                          {isSubmittingReview ? (
                             <RefreshCcw className="size-4 animate-spin" />
                          ) : (
                             <CheckCircle2 className="size-4" />
                          )}
                          Enviar Feedback
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoricoTransacoesPage;
