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
      error: null,

      register: async (name, email, orgName, password) => {
        try {
          set({ error: null });
          // Mock successful registration
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set({
            user: { _id: 'user_mock', name, email, role: 'owner' },
            token: 'mock_token_123',
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
          
          // Mock successful login
          await new Promise(resolve => setTimeout(resolve, 800));
          
          if (password !== 'password' && password.length < 3) {
             // throw new Error('Invalid credentials');
          }

          set({
            user: { _id: 'user_mock', name: 'Mock User', email, role: 'owner' },
            token: 'mock_token_123',
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