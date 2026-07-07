import { useState } from 'react';
import { Search, Bell, Sun, Moon, Command } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_META = {
  '/': { title: 'Dashboard', emoji: '🏠' },
  '/generate': { title: 'Generate', emoji: '✨' },
  '/documents': { title: 'Documents', emoji: '📄' },
  '/templates': { title: 'Templates', emoji: '🗂️' },
  '/batch': { title: 'Batch Generate', emoji: '⚡' },
  '/organization': { title: 'Organization', emoji: '🏢' },
  '/settings': { title: 'Settings', emoji: '⚙️' },
};

export function Header() {
  const { theme, toggleTheme, openCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const meta = PAGE_META[location.pathname] || (
    location.pathname.startsWith('/documents/') ? { title: 'Document Details', emoji: '📄' } : { title: 'DocuFlow', emoji: '✨' }
  );

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center px-4 gap-3 shrink-0 z-20">
      {/* Page title */}
      <div className="hidden md:flex items-center gap-2 min-w-0">
        <span className="text-base">{meta.emoji}</span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{meta.title}</span>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-5 bg-[var(--border)]" />

      {/* Global search */}
      <div className="flex-1 max-w-sm">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-el)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-hover)] transition-all text-left"
        >
          <Search size={13} className="text-[var(--text-xmuted)] shrink-0" />
          <span className="flex-1 text-xs text-[var(--text-xmuted)]">Search anything...</span>
          <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-xmuted)] bg-[var(--bg-hover)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono">
            <Command size={9} />K
          </span>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-error)]" />
        </button>

        {/* User avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-white">{user?.name?.[0] ?? 'U'}</span>
            </div>
            {user?.name && (
              <span className="hidden sm:block text-xs font-semibold text-[var(--text-primary)] max-w-[80px] truncate">
                {user.name.split(' ')[0]}
              </span>
            )}
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-[var(--shadow-lg)] bg-[var(--bg-surface)] border border-[var(--border)] z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user?.email || 'No email provided'}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-colors font-medium"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); logout(); navigate('/auth/login'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                  >
                    🚪 Log out
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