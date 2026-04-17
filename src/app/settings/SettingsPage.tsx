import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  LogOut, 
  Moon, 
  Sun, 
  Smartphone, 
  CreditCard, 
  Activity,
  X,
  Brain,
  Trophy,
  ChevronLeft
} from 'lucide-react';
import { useAuthStore, useSettingsStore } from '@store/authStore';
import { useLogout, useChangePassword } from '@services/auth.hooks';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

const SettingItem: React.FC<{ icon: React.ElementType; label: string; desc: string; action?: () => void; toggle?: boolean; checked?: boolean }> = ({ icon: Icon, label, desc, action, toggle, checked }) => (
  <button 
    onClick={action}
    className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group border-b border-slate-100 dark:border-white/5 last:border-0"
  >
    <div className="flex items-center gap-4 text-left">
      <div className="size-9 rounded-lg bg-slate-50 dark:bg-[#111922] flex items-center justify-center text-slate-300 dark:text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
        <Icon className="size-4.5" />
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{label}</h4>
        <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1 opacity-80">{desc}</p>
      </div>
    </div>
    {toggle ? (
      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}>
        <div className={`size-3 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    ) : (
      <ChevronRight className="size-3.5 text-slate-200 dark:text-slate-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
    )}
  </button>
);

const SettingsPage: React.FC = () => {
  const { mutate: logout } = useLogout();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { theme, toggleTheme } = useSettingsStore();
  const [activeSection, setActiveSection] = useState<'main' | 'security' | 'payments'>('main');
  const [view, setView] = useState<'nav' | 'content'>('nav');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const onPasswordSubmit = (data: any) => {
    changePassword(data, {
      onSuccess: () => {
        setShowPasswordForm(false);
        reset();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Compacto */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Definições <span className="text-primary italic">Plataforma</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Consola de gestão e segurança de activos digitais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <aside className={`${view === 'nav' ? 'flex' : 'hidden'} lg:flex lg:col-span-4 flex-col gap-3`}>
           {[
             { id: 'main', icon: Settings, label: 'Preferências', desc: 'Interface e Perfil' },
             { id: 'security', icon: Lock, label: 'Segurança', desc: 'Identidade e Senha' },
           ].map((section) => (
             <button 
               key={section.id}
               onClick={() => { setActiveSection(section.id as any); setView('content'); }}
               className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border shadow-sm ${activeSection === section.id ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white dark:bg-[#192633] border-slate-50 dark:border-white/5 text-slate-900 dark:text-white hover:border-primary/20'}`}
             >
                <div className={`size-10 rounded-lg flex items-center justify-center transition-transform ${activeSection === section.id ? 'bg-white/20 shadow-inner' : 'bg-slate-50 dark:bg-[#111922]'}`}>
                   <section.icon className="size-5" />
                </div>
                <div className="text-left min-w-0">
                   <h3 className="text-[11px] font-bold uppercase tracking-tight truncate">{section.label}</h3>
                   <p className={`text-[8px] font-bold mt-1 uppercase tracking-widest opacity-60 truncate ${activeSection === section.id ? 'text-white' : 'text-slate-400'}`}>{section.desc}</p>
                </div>
                <ChevronRight className={`ml-auto size-3.5 opacity-30 ${activeSection === section.id ? 'text-white' : ''} lg:hidden`} />
             </button>
           ))}

           <div className="mt-6 p-6 bg-zinc-900 dark:bg-black rounded-xl text-white overflow-hidden relative shadow-lg group">
              <LogOut className="absolute -bottom-6 -right-6 size-24 text-white/[0.02] -rotate-12 pointer-events-none" />
              <div className="relative z-10">
                 <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-6 text-center">Gestão de Sessão</p>
                 <button 
                   onClick={() => logout()}
                   className="w-full h-10 bg-rose-600 text-white rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/10"
                 >
                    <LogOut className="size-3.5" />
                    Terminar Sessão
                 </button>
              </div>
           </div>
        </aside>

        {/* Content Area */}
        <main className={`${view === 'content' ? 'flex' : 'hidden'} lg:flex lg:col-span-8 flex-col gap-6`}>
           <AnimatePresence mode="wait">
              {activeSection === 'main' && (
                 <motion.div 
                   key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md flex flex-col overflow-hidden h-full"
                 >
                    <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center lg:block">
                       <button onClick={() => setView('nav')} className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 mr-3">
                          <ChevronLeft className="size-4" />
                       </button>
                       <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Geral & Perfil</h3>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">Personalização de Interface</p>
                       </div>
                    </div>
                    <div className="flex-1">
                       <SettingItem icon={User} label="Identidade Digital" desc="Edite seu BI, Nome e Foto de Perfil." />
                       <SettingItem icon={theme === 'dark' ? Moon : Sun} label="Modo Dark" desc="Activação do ambiente nocturno." action={toggleTheme} toggle checked={theme === 'dark'} />
                       <SettingItem icon={Globe} label="Idioma Local" desc="Padrão: Português" />
                       <SettingItem icon={Bell} label="Notificações App" desc="Alertas Push em tempo real." toggle checked={true} />
                    </div>
                 </motion.div>
              )}

              {activeSection === 'security' && (
                 <motion.div 
                   key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-md flex flex-col overflow-hidden h-full"
                 >
                    <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center lg:block">
                       <button onClick={() => setView('nav')} className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 mr-3">
                          <ChevronLeft className="size-4" />
                       </button>
                       <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Proteção</h3>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">Configurações de Acesso</p>
                       </div>
                    </div>
                     <div className="flex-1">
                        {!showPasswordForm ? (
                          <SettingItem 
                            icon={Lock} 
                            label="Palavra-Passe" 
                            desc="Alterada pela última vez há 2 meses." 
                            action={() => setShowPasswordForm(true)}
                          />
                        ) : (
                          <div className="p-6 space-y-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Alterar Senha</h4>
                                <button onClick={() => setShowPasswordForm(false)} className="text-slate-400 hover:text-rose-500">
                                   <X className="size-3.5" />
                                </button>
                             </div>
                             <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <div className="space-y-1.5">
                                   <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha Atual</label>
                                   <input 
                                      {...register('current_password', { required: true })}
                                      type="password"
                                      className="w-full bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary/30"
                                   />
                                </div>
                                <div className="space-y-1.5">
                                   <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Nova Senha</label>
                                   <input 
                                      {...register('new_password', { required: true })}
                                      type="password"
                                      className="w-full bg-white dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary/30"
                                   />
                                </div>
                                <div className="flex gap-2 pt-2">
                                   <button 
                                      type="button" onClick={() => setShowPasswordForm(false)}
                                      className="flex-1 h-9 rounded-lg bg-slate-100 dark:bg-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500"
                                   >
                                      Cancelar
                                   </button>
                                   <button 
                                      type="submit" disabled={isChangingPassword}
                                      className="flex-1 h-9 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                   >
                                      {isChangingPassword && <Loader2 className="size-3 animate-spin" />}
                                      Confirmar
                                   </button>
                                </div>
                             </form>
                          </div>
                        )}
                     </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>

  );
};

export default SettingsPage;
