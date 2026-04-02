import React from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';

const PerfilPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Profile Header Card Compacto */}
      <div className="relative bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-50 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-center md:items-start grow">
            <div className="relative mb-3">
               <div 
                  className="size-16 sm:size-20 rounded-2xl bg-center bg-cover border-4 border-slate-50 dark:border-[#111922] shadow-lg group-hover:scale-105 transition-transform" 
                  style={{ backgroundImage: `url(${user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.id})` }}
               />
               <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-lg border-2 border-white dark:border-[#192633] flex items-center justify-center text-white shadow-md">
                  <CheckCircle2 className="size-3" />
               </div>
            </div>
            
            <div className="text-center md:text-left">
               <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{user?.full_name}</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user?.email}</span>
                  <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
                     <Award className="size-3 text-primary" />
                     <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Utilizador Elite P2P</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <button 
              onClick={() => navigate('/settings')}
              className="px-6 h-10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-slate-100 transition-all shadow-sm flex items-center justify-center gap-2"
            >
               <Settings className="size-3.5" />
               <span>Definições</span>
            </button>
            <button className="flex-1 md:flex-none px-6 h-10 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
               <Zap className="size-3.5" />
               <span>Upgrade VIP</span>
            </button>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         <div className="lg:col-span-8 flex flex-col gap-6">
            {/* High-Level Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { label: 'Trocas', value: '142', icon: Activity, color: 'text-primary' },
                 { label: 'Volume', value: 'Kz 5.2M', icon: TrendingUp, color: 'text-emerald-500' },
                 { label: 'Reputação', value: '9.8', icon: Star, color: 'text-amber-500' },
                 { label: 'Visto por', value: 'V.I.P', icon: Award, color: 'text-indigo-500' },
               ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-[#192633] p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm group">
                     <div className={`size-7 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-primary/5 transition-colors mb-2 ${stat.color}`}>
                        <stat.icon className="size-3.5" />
                     </div>
                     <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</p>
                     <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
               ))}
            </div>

            {/* Account Details */}
            <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-5 md:p-6 flex flex-col gap-6 relative overflow-hidden">
               <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-lg">
                     <ShieldCheck className="size-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Verificação de Identidade</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     {[
                       { label: 'Canais Activos', value: 'Express, BNI, BAI', badge: 'Active' },
                       { label: 'Contacto Directo', value: '+244 9XX XX XX XX', badge: 'Linked' },
                       { label: 'Antiguidade', value: 'Desde 15 Jan, 2026', badge: null }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1.5 p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-transparent shadow-inner">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.value}</p>
                              {item.badge && <span className="text-[7px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase shadow-sm">OK</span>}
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-center items-center text-center gap-3 relative group overflow-hidden">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                     <div className="size-12 rounded-xl bg-white text-slate-900 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                        <Award className="size-6" />
                     </div>
                     <p className="text-xs font-bold uppercase tracking-tight relative z-10">Performance de Negociação</p>
                     <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest relative z-10 leading-relaxed max-w-[200px]">Top 5% dos negociadores em volume de câmbio Kwanza.</p>
                     <button className="w-full h-10 bg-primary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest relative z-10 active:scale-95 transition-all">Relatório P2P</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Activity */}
         <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md p-5 flex flex-col min-h-[380px]">
               <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Ganhos em Rede</h3>
                  <button className="text-[8px] font-bold text-primary uppercase tracking-widest hover:underline">Ver Tabela</button>
               </div>
               <div className="space-y-5 flex-1 pr-1">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="flex items-center gap-3 group cursor-default">
                        <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all shadow-inner">
                           <ArrowRight className="size-3.5 rotate-[-45deg]" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight">Membro Premium #{i}</p>
                           <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-widest opacity-60">Hoje • 12:30</p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-500">+1.500 <span className="opacity-40 ml-0.5 font-medium">KZ</span></span>
                     </div>
                  ))}
               </div>
               <div className="mt-8 p-5 bg-slate-50 dark:bg-[#111922] rounded-xl flex flex-col items-center gap-3 border border-transparent shadow-inner">
                  <div className="flex -space-x-1.5 opacity-60">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="size-7 rounded-full border-2 border-white dark:border-[#111922] bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-sm" />
                     ))}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center opacity-80">Convide outros para expandir sua rede de activos.</p>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default PerfilPage;
