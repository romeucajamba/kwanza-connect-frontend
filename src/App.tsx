import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useSettingsStore } from '@store/authStore';
import { ProtectedRoute } from '@components/ProtectedRoute';
import AppLayout from '@components/AppLayout';
import LoginPage from '@app/LoginPage';
import DashboardPage from '@app/DashboardPage';
import CambioMercadoPage from '@app/CambioMercadoPage';
import ConversaoPage from '@app/ConversaoPage';
import HistoricoTransacoesPage from '@app/HistoricoTransacoesPage';
import PerfilPage from '@app/PerfilPage';
import MensagensPage from '@app/MensagensPage';
import HelpCenterPage from '@app/HelpCenterPage';
import FazerOfertaPage from '@app/FazerOfertaPage';
import ReceberOfertaPage from '@app/ReceberOfertaPage';
import LogsPage from '@app/LogsPage';
import SettingsPage from '@app/SettingsPage';

const App: React.FC = () => {
  const hydrate = useAuthStore((s) => s.hydrate);
  const theme = useSettingsStore((s) => s.theme);

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
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cambio-mercado" element={<CambioMercadoPage />} />
            <Route path="/conversao" element={<ConversaoPage />} />
            <Route path="/historico" element={<HistoricoTransacoesPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/mensagens" element={<MensagensPage />} />
            <Route path="/ajuda" element={<HelpCenterPage />} />
            <Route path="/p2p/post" element={<FazerOfertaPage />} />
            <Route path="/p2p/browse" element={<ReceberOfertaPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
