import { NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut, Gauge, ScrollText, Wand2, Layers,
  Network, SlidersHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    section: 'Workspace',
    links: [
      { to: '/', icon: Gauge, label: 'Dashboard', end: true },
      { to: '/generate', icon: Wand2, label: 'Generate' },
      { to: '/documents', icon: ScrollText, label: 'Documents' },
      { to: '/templates', icon: Layers, label: 'Templates' },
    ]
  },
  {
    section: 'Organization',
    links: [
      { to: '/organization', icon: Network, label: 'Organization' },
      { to: '/settings', icon: SlidersHorizontal, label: 'Settings' },
    ]
  }
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  return (
    <aside className={cn(
      'bg-[var(--bg-sidebar)] border-r border-[var(--border)] transition-all duration-300 flex flex-col shrink-0',
      sidebarCollapsed ? 'w-[68px]' : 'w-60'
    )}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-sm tracking-tight whitespace-nowrap text-[var(--color-primary)]">
                DocuFlow
              </span>
              <span className="block text-[9px] text-[var(--text-xmuted)] font-medium tracking-widest uppercase leading-none">
                AI Documents
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <span className="font-black text-base text-[var(--color-primary)]">D</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col px-2 overflow-y-auto overflow-x-hidden">
        {NAV_LINKS.map((group, groupIdx) => (
          <div key={group.section} className={cn("flex flex-col gap-0.5", groupIdx > 0 && "mt-6")}>
            {!sidebarCollapsed && (
              <span className="px-3 text-[10px] font-bold tracking-wider text-[var(--text-xmuted)] uppercase mb-1">
                {group.section}
              </span>
            )}
            {sidebarCollapsed && groupIdx > 0 && (
              <div className="w-full h-px bg-[var(--border)] my-2" />
            )}
            {group.links.map((link) => {
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
                      ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  )}
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={cn('shrink-0', isActive ? 'text-[var(--color-primary)]' : '')} />
                      {!sidebarCollapsed && (
                        <span className="whitespace-nowrap text-sm">{link.label}</span>
                      )}
                      {isActive && !sidebarCollapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--border)] shrink-0 space-y-0.5">
        {/* User chip */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-[var(--bg-hover)] border border-[var(--border)]">
              <img src="https://ui-avatars.com/api/?name=Kishan&background=f1f5f9&color=475569&rounded=true&bold=true" alt="Avatar" className="w-full h-full object-cover" />
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