import { create } from 'zustand';




















let toastCounter = 0;

export const useNotificationStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast_${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));

    // Auto dismiss after 5s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 5000);
  },

  dismissToast: (id) =>
  set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  success: (title, description) => get().addToast({ title, description, variant: 'success' }),
  error: (title, description) => get().addToast({ title, description, variant: 'error' }),
  warning: (title, description) => get().addToast({ title, description, variant: 'warning' }),
  info: (title, description) => get().addToast({ title, description, variant: 'info' })
}));

// Helper to use outside of React components
const get = () => useNotificationStore.getState();