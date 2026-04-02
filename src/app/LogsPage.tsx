import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Terminal, 
  Activity, 
  ChevronDown, 
  Search, 
  X, 
  Download,
  HelpCircle,
  FileJson
} from 'lucide-react';
import { useAuditLogs } from '../services/audit.hooks';
import { formatTimestamp, severityBg, severityColor, roleLabel, cn } from '../lib/utils';
import type { LogSeverity } from '../types';

// ─── Severity dot ─────────────────────────────────────────────────────────────
const SeverityDot: React.FC<{ severity: LogSeverity }> = ({ severity }) => (
  <div className="flex h-7 w-7 items-center justify-center shrink-0">
    <motion.div
      className="size-3 rounded-full"
      style={{ backgroundColor: severityColor[severity] }}
      animate={severity === 'critical' ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

// ─── Log row ──────────────────────────────────────────────────────────────────
const LogRow: React.FC<{ entry: any; index: number }> = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(false);

  const getIcon = (action: string) => {
    if (action.includes('login')) return <Shield className="size-4" />;
    if (action.includes('offer')) return <Activity className="size-4" />;
    return <Terminal className="size-4" />;
  };

        {/* Content */}
        <div className="flex flex-1 flex-col min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 text-left">
            {entry.action}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(entry.timestamp)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {roleLabel[entry.actorRole]} · ID: {entry.actorId}
            </p>
          </div>
        </div>

        {/* Dot + chevron */}
        <div className="flex items-center gap-1 shrink-0">
          <SeverityDot severity={entry.severity} />
          <motion.span
            className="material-symbols-outlined text-gray-400"
            style={{ fontSize: 16 }}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            expand_more
          </motion.span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[68px] flex flex-wrap gap-3">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs space-y-1.5 flex-1 min-w-[200px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Ator</span>
                  <span className="font-medium text-gray-900 dark:text-white">{entry.actorName}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Função</span>
                  <span className="font-medium text-gray-900 dark:text-white">{roleLabel[entry.actorRole]}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">ID</span>
                  <span className="font-mono text-gray-900 dark:text-white">{entry.actorId}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Timestamp</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {new Date(entry.timestamp).toISOString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Severidade</span>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      severityBg[entry.severity]
                    )}
                  >
                    {entry.severity}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Filter chip ──────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  active?: boolean;
  icon?: string;
  onClick: () => void;
  dropdown?: { label: string; value: string }[];
  value?: string;
  onSelect?: (v: string) => void;
}
const FilterChip: React.FC<ChipProps> = ({ label, active, icon, onClick, dropdown, value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = dropdown?.find((d) => d.value === value)?.label ?? label;

  if (dropdown) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-medium border transition-all duration-200',
            open
              ? 'bg-primary/10 border-primary/30 text-primary dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          <span>{selectedLabel}</span>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_drop_down</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute top-full mt-1 left-0 z-50 min-w-[140px] rounded-xl bg-white dark:bg-[#1e2530] border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
            >
              {dropdown.map((item) => (
                <button
                  key={item.value}
                  onClick={() => { onSelect?.(item.value); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center px-4 py-2.5 text-sm transition-colors',
                    value === item.value
                      ? 'bg-primary/10 text-primary dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-xl pl-3 pr-2 text-sm font-medium border transition-all duration-200',
        active
          ? 'bg-primary/10 border-primary/30 text-primary dark:text-blue-400'
          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
type DateFilter = 'today' | 'week' | 'month' | 'all';
type SeverityFilter = LogSeverity | 'all';

const LogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = useMemo(() => {
    const now = new Date();
    return mockLogs.filter((log) => {
      // search
      if (search && !log.action.toLowerCase().includes(search.toLowerCase()) &&
        !log.actorName.toLowerCase().includes(search.toLowerCase())) return false;
      // date
      if (dateFilter !== 'all') {
        const logDate = new Date(log.timestamp);
        const diff = now.getTime() - logDate.getTime();
        if (dateFilter === 'today' && diff > 24 * 60 * 60 * 1000) return false;
        if (dateFilter === 'week' && diff > 7 * 24 * 60 * 60 * 1000) return false;
        if (dateFilter === 'month' && diff > 30 * 24 * 60 * 60 * 1000) return false;
      }
      // severity
      if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
      return true;
    });
  }, [search, dateFilter, severityFilter]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const csv = ['id,action,actorName,actorRole,severity,timestamp',
      ...filteredLogs.map((l) =>
        `${l.id},"${l.action}",${l.actorName},${l.actorRole},${l.severity},${l.timestamp}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'logs_auditoria.csv'; a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
    toast.success('Logs exportados com sucesso!');
  }, [filteredLogs]);

  const criticalCount = filteredLogs.filter((l) => l.severity === 'critical').length;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-display tracking-tight">
            Logs de Actividade e Auditoria
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {filteredLogs.length} registos encontrados
            {criticalCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>warning</span>
                {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => toast('Ajuda em breve!', { icon: '📖' })}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          aria-label="Ajuda"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>help_outline</span>
        </button>
      </motion.header>

      <main className="flex-1 flex flex-col">
        {/* Search */}
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
            <span className="material-symbols-outlined pl-3 text-gray-400" style={{ fontSize: 20 }}>search</span>
            <input
              className="flex-1 h-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none px-2"
              placeholder="Procurar por nome, ação..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  className="pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 sm:px-6 pb-3 overflow-x-auto scrollbar-hide">
          <FilterChip
            label="Data"
            icon=""
            onClick={() => {}}
            dropdown={[
              { label: 'Hoje', value: 'today' },
              { label: 'Esta semana', value: 'week' },
              { label: 'Este mês', value: 'month' },
              { label: 'Todos', value: 'all' },
            ]}
            value={dateFilter}
            onSelect={(v) => setDateFilter(v as DateFilter)}
          />
          <FilterChip
            label="Severidade"
            onClick={() => {}}
            dropdown={[
              { label: 'Todas', value: 'all' },
              { label: '🔴 Crítico', value: 'critical' },
              { label: '🟠 Aviso', value: 'warning' },
              { label: '🔵 Sistema', value: 'system' },
              { label: '🟢 Info', value: 'info' },
            ]}
            value={severityFilter}
            onSelect={(v) => setSeverityFilter(v as SeverityFilter)}
          />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 px-4 sm:px-6 mb-3">
          {(['critical', 'warning', 'system', 'info'] as LogSeverity[]).map((sev) => {
            const count = mockLogs.filter((l) => l.severity === sev).length;
            const labels: Record<LogSeverity, string> = { critical: 'Crítico', warning: 'Aviso', system: 'Sistema', info: 'Info' };
            return (
              <motion.button
                key={sev}
                onClick={() => setSeverityFilter(severityFilter === sev ? 'all' : sev)}
                className={cn(
                  'rounded-xl p-2.5 text-center border transition-all duration-200',
                  severityFilter === sev
                    ? 'border-current opacity-100'
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 opacity-70 hover:opacity-100',
                  severityBg[sev]
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-lg font-bold font-display">{count}</p>
                <p className="text-xs">{labels[sev]}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Log list */}
        <div className="card mx-4 sm:mx-6 mb-4 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filteredLogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 dark:text-gray-500"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>search_off</span>
                <p className="text-sm font-medium">Nenhum log encontrado</p>
                <p className="text-xs">Tente ajustar os filtros ou a pesquisa</p>
              </motion.div>
            ) : (
              filteredLogs.map((entry, i) => (
                <LogRow key={entry.id} entry={entry} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FAB – Export */}
      <motion.button
        onClick={handleExport}
        disabled={isExporting}
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-20 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-70"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        aria-label="Exportar logs"
      >
        <AnimatePresence mode="wait">
          {isExporting ? (
            <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </motion.span>
          ) : (
            <motion.span key="dl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>download</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default LogsPage;
