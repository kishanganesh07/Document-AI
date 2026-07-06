import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, Sparkles, LayoutTemplate, Building2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const links = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/generate', icon: <Sparkles size={20} />, label: 'Generate' },
  { to: '/documents', icon: <FileText size={20} />, label: 'Documents' },
  { to: '/templates', icon: <LayoutTemplate size={20} />, label: 'Templates' },
  { to: '/organization', icon: <Building2 size={20} />, label: 'Organization' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }];


  return (
    <aside className={cn(
      'bg-[var(--bg-surface)] border-r border-[var(--border)] transition-all duration-300 flex flex-col',
      sidebarCollapsed ? 'w-[72px]' : 'w-64'
    )}>
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden text-[var(--color-primary)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-sm shadow-[var(--color-primary)]/20">
            <Sparkles size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && <span className="font-bold text-lg tracking-tight whitespace-nowrap text-[var(--text-primary)]">DocuFlow</span>}
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
        {links.map((link) =>
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => cn(
            'flex items-center gap-3 rounded-lg transition-colors overflow-hidden group',
            sidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2.5',
            isActive ?
            'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' :
            'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
          )}
          title={sidebarCollapsed ? link.label : undefined}>
          
            {link.icon}
            {!sidebarCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--border)] shrink-0 flex flex-col gap-2">
        <button
          onClick={() => {
            logout();
            navigate('/auth/login');
          }}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors",
            !sidebarCollapsed && "justify-start px-3 gap-3"
          )}
          title={sidebarCollapsed ? "Log Out" : undefined}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="font-medium whitespace-nowrap">Log Out</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>);

}