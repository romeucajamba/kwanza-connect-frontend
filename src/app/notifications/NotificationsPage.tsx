import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  Settings,
  Mail,
  Smartphone,
  Info,
  Check,
  RefreshCcw,
} from 'lucide-react';
import { 
  useNotifications, 
  useMarkAllNotificationsRead, 
  useMarkNotificationRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences
} from '@/services';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const { data: notifications, isLoading: isLoadingNotifs } = useNotifications();
  const { data: prefs, isLoading: isLoadingPrefs } = useNotificationPreferences();
  
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: updatePrefs, isPending: isUpdatingPrefs } = useUpdateNotificationPreferences();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'trade': return { icon: Zap, color: 'text-primary' };
      case 'security': return { icon: ShieldCheck, color: 'text-amber-500' };
      case 'message': return { icon: MessageSquare, color: 'text-emerald-500' };
      case 'system': return { icon: CheckCircle2, color: 'text-emerald-500' };
      case 'info': return { icon: Info, color: 'text-blue-500' };
      default: return { icon: Bell, color: 'text-slate-400' };
    }
  };

  const handleTogglePref = (key: string, current: boolean) => {
    updatePrefs({ [key]: !current });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Centro de <span className="text-primary italic">Comunicação</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Mantenha-se actualizado e configure os seus alertas.
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Alertas
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'preferences' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Preferências
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notifications' ? (
          <motion.div 
            key="notifs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-end gap-2">
               <button 
                onClick={() => markAllRead()}
                className="h-9 px-4 bg-slate-50 dark:bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-widest rounded-lg hover:text-primary transition-colors border border-slate-100 dark:border-white/5"
               >
                  Marcar todas como lidas
               </button>
            </div>

            <div className="max-w-3xl mx-auto w-full space-y-3">
              {isLoadingNotifs ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                ))
              ) : notifications?.map((notif, i) => {
                const { icon: Icon, color } = getNotifIcon(notif.notif_type);
                return (
                  <motion.div 
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group relative ${!notif.is_read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                    <div 
                      className={`size-10 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${color}`}
                      onClick={() => !notif.is_read && markRead(notif.id)}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-xs font-black uppercase tracking-tight ${!notif.is_read ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h3>
                        <div className="flex items-center gap-1.5 opacity-40">
                          <Clock className="size-2.5" />
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button 
                        onClick={() => markRead(notif.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-primary transition-all opacity-0 group-hover:opacity-100"
                      >
                         <Check className="size-4" />
                      </button>
                    )}
                  </motion.div>
                );
              })}

              {(!notifications || notifications.length === 0) && !isLoadingNotifs && (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                    <Bell className="size-16 mb-4" />
                    <h3 className="text-sm font-black uppercase tracking-tight">Sem notificações</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest">Aguarde por novas actualizações de sistema.</p>
                  </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="prefs"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="bg-white dark:bg-[#192633] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Settings className="size-4" /> Configurações de Envio
                </h3>
              </div>
              
              <div className="p-8 space-y-10">
                {isLoadingPrefs ? (
                  <div className="py-10 flex justify-center"><RefreshCcw className="animate-spin text-primary" /></div>
                ) : (
                  <>
                    {/* Canal Email */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <Mail className="size-4" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Notificações por Email</h4>
                      </div>
                      
                      {[
                        { label: 'Novas Ofertas de Mercado', key: 'email_offers' },
                        { label: 'Alertas de Segurança', key: 'email_security' },
                        { label: 'Promoções e Novidades', key: 'email_promotions' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">{item.label}</span>
                          <button 
                            disabled={isUpdatingPrefs}
                            onClick={() => handleTogglePref(item.key, (prefs as any)[item.key])}
                            className={`w-10 h-6 rounded-full transition-all relative ${ (prefs as any)[item.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${(prefs as any)[item.key] ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Canal Push */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Smartphone className="size-4" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Notificações Push (App/Navegador)</h4>
                      </div>
                      
                      {[
                        { label: 'Mensagens de Chat', key: 'push_messages' },
                        { label: 'Estado de Ofertas P2P', key: 'push_offers' },
                        { label: 'Alertas de Acesso', key: 'push_security' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111922] rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">{item.label}</span>
                          <button 
                            disabled={isUpdatingPrefs}
                            onClick={() => handleTogglePref(item.key, (prefs as any)[item.key])}
                            className={`w-10 h-6 rounded-full transition-all relative ${ (prefs as any)[item.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${(prefs as any)[item.key] ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
       </div>
    </div>
  );
};

export default NotificationsPage;
