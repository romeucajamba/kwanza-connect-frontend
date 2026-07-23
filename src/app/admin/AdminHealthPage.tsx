import React from 'react';
import { useSystemHealth } from '@/services/admin.hooks';
import { motion } from 'framer-motion';
import { Database, Activity, Server, AlertTriangle } from 'lucide-react';

const ProgressRing = ({ percent, color, label, valueLabel }: { percent: number, color: string, label: string, valueLabel: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#111922] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="relative flex items-center justify-center w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-slate-100 dark:text-white/5"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-slate-900 dark:text-white">{percent.toFixed(1)}%</span>
        </div>
      </div>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
      <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{valueLabel}</p>
    </div>
  );
};

const ServiceStatus = ({ name, status, icon: Icon }: { name: string, status: string, icon: any }) => {
  const isOk = status === 'ok';
  
  return (
    <div className="flex items-center p-4 bg-white dark:bg-[#111922] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
      <div className={`p-3 rounded-xl mr-4 ${isOk ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        <Icon className="size-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{name}</h3>
        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isOk ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isOk ? 'Operacional' : 'Falha Crítica'}
        </p>
      </div>
      <div className="flex items-center justify-center">
        {isOk ? (
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-3 bg-emerald-500"></span>
          </span>
        ) : (
          <AlertTriangle className="size-5 text-rose-500 animate-pulse" />
        )}
      </div>
    </div>
  );
};

const AdminHealthPage: React.FC = () => {
  const { data, isLoading, isError } = useSystemHealth();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-rose-500">
        <AlertTriangle className="size-10 mb-4" />
        <h2 className="text-xl font-black uppercase">Erro de Conexão</h2>
        <p className="text-sm font-bold opacity-80 mt-2">Não foi possível carregar os dados de saúde do sistema.</p>
      </div>
    );
  }

  const { services, resources } = data;

  const getHealthColor = (percent: number) => {
    if (percent < 60) return 'text-emerald-500';
    if (percent < 85) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="size-6 text-primary" />
            Saúde do Sistema
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Monitorização em tempo real de serviços e recursos
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary">
           <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest">Tempo Real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ServiceStatus name="Base de Dados" status={services.database} icon={Database} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ServiceStatus name="Cache Redis" status={services.redis} icon={Server} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ServiceStatus name="Workers Celery" status={services.celery} icon={Activity} />
        </motion.div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Uso de Recursos (Servidor)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <ProgressRing 
              percent={resources.cpu_percent} 
              color={getHealthColor(resources.cpu_percent)} 
              label="Processador (CPU)" 
              valueLabel={`${resources.cpu_percent}% Usado`} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <ProgressRing 
              percent={resources.ram_percent} 
              color={getHealthColor(resources.ram_percent)} 
              label="Memória RAM" 
              valueLabel={`${resources.ram_used_gb}GB / ${resources.ram_total_gb}GB`} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <ProgressRing 
              percent={resources.disk_percent} 
              color={getHealthColor(resources.disk_percent)} 
              label="Armazenamento (Disco)" 
              valueLabel={`${resources.disk_used_gb}GB / ${resources.disk_total_gb}GB`} 
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminHealthPage;
