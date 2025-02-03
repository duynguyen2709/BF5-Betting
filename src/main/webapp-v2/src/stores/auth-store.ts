import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState } from './types';

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        sessionToken: undefined,
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setSessionToken: (sessionToken) => set({ sessionToken }),
        logout: () => set({ isAuthenticated: false, sessionToken: undefined }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
