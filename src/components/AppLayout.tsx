import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  MessageCircle, 
  LayoutDashboard, 
  Users, 
  RefreshCcw,
  Plus,
  X,
} from 'lucide-react';
import { useAuthStore, useSettingsStore } from '@store/authStore';
import { useLogout } from '@services/auth.hooks';
import { useNotifications, useNotificationUnreadCount, useMarkAllNotificationsRead } from '@services/notifications.hooks';
import { useChatRooms } from '@services/chat.hooks';
import Sidebar from './Sidebar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { getAvatarUrl } from '@lib/media';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Room } from '@types';

const NotificationsDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-[#192633] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[70]"
    >
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-tight">Notificações</h3>
        <div className="flex items-center gap-3">
          <span 
            onClick={() => markAllRead()}
            className="text-[10px] font-black text-primary uppercase cursor-pointer hover:underline"
          >
            Limpar
          </span>
          <button onClick={onClose} className="p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
            <X className="size-3.5 text-slate-400" />
          </button>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-10 flex justify-center"><RefreshCcw className="size-5 text-primary animate-spin" /></div>
        ) : notifications && notifications.length > 0 ? (
          <div className="flex flex-col">
            {notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase truncate pr-4">{notif.title}</h4>
                  <span className="text-[8px] font-medium text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="size-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <Bell className="size-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Sem notificações agora
            </p>
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-50 dark:bg-[#111922] text-center border-t border-slate-100 dark:border-white/5">
        <Link 
          to="/notifications" 
          onClick={onClose}
          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
        >
          Ver todas
        </Link>
      </div>
    </motion.div>
  );
};

const AppLayout: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { theme, toggleTheme } = useSettingsStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { mutate: logout } = useLogout();
  const { data: unreadData } = useNotificationUnreadCount();
  const { data: chatRooms } = useChatRooms();

  const totalUnreadMessages = (chatRooms as Room[])?.reduce((acc: number, room: Room) => acc + (room.unread_count || 0), 0) || 0;

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-[100dvh] md:h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display transition-colors duration-300 selection:bg-primary selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
        <header className="sticky top-0 z-[55] h-14 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-center">
          
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="size-7 bg-primary rounded-lg flex items-center justify-center text-white">
                  <RefreshCcw className="size-4" />
                </div>
                <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">KwanzaConnect</h1>
              </Link>
            </div>

            <div className="hidden lg:block">
              <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Plataforma Digital de Verificação</h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>

              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className={`flex items-center justify-center rounded-lg h-8 w-8 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all ${showNotifications ? 'text-primary' : ''}`}
                >
                  <div className="relative">
                    <Bell className="size-4" />
                    {unreadData && unreadData.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white dark:border-[#101922]"></span>
                      </div>
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {showNotifications && <NotificationsDropdown onClose={() => setShowNotifications(false)} />}
                </AnimatePresence>
              </div>

              <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />

              <div className="relative" ref={profileRef}>
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase leading-none">{user?.full_name ? user.full_name.split(' ')[0] : 'Usuário'}</span>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1 opacity-80">Verificado</span>
                  </div>
                  <Avatar className="size-8 rounded-lg border border-slate-100 dark:border-white/10 group-hover:border-primary transition-all shadow-sm overflow-hidden bg-slate-200 dark:bg-[#192633]">
                    <AvatarImage src={getAvatarUrl(user?.avatar, user?.full_name)} />
                    <AvatarFallback className="rounded-lg">
                      <User className="size-4 text-slate-400" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#192633] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-[70]"
                    >
                      <div className="p-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-[#111922]/30">
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{user?.full_name}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                         <Link to="/perfil" className="flex items-center gap-2.5 p-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <User className="size-4 text-primary" />
                            Meu Perfil
                         </Link>
                         <Link to="/settings" className="flex items-center gap-2.5 p-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <Settings className="size-4" />
                            Configurações
                         </Link>
                         <hr className="my-1 border-slate-100 dark:border-white/5 mx-2" />
                         <button 
                           onClick={() => logout()}
                           className="flex w-full items-center gap-2.5 p-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors"
                         >
                            <LogOut className="size-4" />
                            Sair
                         </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center overflow-x-hidden">
          <div className="w-full max-w-6xl p-4 md:p-6 lg:p-8">
             <Outlet />
          </div>
        </main>
      </div>

      <motion.nav
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[85%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-6 py-4 sm:py-5 flex items-center justify-between pointer-events-auto"
      >
        <Link to="/" className="text-slate-400 hover:text-primary transition-all flex flex-col items-center gap-1 active:scale-90">
          <LayoutDashboard className="size-6 sm:size-7" />
        </Link>
        <Link to="/p2p/browse" className="text-slate-400 hover:text-primary transition-all flex flex-col items-center gap-1 active:scale-90">
          <Users className="size-6 sm:size-7" />
        </Link>
        <Link to="/conversao" className="size-14 sm:size-16 bg-primary rounded-2xl flex items-center justify-center text-white -mt-12 sm:-mt-14 shadow-2xl shadow-primary/40 active:scale-90 ring-4 ring-white dark:ring-background-dark transition-all">
          <Plus className="size-8 sm:size-9" />
        </Link>
        <Link to="/mensagens" className="text-slate-400 hover:text-primary transition-all flex flex-col items-center gap-1 active:scale-90 relative">
          <MessageCircle className="size-6 sm:size-7" />
          {totalUnreadMessages > 0 && (
            <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
            </div>
          )}
        </Link>
        <Link to="/perfil" className="text-slate-400 hover:text-primary transition-all flex flex-col items-center gap-1 active:scale-90 text-sm">
          <User className="size-6 sm:size-7" />
        </Link>
      </motion.nav>
      
      <div className="h-28 lg:hidden flex-shrink-0" />
    </div>
  );
};

export default AppLayout;
