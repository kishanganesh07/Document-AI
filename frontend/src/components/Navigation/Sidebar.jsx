import { NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, FileText, Sparkles, LayoutTemplate,
  Building2, Settings, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    color: 'text-blue-500',
    activeBg: 'bg-blue-500/10',
    end: true,
  },
  {
    to: '/generate',
    icon: Sparkles,
    label: 'Generate',
    color: 'text-violet-500',
    activeBg: 'bg-violet-500/10',
  },
  {
    to: '/documents',
    icon: FileText,
    label: 'Documents',
    color: 'text-emerald-500',
    activeBg: 'bg-emerald-500/10',
  },
  {
    to: '/templates',
    icon: LayoutTemplate,
    label: 'Templates',
    color: 'text-amber-500',
    activeBg: 'bg-amber-500/10',
  },
  {
    to: '/organization',
    icon: Building2,
    label: 'Organization',
    color: 'text-pink-500',
    activeBg: 'bg-pink-500/10',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    color: 'text-slate-400',
    activeBg: 'bg-slate-500/10',
  },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  return (
    <aside className={cn(
      'bg-[var(--bg-surface)] border-r border-[var(--border)] transition-all duration-300 flex flex-col shrink-0',
      sidebarCollapsed ? 'w-[68px]' : 'w-60'
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-sm tracking-tight whitespace-nowrap text-[var(--text-primary)]">
                DocuFlow
              </span>
              <span className="block text-[9px] text-[var(--text-xmuted)] font-medium tracking-widest uppercase leading-none">
                AI Documents
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-hidden">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg transition-all duration-150 overflow-hidden group relative',
                sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2',
                isActive
                  ? `${link.activeBg} ${link.color} font-semibold`
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              )}
              title={sidebarCollapsed ? link.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={cn('shrink-0', isActive ? link.color : '')} />
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap text-sm">{link.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <span className={cn('ml-auto w-1.5 h-1.5 rounded-full', link.color.replace('text-', 'bg-'))} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--border)] shrink-0 space-y-0.5">
        {/* User chip */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name?.[0] ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-xmuted)] truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => { logout(); navigate('/auth/login'); }}
          className={cn(
            'w-full flex items-center p-2.5 rounded-lg text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all text-sm gap-3',
            !sidebarCollapsed ? 'justify-start' : 'justify-center'
          )}
          title={sidebarCollapsed ? 'Log Out' : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {!sidebarCollapsed && <span className="font-medium">Log Out</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-xmuted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}