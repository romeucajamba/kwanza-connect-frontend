import React, { useState } from 'react';
import { useAdminUsers } from '@/services/admin.hooks';
import { Link } from 'react-router-dom';
import { Search, ShieldAlert, CheckCircle2, Ban, ChevronRight } from 'lucide-react';
import { Pagination } from '@components/ui/Pagination';

const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: usersData, isLoading } = useAdminUsers({
    search,
    status: statusFilter,
    kyc: kycFilter
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, kycFilter]);

  const totalPages = Math.ceil((usersData?.data?.length || 0) / itemsPerPage);
  const paginatedUsers = usersData?.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Utilizadores</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Gestão de contas e KYC</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
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
            <option value="active">Activos</option>
            <option value="blocked">Bloqueados</option>
          </select>
          <select 
            value={kycFilter} 
            onChange={(e) => setKycFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#111922] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">KYC (Todos)</option>
            <option value="pending">Pendente</option>
            <option value="submitted">Submetido</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nome / Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Telefone</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">KYC</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-slate-500"><span>Carregando utilizadores...</span></td>
                </tr>
              ) : usersData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-slate-500"><span>Nenhum utilizador encontrado.</span></td>
                </tr>
              ) : (
                paginatedUsers?.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {u.phone || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 className="size-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500">
                          <Ban className="size-3" /> Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.verification_status === 'approved' && <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Aprovado</span>}
                      {u.verification_status === 'pending' && <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pendente</span>}
                      {u.verification_status === 'submitted' && <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldAlert className="size-3" /> Submetido</span>}
                      {u.verification_status === 'rejected' && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Rejeitado</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/users/${u.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors"
                      >
                        <ChevronRight className="size-4" />
                      </Link>
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

export default AdminUsersPage;
