import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User, AuthState } from '../types';

// ─── Cookie helpers ───────────────────────────────────────────────────────────
const TOKEN_COOKIE = 'eco_access_token';
const TOKEN_EXPIRY_DAYS = 7;
const TOKEN_SHORT_EXPIRY_DAYS = 1;

export const setTokenCookie = (token: string, remember: boolean = false): void => {
  Cookies.set(TOKEN_COOKIE, token, {
    expires: remember ? TOKEN_EXPIRY_DAYS : TOKEN_SHORT_EXPIRY_DAYS,
    secure: window.location.protocol === 'https:',
    sameSite: 'Strict',
  });
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE);
};

export const removeTokenCookie = (): void => {
  Cookies.remove(TOKEN_COOKIE);
};

// ─── Store Types ──────────────────────────────────────────────────────────────
interface AuthStore extends AuthState {
  // Actions
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string, remember = false) => {
        setTokenCookie(token, remember);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        removeTokenCookie();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      hydrate: () => {
        const cookieToken = getTokenCookie();
        const storeToken = get().token;
        if (!cookieToken && storeToken) {
          // Cookie expired but state still has token → logout
          set({ user: null, token: null, isAuthenticated: false });
        } else if (cookieToken && !storeToken) {
          // Cookie exists but store doesn't → keep cookie as source of truth
          set({ token: cookieToken, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'eco-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Settings Store ───────────────────────────────────────────────────────────
interface SettingsStore {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'pt',

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
      },

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
    }),
    {
      name: 'eco-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
