import { Outlet } from 'react-router-dom';
import { AppNavbar } from './AppNavbar';
import { CommandPalette } from '@/components/global/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

export function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-app)' }}>
      <AppNavbar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
      {/* Global overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
