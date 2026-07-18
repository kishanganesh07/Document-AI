import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ROLE_PERMISSIONS = {
  owner: ['manage_users', 'manage_billing', 'manage_documents', 'delete_documents', 'generate:docs', 'view:docs', 'manage:templates', 'manage:org'],
  admin: ['manage_users', 'manage_documents', 'generate:docs', 'view:docs', 'manage:templates'],
  member: ['manage_documents', 'generate:docs', 'view:docs', 'manage:templates', 'manage:org']
};

const MOCK_ORG = {
  _id: 'org_001',
  name: 'TechFlow Systems',
  email: 'admin@techflow.io',
  plan: 'pro'
};

const API_BASE = import.meta.env.VITE_API_URL || '';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      organization: MOCK_ORG,
      token: null,
      isAuthenticated: false,
      register: async (name, email, orgName, password) => {
        try {
          set({ error: null });
          
          const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }
          
          set({
            user: { ...data.user, role: data.user.role || 'owner' },
            token: data.token,
            isAuthenticated: true,
            error: null
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },


      login: async (email, password) => {
        try {
          set({ error: null });
          
          const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: { ...data.user, role: data.user.role || 'owner' },
            token: data.token,
            isAuthenticated: true,
            error: null
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          const token = get().token;
          const response = await fetch(`${API_BASE}/api/auth/change-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || 'Failed to update password');
          }
          return data;
        } catch (error) {
          throw error;
        }
      },

      hasPermission: (permission) => {
        const user = get().user;
        if (!user || !user.role) return false;
        
        // Ensure role exists in ROLE_PERMISSIONS mapping
        const permissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.includes(permission);
      }
    }),
    {
      name: 'docuflow-auth-v2',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);