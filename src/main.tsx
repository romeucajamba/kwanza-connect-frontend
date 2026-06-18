import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos: os dados são servidos a partir do cache sem requisição ao servidor
      gcTime: 1000 * 60 * 30, // 30 minutos: tempo que os dados inativos ficam guardados em memória
      refetchOnWindowFocus: false, // Não faz requisição ao voltar para a aba
      refetchOnReconnect: false, // Não faz requisição ao reconectar a rede
      retry: 1, // Apenas uma tentativa extra em caso de erro
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
