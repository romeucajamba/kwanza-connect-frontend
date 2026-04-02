import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useSettingsStore } from '@store/authStore';
import { useLogout } from '@services/auth.hooks';
import { APP_ROUTES } from '@constants';

const AppLayout: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const { theme, toggleTheme } = useSettingsStore();

  const navItems = [
    { to: APP_ROUTES.DASHBOARD, label: 'Dashboard' },
    { to: APP_ROUTES.CAMBIO_MERCADO, label: 'Câmbio' },
    { to: APP_ROUTES.P2P_BROWSE, label: 'P2P' },
    { to: APP_ROUTES.CONVERSAO, label: 'Simulador' },
    { to: APP_ROUTES.MENSAGENS, label: 'Chat' },
    { to: APP_ROUTES.HISTORICO, label: 'Atividade' },
    { to: APP_ROUTES.AJUDA, label: 'Suporte' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      {/* Header / Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 md:px-8 lg:px-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link to={APP_ROUTES.DASHBOARD} className="flex items-center gap-3 text-black dark:text-white group">
            <div className="size-8 text-primary group-hover:scale-110 transition-transform">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Plataforma Digital</h2>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 hover:text-primary ${
                    isActive ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
              title="Alternar tema"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            <button className="hidden sm:flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>

            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-1 group cursor-pointer" onClick={() => logout()}>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-transparent group-hover:border-primary transition-all shadow-sm"
                style={{ backgroundImage: `url(${user?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.username})` }}
              />
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold dark:text-white leading-none">{user?.username || 'Usuário'}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Sair</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl px-6 py-3"
      >
        <div className="flex items-center justify-between">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive ? 'text-primary scale-110' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <span className="material-symbols-outlined">
                {item.label === 'Dashboard' ? 'dashboard' : 
                 item.label === 'Câmbio' ? 'currency_exchange' :
                 item.label === 'P2P' ? 'handshake' :
                 item.label === 'Simulador' ? 'monitoring' : 'chat'}
              </span>
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default AppLayout;
