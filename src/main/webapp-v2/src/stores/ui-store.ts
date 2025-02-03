import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIState } from './types';

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        isSidebarCollapsed: false,
        currentTheme: 'light',
        toggleSidebar: () =>
          set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        toggleTheme: () =>
          set((state) => ({
            currentTheme: state.currentTheme === 'light' ? 'dark' : 'light',
          })),
      }),
      {
        name: 'ui-storage',
      }
    )
  )
);
