import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertCircle } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.suspended_until) {
    const suspendedDate = new Date(user.suspended_until);
    if (suspendedDate > new Date()) {
      return (
        <div className="flex flex-col h-screen items-center justify-center p-8 bg-slate-50 dark:bg-[#0b1117] text-center">
          <div className="size-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="size-10" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">Conta Suspensa</h1>
          <p className="text-slate-500 max-w-md text-sm font-medium leading-relaxed mb-6">
            A sua conta foi temporariamente suspensa por violação dos termos de serviço da plataforma. A suspensão termina em {suspendedDate.toLocaleString('pt-AO')}.
          </p>
          <button onClick={logout} className="px-6 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all">Sair</button>
        </div>
      );
    }
  }

  if (user?.restricted_pages && user.restricted_pages.length > 0) {
    const isRestricted = user.restricted_pages.some(page => location.pathname.startsWith(page));
    if (isRestricted) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
