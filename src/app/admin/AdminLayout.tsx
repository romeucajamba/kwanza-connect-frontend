import React, { useState } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuthStore, useSettingsStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRightLeft, 
  LogOut,
  FileText,
  Coins,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  Bell,
  X,
  RefreshCcw,
  Activity
} from 'lucide-react';
import { APP_ROUTES } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, useNotificationUnreadCount, useMarkAllNotificationsRead } from '@services/notifications.hooks';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    </motion.div>
  );
};

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useSettingsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: unreadData } = useNotificationUnreadCount();
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Se o utilizador ainda não carregou, aguarda
  if (!user) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0b1117]"><span>Carregando painel admin...</span></div>;
  }

  // Guard: Somente admins (staff)
  if (!user.is_staff) {
    return <Navigate to={APP_ROUTES.ADMIN_LOGIN} replace />;
  }

  const navLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: Users, label: 'Utilizadores' },
    { to: '/admin/offers', icon: ArrowRightLeft, label: 'Ofertas' },
    { to: '/admin/currencies', icon: Coins, label: 'Moedas' },
    { to: '/admin/logs', icon: FileText, label: 'Logs de Auditoria' },
    { to: '/admin/health', icon: Activity, label: 'Saúde do Sistema' },
    { to: '/admin/profile', icon: Settings, label: 'O Meu Perfil' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1117] text-slate-900 dark:text-white font-sans overflow-hidden selection:bg-primary/30">
      
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-[#111922] border-r border-slate-100 dark:border-white/5 flex flex-col z-20`}>
        <div className={`h-16 flex items-center px-4 border-b border-slate-100 dark:border-white/5 ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <div className={`flex items-center ${!isSidebarOpen ? 'hidden' : ''}`}>
            <ShieldCheck className="size-6 text-primary mr-2" />
            <span className="font-black tracking-tighter text-lg">Kwanza<span className="text-primary italic">Admin</span></span>
          </div>
          <ShieldCheck className={`size-8 text-primary ${isSidebarOpen ? 'hidden' : ''}`} />
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                } ${!isSidebarOpen && 'justify-center'}`
              }
              title={!isSidebarOpen ? link.label : undefined}
            >
              <link.icon className="size-4.5 flex-shrink-0" strokeWidth={2.5} />
              <span className={!isSidebarOpen ? 'hidden' : ''}>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`p-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2 ${!isSidebarOpen ? 'items-center' : ''}`}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all ${isSidebarOpen ? 'w-full' : 'justify-center'}`}
            title={!isSidebarOpen ? "Abrir Menu" : undefined}
          >
            <ChevronLeft className={`size-4.5 flex-shrink-0 ${!isSidebarOpen ? 'hidden' : ''}`} strokeWidth={2.5} />
            <Menu className={`size-4.5 flex-shrink-0 ${isSidebarOpen ? 'hidden' : ''}`} strokeWidth={2.5} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>Recolher Menu</span>
          </button>
          
          <button 
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${isSidebarOpen ? 'w-full' : 'justify-center'}`}
            title={!isSidebarOpen ? "Sair do Painel" : undefined}
          >
            <LogOut className="size-4.5 flex-shrink-0" strokeWidth={2.5} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#0b1117]">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-[#111922]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <Menu className="size-5" />
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-80 hidden sm:block">Gestão do Sistema</h2>
          </div>
          <div className="flex items-center gap-4">
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-slate-100 dark:border-white/10 shadow-sm ${showNotifications ? 'text-primary' : ''}`}
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

            <button 
              onClick={toggleTheme}
              className="size-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-slate-100 dark:border-white/10 shadow-sm"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{user.full_name}</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Administrador</p>
              </div>
              <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                {user.full_name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
