/**
 * Utilitários para formatação de URLs de média.
 */

const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getAvatarUrl = (path: string | null | undefined, seed?: string): string => {
  if (!path) {
    // Fallback para Iniciais se não houver avatar (mais profissional que bonecos)
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || 'User')}&backgroundColor=0066ff,3399ff,6366f1,8b5cf6,ec4899`;
  }

  if (path.startsWith('http')) {
    return path;
  }

  // Se o caminho já vier com /media, apenas concatenamos com o Host global (sem /api)
  // Remove barras duplicadas
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_HOST}${cleanPath}`;
};
