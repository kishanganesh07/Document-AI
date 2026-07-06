import { useState } from 'react';
import { Search, Bell, Sun, Moon, Command, LogOut } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/generate': 'Generate',
  '/documents': 'My Documents',
  '/templates': 'Templates',
  '/batch': 'Batch Generate',
  '/dashboard': 'Dashboard',
  '/organization': 'Organization',
  '/settings': 'Settings'
};

export function Header() {
  const { theme, toggleTheme, openCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] || (
  location.pathname.startsWith('/documents/') ? 'Document Details' : 'DocuFlow');

  return (
    <header className="h-16 glass m-4 mb-0 rounded-2xl flex items-center px-6 gap-3 shrink-0 z-20 shadow-md">
      {/* Page title */}
      <div className="text-sm font-semibold text-[var(--text-primary)] min-w-0 hidden md:block">
        {pageTitle}
      </div>

      {/* Global search */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[var(--border)]/80 bg-[var(--bg-base)]/50 hover:border-[var(--color-primary)]/60 hover:bg-[var(--bg-surface)] transition-all duration-300 text-left group focus-within:ring-2 ring-[var(--color-primary)]/10">
          
          <Search size={15} className="text-[var(--text-muted)] shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="flex-1 text-sm text-[var(--text-xmuted)]">
            Search documents, templates...
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-xmuted)] bg-[var(--bg-surface-el)] border border-[var(--border)] rounded-md px-2 py-0.5 shadow-sm font-mono">
            <Command size={10} />K
          </span>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-[var(--bg-hover)]/60 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-300 hover:scale-105 active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-[var(--bg-hover)]/60 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-300 hover:scale-105 active:scale-95">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-error)] border-2 border-[var(--bg-surface)] animate-pulse" />
        </button>

        {/* User avatar & Dropdown */}
        <div className="relative ml-2">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-ai)] flex items-center justify-center cursor-pointer hover:ring-2 ring-[var(--color-primary)]/80 ring-offset-2 ring-offset-[var(--bg-surface)] transition-all shadow-md">
            <span className="text-xs font-semibold text-white uppercase">
              {user?.name?.[0] ?? 'U'}
            </span>
          </div>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 mt-3 w-52 rounded-xl shadow-xl bg-[var(--bg-surface)] border border-[var(--border)] z-50 py-1.5 overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]/50">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user?.email || 'No email provided'}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );

}