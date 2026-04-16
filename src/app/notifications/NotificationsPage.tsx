import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  MoreVertical,
  Trash2
} from 'lucide-react';

const NotificationsPage: React.FC = () => {
  // Mock data for notifications until we have the full hook implementation
  const notifications = [
    { 
      id: 1, 
      type: 'trade', 
      title: 'Oferta Aceite!', 
      desc: 'João P2P aceitou a sua oferta de 1,000 USD via Multicaixa.', 
      time: 'Agora', 
      isRead: false,
      icon: Zap,
      color: 'text-primary'
    },
    { 
      id: 2, 
      type: 'security', 
      title: 'Acesso Detectado', 
      desc: 'Um novo login foi realizado a partir de um dispositivo Chrome (Luanda).', 
      time: 'Há 15 min', 
      isRead: true,
      icon: ShieldCheck,
      color: 'text-amber-500'
    },
    { 
      id: 3, 
      type: 'message', 
      title: 'Mensagem de Maria', 
      desc: 'Podemos fechar a negociação a 850 Kz/USD agora?', 
      time: 'Há 1 hora', 
      isRead: true,
      icon: MessageSquare,
      color: 'text-emerald-500'
    },
    { 
      id: 4, 
      type: 'system', 
      title: 'KYC Aprovado', 
      desc: 'Os seus documentos foram verificados! Já pode operar sem limites.', 
      time: 'Ontem', 
      isRead: true,
      icon: CheckCircle2,
      color: 'text-emerald-500'
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Centro de <span className="text-primary italic">Notificações</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Mantenha-se actualizado sobre as suas transações e segurança.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button className="h-9 px-4 bg-slate-50 dark:bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-widest rounded-lg hover:text-primary transition-colors border border-slate-100 dark:border-white/5">
              Marcar lidas
           </button>
           <button className="size-9 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-lg hover:bg-rose-500/20 transition-all">
              <Trash2 className="size-4" />
           </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
         {notifications.map((notif, i) => (
           <motion.div 
             key={notif.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className={`p-4 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group relative ${!notif.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
           >
              <div className={`size-10 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${notif.color}`}>
                 <notif.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                 <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-xs font-black uppercase tracking-tight ${!notif.isRead ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h3>
                    <div className="flex items-center gap-1.5 opacity-40">
                       <Clock className="size-2.5" />
                       <span className="text-[8px] font-black uppercase tracking-widest">{notif.time}</span>
                    </div>
                 </div>
                 <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                    {notif.desc}
                 </p>
              </div>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-slate-300 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                 <MoreVertical className="size-4" />
              </button>
           </motion.div>
         ))}

         {notifications.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
               <Bell className="size-16 mb-4" />
               <h3 className="text-sm font-black uppercase tracking-tight">Sem notificações</h3>
               <p className="text-[9px] font-bold uppercase tracking-widest">Aguarde por novas actualizações de sistema.</p>
            </div>
         )}
      </div>

      <div className="mt-10 p-6 bg-slate-900 rounded-xl text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center gap-6">
          <ShieldCheck className="absolute -bottom-6 -right-6 size-32 text-white/[0.03] -rotate-12 pointer-events-none" />
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
             <Bell className="size-6 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
             <h2 className="text-lg font-black uppercase tracking-tight mb-1">Proteção e <span className="text-primary italic">Auditoria</span></h2>
             <p className="text-[9px] font-bold text-white/40 leading-relaxed max-w-lg uppercase tracking-widest">
                Todas as acções críticas geram uma notificação de segurança instantânea no seu painel.
             </p>
          </div>
          <button className="w-full sm:w-auto px-6 h-10 bg-white text-slate-900 rounded-lg font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-md">
             Configurações
          </button>
       </div>
    </div>
  );
};

export default NotificationsPage;
