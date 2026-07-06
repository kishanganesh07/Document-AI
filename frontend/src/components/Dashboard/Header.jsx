import { useState } from 'react';
import { Search, Bell, Sun, Moon, Command, LogOut } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/generate': 'Generate',
  '/documents': 'My Documents',
  '/templates': 'Templates',
  '/batch': 'Batch Generate',
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
    <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center px-4 gap-3 shrink-0 z-20">
      {/* Page title */}
      <div className="text-sm font-semibold text-[var(--text-primary)] min-w-0 hidden md:block">
        {pageTitle}
      </div>

      {/* Global search */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-app)] hover:border-[var(--color-primary)] transition-colors text-left group">
          
          <Search size={14} className="text-[var(--text-muted)] shrink-0" />
          <span className="flex-1 text-sm text-[var(--text-xmuted)]">
            Search documents, templates...
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-xmuted)] bg-[var(--bg-surface-el)] border border-[var(--border)] rounded px-1.5 py-0.5">
            <Command size={10} />K
          </span>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-error)]" />
        </button>

        {/* User avatar & Dropdown */}
        <div className="relative ml-1">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center cursor-pointer hover:ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--bg-surface)] transition-all">
            <span className="text-xs font-semibold text-white">
              {user?.name?.[0] ?? 'U'}
            </span>
          </div>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[var(--bg-surface)] border border-[var(--border)] z-50 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-app)]">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email || 'No email provided'}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
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
    </header>);

}