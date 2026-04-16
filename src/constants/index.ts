export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  DASHBOARD: '/dashboard',
  CONVERSAO: '/conversao',
  CAMBIO_MERCADO: '/cambio-mercado',
  HISTORICO: '/historico',
  PERFIL: '/perfil',
  MENSAGENS: '/mensagens',
  AJUDA: '/ajuda',
  P2P_POST: '/p2p/post',
  P2P_BROWSE: '/p2p/browse',
  P2P_MY_OFFERS: '/p2p/minhas-ofertas',
  P2P_INTERESTS: '/p2p/interesses',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
  NOTIFICATIONS: '/notifications',
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/',
    VERIFY_EMAIL: '/auth/verify-email/',
    CHANGE_PASSWORD: '/auth/change-password/',
  },
  OFFERS: {
    BASE: '/offers/',
    MINE: '/offers/mine/',
    CURRENCIES: '/offers/currencies/',
    INTERESTS_MINE: '/offers/interests/mine/',
  },
  RATES: {
    BASE: '/rates/',
    CONVERT: '/rates/convert/',
    DASHBOARD: '/rates/dashboard/',
  },
  TRANSACTIONS: {
    BASE: '/transactions/',
    CONFIRM: '/transactions/confirm/',
  },
  CHAT: {
    ROOMS: '/chat/rooms/',
    ROOM_DETAIL: (id: string) => `/chat/rooms/${id}/`,
    ROOM_MESSAGES: (id: string) => `/chat/rooms/${id}/messages/`,
    MESSAGES: '/chat/messages/',
  },
  NOTIFICATIONS: {
    BASE: '/notifications/',
    UNREAD: '/notifications/unread-count/',
    MARK_READ: '/notifications/mark-read/',
    PREFERENCES: '/notifications/preferences/',
  }
};

export const AUTH_KEYS = {
  TOKEN: 'token',
  USER: 'user-data',
};
