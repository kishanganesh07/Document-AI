import { create } from 'zustand';

let toastCounter = 0;

export const useNotificationStore = create((set, get) => ({
  // Persistent Bell Notifications
  notifications: [
    {
      id: 'n1',
      title: 'Welcome to DocuFlow!',
      message: 'Start generating professional documents with AI instantly.',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 'n2',
      title: 'Invoice Draft Saved',
      message: 'Your draft for Acme Technologies was successfully saved.',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    }
  ],

  // Transient Screen Toasts
  toasts: [],

  // Toast actions
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

  // Unified helpers that fire BOTH a Toast and add a persistent Notification
  success: (title, description) => {
    get().addToast({ title, description, variant: 'success' });
    get().addNotification(title, description || '', 'success');
  },
  error: (title, description) => {
    get().addToast({ title, description, variant: 'error' });
    get().addNotification(title, description || '', 'error');
  },
  warning: (title, description) => {
    get().addToast({ title, description, variant: 'warning' });
    get().addNotification(title, description || '', 'warning');
  },
  info: (title, description) => {
    get().addToast({ title, description, variant: 'info' });
    get().addNotification(title, description || '', 'info');
  },

  // Notification actions
  addNotification: (title, message, type = 'info') => {
    const newNotif = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  }
}));

// Helper to use outside of React components
const getStoreState = () => useNotificationStore.getState();
export const notificationHelpers = {
  success: (title, description) => getStoreState().success(title, description),
  error: (title, description) => getStoreState().error(title, description),
  warning: (title, description) => getStoreState().warning(title, description),
  info: (title, description) => getStoreState().info(title, description)
};