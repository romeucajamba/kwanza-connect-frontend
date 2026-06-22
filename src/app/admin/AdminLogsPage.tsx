import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, ShieldAlert, Clock, User, FileText, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/admin.service';
import { adminKeys } from '@/services/admin.hooks';
import { Pagination } from '@components/ui/Pagination';

const AdminLogsPage: React.FC = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: adminKeys.logs(page),
    queryFn: () => adminService.getAuditLogs(page),
  });

  const logs = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'update': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'delete': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'login': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'kyc_approve': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'kyc_reject': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return <Activity className="size-4" />;
      case 'delete': return <ShieldAlert className="size-4" />;
      case 'login': return <User className="size-4" />;
      default: return <FileText className="size-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight"><span>Logs de Auditoria</span></h1>
          <p className="text-slate-400 text-sm mt-1"><span>Acompanhe todas as atividades e alterações no sistema.</span></p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all"
        >
          <RefreshCw className={`size-4 ${isFetching ? 'animate-spin text-primary' : 'text-slate-400'}`} />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="bg-[#111922] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Ação</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Recurso</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>ID</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Utilizador ID</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>IP</span></th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500"><span>Data/Hora</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Activity className="size-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Carregando logs...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <ShieldAlert className="size-6 mx-auto mb-2 opacity-50" />
                    <span>Nenhum log encontrado.</span>
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        <span>{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-white">{log.resource}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-400">{log.resource_id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-400">{log.user_id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-400">{log.ip_address}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="size-3.5" />
                        <span className="text-sm">{new Date(log.created_at).toLocaleString('pt-PT')}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-white/5 px-4 bg-black/20">
             <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogsPage;
