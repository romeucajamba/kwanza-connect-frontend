import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos: os dados são servidos a partir do cache sem requisição ao servidor
      gcTime: 1000 * 60 * 60 * 24, // 24 horas: tempo que os dados ficam guardados no localStorage
      refetchOnWindowFocus: false, // Não faz requisição ao voltar para a aba
      refetchOnReconnect: false, // Não faz requisição ao reconectar a rede
      retry: 1, // Apenas uma tentativa extra em caso de erro
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider 
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>,
)
