import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  RefreshCcw, 
  TrendingUp, 
  History, 
  MessageSquare, 
  User, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Repeat
} from 'lucide-react';
import { APP_ROUTES } from '@constants';
import { useAuthStore } from '@store/authStore';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-6 py-2.5 transition-all duration-200 group relative ${
        isActive 
          ? 'text-primary bg-primary/5' 
          : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon 
          className={`size-4.5 transition-transform group-hover:scale-110 ${isActive ? 'fill-primary/10' : ''}`} 
        />
        <span className="text-[11px] font-bold tracking-tight uppercase">{label}</span>
        {isActive && (
          <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
        )}
      </>
    )}
  </NavLink>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const menuItems = [
    { to: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: APP_ROUTES.P2P_BROWSE, icon: Users, label: 'Trocas' },
    { to: APP_ROUTES.CONVERSAO, icon: Repeat, label: 'Conversão' },
    { to: APP_ROUTES.CAMBIO_MERCADO, icon: TrendingUp, label: 'Câmbio' },
    { to: APP_ROUTES.HISTORICO, icon: History, label: 'Histórico' },
    { to: APP_ROUTES.MENSAGENS, icon: MessageSquare, label: 'Mensagens' },
    { to: APP_ROUTES.PERFIL, icon: User, label: 'Perfil' },
    { to: '/settings', icon: Settings, label: 'Definições' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-[#111922] border-r border-slate-200 dark:border-white/10 sticky top-0 overflow-y-auto custom-scrollbar z-50">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
          <RefreshCcw className="size-5" />
        </div>
        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Kwanza<span className="text-primary">Connect</span></h1>
      </div>

      <nav className="flex-1 flex flex-col pt-2">
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#192633] border border-slate-100 dark:border-white/5 mb-4">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-70">Apoio</p>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Central de Ajuda & FAQ</p>
        </div>

        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-rose-500 transition-colors duration-200 group"
        >
          <LogOut className="size-4.5 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-tight">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
