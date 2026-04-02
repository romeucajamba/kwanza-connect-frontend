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
  TRANSACTIONS: {
    BASE: '/transactions/',
  },
};

export const AUTH_KEYS = {
  TOKEN: 'token',
  USER: 'user-data',
};
