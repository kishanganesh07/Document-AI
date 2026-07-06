import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, FileText, Sparkles, LayoutTemplate, Building2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const links = [
  { to: '/generate', icon: <Sparkles size={20} />, label: 'Generate' },
  { to: '/documents', icon: <FileText size={20} />, label: 'Documents' },
  { to: '/templates', icon: <LayoutTemplate size={20} />, label: 'Templates' },
  { to: '/organization', icon: <Building2 size={20} />, label: 'Organization' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }];


  return (
    <aside className={cn(
      'transition-all duration-300 flex flex-col glass m-4 mr-0 rounded-2xl overflow-hidden shadow-lg',
      sidebarCollapsed ? 'w-[72px]' : 'w-64'
    )}>
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)]/40 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden text-[var(--color-primary)]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-ai)] flex items-center justify-center shrink-0 shadow-md shadow-[var(--color-primary)]/20 animate-pulse-slow">
            <Sparkles size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg tracking-tight whitespace-nowrap bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
              DocuFlow
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-y-auto overflow-x-hidden">
        {links.map((link) =>
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => cn(
            'flex items-center gap-3 rounded-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02] active:scale-[0.98]',
            sidebarCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-3',
            isActive ?
            'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white font-medium shadow-md shadow-[var(--color-primary)]/15' :
            'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]/60 hover:text-[var(--text-primary)]'
          )}
          title={sidebarCollapsed ? link.label : undefined}>
          
            <div className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              sidebarCollapsed ? "" : "shrink-0"
            )}>
              {link.icon}
            </div>
            {!sidebarCollapsed && <span className="whitespace-nowrap text-sm">{link.label}</span>}
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--border)]/40 shrink-0 flex flex-col gap-2">
        <button
          onClick={() => {
            logout();
            navigate('/auth/login');
          }}
          className={cn(
            "w-full flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]",
            !sidebarCollapsed && "justify-start px-3.5 gap-3"
          )}
          title={sidebarCollapsed ? "Log Out" : undefined}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="font-medium text-sm whitespace-nowrap">Log Out</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)]/40 hover:text-[var(--text-primary)] transition-colors">
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>);

}