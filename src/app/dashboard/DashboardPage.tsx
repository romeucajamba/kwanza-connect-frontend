import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users,
  Send,
  Repeat,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { APP_ROUTES } from '@constants';
import { useDashboardStats, useExchangeRates } from '@services/rates.hooks';
import { useTransactions } from '@services/transactions.hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  const { data: rates } = useExchangeRates('AOA');
  const { data: recentTransactions } = useTransactions();

  // Calcular taxas reais do Kwanza
  const kwanzaToUsd = rates?.find(r => r.to_currency.code === 'USD')?.rate || 0;
  const kwanzaToEur = rates?.find(r => r.to_currency.code === 'EUR')?.rate || 0;

  // Saldos estimados (caso o backend retorne 0)
  const aoaBalance = stats?.total_balance_aoa || 0;
  const usdValue = stats?.total_balance_usd || (aoaBalance * kwanzaToUsd);
  const eurValue = aoaBalance * kwanzaToEur;

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
        <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Dashboard de Controlo
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Card de Saldo Total */}
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5">
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-8">
              <p className="text-slate-500 dark:text-[#92adc9] text-sm font-medium uppercase tracking-widest">Saldo Total Consolidado</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <p className="text-black dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  {(stats?.total_balance_aoa || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} <span className="text-2xl font-medium opacity-70">AOA</span>
                </p>
                <button 
                  onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                  className="flex min-w-[140px] items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95"
                >
                  Adicionar Fundos
                </button>
              </div>
            </div>
          </div>

          {/* Individual Wallets (Assets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Wallet AOA */}
            <div className="flex flex-col gap-4 text-center p-6 rounded-xl bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="px-10">
                <div className="w-full aspect-square bg-[#f6f7f8] dark:bg-[#111922] rounded-full flex items-center justify-center text-3xl shadow-inner">
                  🇦🇴
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-black dark:text-white text-lg font-bold">
                  {(stats?.total_balance_aoa || 0).toLocaleString('pt-AO')} AOA
                </p>
                <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-widest">Kwanza Angolano</p>
              </div>
            </div>

            {/* Wallet USD */}
            <div className="flex flex-col gap-4 text-center p-6 rounded-xl bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="px-10">
                <div className="w-full aspect-square bg-[#f6f7f8] dark:bg-[#111922] rounded-full flex items-center justify-center text-3xl shadow-inner">
                  🇺🇸
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-black dark:text-white text-lg font-bold">
                  {usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
                <div className="flex flex-col gap-0.5">
                   <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-widest">Dólar Americano</p>
                   {kwanzaToUsd > 0 && (
                      <p className="text-[9px] font-black text-primary uppercase tracking-tighter opacity-60">1 AOA ≈ ${kwanzaToUsd.toFixed(5)}</p>
                   )}
                </div>
              </div>
            </div>

            {/* Wallet EUR */}
            <div className={`flex flex-col gap-4 text-center p-6 rounded-xl bg-white dark:bg-[#192633] border border-slate-100 dark:border-white/5 shadow-sm ${eurValue === 0 ? 'opacity-50' : ''}`}>
               <div className="px-10">
                <div className="w-full aspect-square bg-[#f6f7f8] dark:bg-[#111922] rounded-full flex items-center justify-center text-3xl shadow-inner">
                  🇪🇺
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-black dark:text-white text-lg font-bold">
                   {eurValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR
                </p>
                <div className="flex flex-col gap-0.5">
                   <p className="text-slate-500 dark:text-[#92adc9] text-xs font-medium uppercase tracking-widest">Euro</p>
                   {kwanzaToEur > 0 && (
                      <p className="text-[9px] font-black text-primary uppercase tracking-tighter opacity-60">1 AOA ≈ €{kwanzaToEur.toFixed(5)}</p>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Market Rates Card */}
          <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4 shadow-xl border border-white/5 relative overflow-hidden">
             <TrendingUp className="absolute -bottom-4 -right-4 size-24 text-white/[0.03] -rotate-12" />
             <div className="flex flex-col gap-1 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-tight">Câmbio <span className="text-primary italic text-[11px]">Mercado Global</span></h3>
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Sincronizado: Frankfurt (Live)</span>
             </div>
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">🇺🇸</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">USD/AOA</span>
                   </div>
                   <span className="text-xs font-black text-primary">{kwanzaToUsd > 0 ? (1/kwanzaToUsd).toFixed(2) : '-'} <span className="text-[8px] text-white/40">Kz</span></span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">🇪🇺</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">EUR/AOA</span>
                   </div>
                   <span className="text-xs font-black text-primary">{kwanzaToEur > 0 ? (1/kwanzaToEur).toFixed(2) : '-'} <span className="text-[8px] text-white/40">Kz</span></span>
                </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
            <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-tight mb-5">O que deseja fazer?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate(APP_ROUTES.CONVERSAO)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <Repeat className="size-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-xs font-bold uppercase tracking-tight">Converter</span>
              </button>
              <button 
                onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <Send className="size-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-xs font-bold uppercase tracking-tight">Enviar</span>
              </button>
              <button 
                onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <PlusCircle className="size-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-xs font-bold uppercase tracking-tight">Receber</span>
              </button>
              <button 
                onClick={() => navigate(APP_ROUTES.P2P_BROWSE)}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-gray-800 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <Users className="size-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-black dark:text-white text-xs font-bold uppercase tracking-tight">Trocas P2P</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-[#192633] rounded-xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-tight">Atividade Recente</h2>
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
                  return (
                    <tr key={idx} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-lg flex items-center justify-center ${isSeller ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                             {isSeller ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{isSeller ? 'Envio' : 'Recebimento'}</span>
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
