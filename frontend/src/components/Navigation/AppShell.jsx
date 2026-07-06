import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from '../Dashboard/Header';
import { CommandPalette } from '@/components/global/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto m-4 glass rounded-2xl p-2 relative shadow-lg">
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>);
}
