import { create } from 'zustand';
import { persist } from 'zustand/middleware';











export const useUIStore = create()(
  persist(
    (set) => ({
      theme: 'dark', // Default as requested
      sidebarCollapsed: false,
      commandPaletteOpen: false,

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.documentElement.classList.toggle('light', newTheme === 'light');
        return { theme: newTheme };
      }),

      setTheme: (newTheme) => set(() => {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.documentElement.classList.toggle('light', newTheme === 'light');
        return { theme: newTheme };
      }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false })
    }),
    {
      name: 'docuflow-ui',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
          document.documentElement.classList.toggle('light', state.theme === 'light');
        }
      }
    }
  )
);

// Initialize theme immediately to prevent flash
if (typeof document !== 'undefined') {
  const local = localStorage.getItem('docuflow-ui');
  if (local) {
    try {
      const { state } = JSON.parse(local);
      if (state.theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch {
      document.documentElement.classList.add('dark');
    }
  } else {
    document.documentElement.classList.add('dark');
  }
}