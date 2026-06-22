import React from 'react';
import { NavLink } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Users, 
  RefreshCcw, 
  TrendingUp, 
  History, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Repeat,
  Tag,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { APP_ROUTES } from '@constants';
import { useLogout } from '@services/auth.hooks';
import { useChatRooms } from '@services/chat.hooks';
import type { Room } from '@types';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, badge, isCollapsed }) => (
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
          className={`size-5 transition-transform group-hover:scale-110 ${isActive ? 'fill-primary/10 text-primary' : ''} ${isCollapsed ? 'mx-auto' : ''}`} 
        />
        {!isCollapsed && (
          <span className="text-[11px] font-bold tracking-tight uppercase flex-1 whitespace-nowrap">{label}</span>
        )}
        
        {badge && !isCollapsed ? (
           <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse whitespace-nowrap">
              {badge}
           </span>
        ) : badge && isCollapsed ? (
           <span className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
        ) : null}

        {isActive && (
          <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
        )}
      </>
    )}
  </NavLink>
);

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile, isCollapsed, toggleCollapse }) => {
  const { mutate: logout } = useLogout();
  const { data: rooms } = useChatRooms();

  const totalUnreadMessages = (rooms as Room[])?.reduce((acc: number, room: Room) => acc + (room.unread_count || 0), 0) || 0;

  const menuItems = [
    { to: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: APP_ROUTES.P2P_BROWSE, icon: Users, label: 'Trocas P2P' },
    { to: APP_ROUTES.P2P_MY_OFFERS, icon: Tag, label: 'Minhas Ofertas' },
    { to: APP_ROUTES.P2P_INTERESTS, icon: Heart, label: 'Meus Interesses' },
    { to: APP_ROUTES.CONVERSAO, icon: Repeat, label: 'Conversão' },
    { to: APP_ROUTES.CAMBIO_MERCADO, icon: TrendingUp, label: 'Câmbio' },
    { to: APP_ROUTES.HISTORICO, icon: History, label: 'Histórico' },
    { to: APP_ROUTES.MENSAGENS, icon: MessageSquare, label: 'Mensagens', badge: totalUnreadMessages },
    { to: APP_ROUTES.PERFIL, icon: User, label: 'Perfil' },
    { to: '/settings', icon: Settings, label: 'Definições' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-[70] flex flex-col h-[100dvh] bg-white dark:bg-[#111922] border-r border-slate-200 dark:border-white/10 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-screen
          ${isCollapsed ? 'lg:w-20' : 'w-64'}
        `}
      >
        <div className={`p-6 flex items-center mb-2 relative ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
          <div className="size-8 flex-shrink-0 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
            <RefreshCcw className="size-5" />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">Kwanza<span className="text-primary">Connect</span></h1>
          )}
          
          
          <button 
            onClick={onCloseMobile}
            className="lg:hidden ml-auto p-1 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col pt-2">
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        <div className="p-4 mt-auto flex flex-col gap-2">
          {/* Toggle Sidebar Button (Desktop only) */}
          <button 
            onClick={toggleCollapse}
            className={`hidden lg:flex w-full items-center px-3 py-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors duration-200 group ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            title={isCollapsed ? "Expandir" : "Recolher"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-5 transition-transform group-hover:scale-110" />
            ) : (
              <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            )}
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-tight">Recolher</span>}
          </button>

          <button 
            onClick={() => logout()}
            className={`w-full flex items-center px-3 py-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-colors duration-200 group ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            title={isCollapsed ? "Sair" : undefined}
          >
            <LogOut className={`size-5 transition-transform ${isCollapsed ? '' : 'group-hover:-translate-x-1'}`} />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-tight">Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
