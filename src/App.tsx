import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useSettingsStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/app/auth/LoginPage';
import DashboardPage from '@/app/dashboard/DashboardPage';
import CambioMercadoPage from '@/app/exchange/CambioMercadoPage';
import ConversaoPage from '@/app/conversion/ConversaoPage';
import HistoricoTransacoesPage from '@/app/transactions/HistoricoTransacoesPage';
import PerfilPage from '@/app/profile/PerfilPage';
import MensagensPage from '@/app/messages/MensagensPage';
import HelpCenterPage from '@/app/public/HelpCenterPage';
import FazerOfertaPage from '@/app/offers/FazerOfertaPage';
import ReceberOfertaPage from '@/app/offers/ReceberOfertaPage';
import MinhasOfertasPage from '@/app/offers/MinhasOfertasPage';
import InteressesPage from '@/app/offers/InteressesPage';
import LogsPage from '@/app/logs/LogsPage';
import SettingsPage from '@/app/settings/SettingsPage';
import ForgotPasswordPage from '@/app/public/ForgotPasswordPage';
import VerifyEmailPage from '@/app/public/VerifyEmailPage';
import NotificationsPage from '@/app/notifications/NotificationsPage';
import { useMe } from '@/services/auth.hooks';

const App: React.FC = () => {
  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const theme = useSettingsStore((s) => s.theme);

  // Auto-fetch user when authenticated but no user data
  const { data: userData } = useMe(!user && isAuthenticated);

  useEffect(() => {
    if (userData && !user) {
      setUser(userData);
    }
  }, [userData, user, setUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#192633' : '#fff',
            color: theme === 'dark' ? '#fff' : '#1a1f2e',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e1e4e8',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 'bold',
            fontFamily: 'Manrope, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<Navigate to="/login" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cambio-mercado" element={<CambioMercadoPage />} />
            <Route path="/conversao" element={<ConversaoPage />} />
            <Route path="/historico" element={<HistoricoTransacoesPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/mensagens" element={<MensagensPage />} />
            <Route path="/mensagens/:roomId" element={<MensagensPage />} />
            <Route path="/ajuda" element={<HelpCenterPage />} />
            <Route path="/p2p/post" element={<FazerOfertaPage />} />
            <Route path="/p2p/browse" element={<ReceberOfertaPage />} />
            <Route path="/p2p/minhas-ofertas" element={<MinhasOfertasPage />} />
            <Route path="/p2p/interesses" element={<InteressesPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
