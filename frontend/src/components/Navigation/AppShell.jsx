import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from '../Dashboard/Header';
import { CommandPalette } from '@/components/global/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-app">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>);
}
