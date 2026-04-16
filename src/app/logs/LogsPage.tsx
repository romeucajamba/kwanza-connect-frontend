import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  History, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  User, 
  Globe, 
  HardDrive,
  RefreshCcw,
  Eye
} from 'lucide-react';
import { useAuditLogs } from '@services/audit.hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: logs, isLoading, refetch, isRefetching } = useAuditLogs();

  const filteredLogs = logs?.filter((log: any) => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <Shield className="size-4 text-primary" />;
    if (action.includes('CREATE') || action.includes('POST')) return <CheckCircle2 className="size-4 text-emerald-500" />;
    if (action.includes('DELETE')) return <AlertTriangle className="size-4 text-rose-500" />;
    return <Info className="size-4 text-slate-400" />;
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-black leading-tight tracking-tight uppercase">
            Auditoria de <span className="text-primary italic">Segurança</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Monitorização em tempo real de todas as acções críticas do sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => refetch()}
             disabled={isLoading || isRefetching}
             className="h-9 px-4 bg-white dark:bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-widest rounded-lg hover:text-primary transition-all border border-slate-100 dark:border-white/5 flex items-center gap-2"
           >
              <RefreshCcw className={`size-3 ${isRefetching ? 'animate-spin' : ''}`} />
              Sincronizar
           </button>
           <button className="h-9 px-4 bg-primary text-white font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Download className="size-3.5" />
              Exportar CSV
           </button>
        </div>
      </div>

      {/* Filtros Compactos */}
      <div className="bg-white dark:bg-[#192633] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar por acção, recurso ou usuário..."
            className="w-full bg-slate-50 dark:bg-[#111922] border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 bg-slate-50 dark:bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-widest rounded-lg hover:text-primary transition-colors">
          <Filter className="size-3.5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Tabela de Logs Premium */}
      <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Tempo / Acção</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Recurso / ID</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Actor / IP</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <RefreshCcw className="size-8 mx-auto text-primary animate-spin opacity-20" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando Auditoria...</p>
                  </td>
                </tr>
              ) : filteredLogs?.map((log: any) => (
                <motion.tr 
                  key={log.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="size-9 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-white dark:group-hover:bg-[#111922] transition-colors">
                          {getActionIcon(log.action)}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[150px]">{log.action}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(log.timestamp), 'dd MMM, HH:mm:ss', { locale: ptBR })}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                       <HardDrive className="size-2.5 text-primary opacity-40" />
                       <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{log.resource}</p>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-60">REF: {log.resource_id || 'ID_SYSTEM'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                       <User className="size-3 text-slate-300" />
                       <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">{log.user_name || 'System Auto'}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                       <Globe className="size-2.5" />
                       <span className="text-[8px] font-bold text-slate-400">{log.ip_address || '0.0.0.0'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="size-8 rounded-lg text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-white/5 transition-all flex items-center justify-center ml-auto">
                       <Eye className="size-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredLogs?.length === 0 && (
           <div className="p-20 text-center">
              <History className="size-12 mx-auto text-slate-200 mb-4" />
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Nenhum registo encontrado</h3>
           </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 flex flex-col sm:flex-row items-center gap-6">
         <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Shield className="size-6 text-white" />
         </div>
         <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-tight mb-1">Integridade de Dados <span className="text-primary italic">Imutável</span></h3>
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest">
               Os logs de auditoria são assinados digitalmente e não podem ser removidos ou alterados, garantindo total transparência e conformidade regulatória.
            </p>
         </div>
      </div>
    </div>
  );
};

export default LogsPage;
