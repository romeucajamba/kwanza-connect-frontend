import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRightLeft, 
  LogOut,
  Bell
} from 'lucide-react';
import { APP_ROUTES } from '@/constants';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();

  // Guard: Somente admins (staff)
  if (!user?.is_staff) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  const navLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/users', icon: Users, label: 'Utilizadores' },
    { to: '/admin/offers', icon: ArrowRightLeft, label: 'Ofertas' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1117] text-slate-900 dark:text-white font-sans overflow-hidden selection:bg-primary/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#111922] border-r border-slate-100 dark:border-white/5 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-white/5">
          <ShieldCheck className="size-6 text-primary mr-2" />
          <span className="font-black tracking-tighter text-lg">Kwanza<span className="text-primary italic">Admin</span></span>
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
                }`
              }
            >
              <link.icon className="size-4.5" strokeWidth={2.5} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-4.5" strokeWidth={2.5} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-[#0b1117]">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-[#111922]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-8 z-10">
          <h2 className="text-sm font-black uppercase tracking-widest opacity-80">Gestão do Sistema</h2>
          <div className="flex items-center gap-4">
            <button className="relative size-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-primary transition-colors">
              <Bell className="size-4.5" />
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-ping" />
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
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
