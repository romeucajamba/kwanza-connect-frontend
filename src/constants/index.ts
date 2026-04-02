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
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
  },
  OFFERS: {
    BASE: '/offers/',
    MINE: '/offers/mine/',
    CURRENCIES: '/offers/currencies/',
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
    MESSAGES: '/chat/messages/',
  },
  NOTIFICATIONS: {
    BASE: '/notifications/',
    UNREAD: '/notifications/unread-count/',
  }
};

export const AUTH_KEYS = {
  TOKEN: 'token',
  USER: 'user-data',
};
