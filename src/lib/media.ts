/**
 * Utilitários para formatação de URLs de média.
 */

const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getAvatarUrl = (path: string | null | undefined, email?: string): string => {
  if (!path) {
    // Fallback para Dicebear se não houver avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'user-default'}`;
  }

  if (path.startsWith('http')) {
    return path;
  }

  // Se o caminho já vier com /media, apenas concatenamos com o Host global (sem /api)
  // Remove barras duplicadas
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_HOST}${cleanPath}`;
};
