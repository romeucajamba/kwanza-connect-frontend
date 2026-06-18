import React from 'react';
import { Activity, Coins, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAdminCurrencies, useAdminSeedCurrencies } from '@/services/admin.hooks';

const AdminCurrenciesPage: React.FC = () => {
  const { data: currencies, isLoading, isFetching, refetch } = useAdminCurrencies();
  const { mutate: seedCurrencies, isPending } = useAdminSeedCurrencies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight"><span>Moedas do Sistema</span></h1>
          <p className="text-slate-400 text-sm mt-1"><span>Gerir as moedas disponíveis para ofertas na plataforma.</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin text-primary' : 'text-slate-400'}`} />
            <span>Atualizar</span>
          </button>
          
          <button 
            onClick={() => seedCurrencies()}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <>
                <Activity className="size-4 animate-spin" />
                <span>A inserir...</span>
              </>
            ) : (
              <>
                <Coins className="size-4" />
                <span>Inserir / Atualizar Padrão</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#111922] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 w-16 text-center"><span>Ordem</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Bandeira</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Código</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Nome</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Símbolo</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 text-center"><span>Ativa</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Activity className="size-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Carregando moedas...</span>
                  </td>
                </tr>
              ) : !currencies || currencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Coins className="size-6 mx-auto mb-2 opacity-50" />
                    <span>Nenhuma moeda encontrada. Clica em "Inserir Padrão".</span>
                  </td>
                </tr>
              ) : (
                currencies.map((currency: any) => (
                  <tr key={currency.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-slate-500">{currency.sort_order}</span>
                    </td>
                    <td className="p-4 text-2xl">
                      {currency.flag_emoji}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-white">{currency.code}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-300">{currency.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center size-8 rounded-full bg-white/5 text-xs font-bold text-slate-300 border border-white/10">
                        {currency.symbol}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {currency.is_active ? (
                        <CheckCircle className="size-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="size-5 text-rose-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCurrenciesPage;
