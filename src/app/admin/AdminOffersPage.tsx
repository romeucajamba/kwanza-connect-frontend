import React, { useState } from 'react';
import { useAdminOffers, useAdminUpdateOfferStatus } from '@/services/admin.hooks';
import { Search, Ban, CheckCircle2, PauseCircle } from 'lucide-react';
import { Pagination } from '@components/ui/Pagination';

const AdminOffersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: offersData, isLoading } = useAdminOffers({
    search,
    status: statusFilter,
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.ceil((offersData?.data?.length || 0) / itemsPerPage);
  const paginatedOffers = offersData?.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { mutate: updateOfferStatus, isPending } = useAdminUpdateOfferStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Ofertas no Mercado</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Monitorização de ofertas P2P</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">Estado (Todos)</option>
            <option value="active">Ativas</option>
            <option value="paused">Pausadas</option>
            <option value="closed">Fechadas</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID Oferta</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Criador</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Montante Oferecido</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Montante Solicitado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações de Risco</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-500"><span>Carregando ofertas...</span></td>
                </tr>
              ) : offersData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-slate-500"><span>Nenhuma oferta encontrada.</span></td>
                </tr>
              ) : (
                paginatedOffers?.map((offer: any) => (
                  <tr key={offer.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                      {offer.id.split('-')[0]}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{offer.owner?.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{offer.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${offer.offer_type === 'sell' ? 'text-primary' : 'text-emerald-500'}`}>
                        {Number(offer.give_amount).toLocaleString('pt-AO')} {offer.give_currency?.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {Number(offer.want_amount).toLocaleString('pt-AO')} {offer.want_currency?.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {offer.status === 'active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="size-3" /> Activa</span>}
                      {offer.status === 'paused' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500"><PauseCircle className="size-3" /> Pausada</span>}
                      {offer.status === 'closed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/10 text-slate-500"><Ban className="size-3" /> Fechada</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {offer.status === 'active' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateOfferStatus({ offerId: offer.id, action: 'pause' })}
                            disabled={isPending}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                          >
                            Pausar
                          </button>
                          <button 
                            onClick={() => updateOfferStatus({ offerId: offer.id, action: 'close' })}
                            disabled={isPending}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                          >
                            Forçar Fecho
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
             <div className="border-t border-slate-100 dark:border-white/5 px-4 bg-white dark:bg-[#111922]">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOffersPage;
