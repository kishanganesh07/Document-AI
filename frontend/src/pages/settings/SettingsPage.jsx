import { useState } from 'react';
import { User, Shield, Bell, Key, Moon, Sun, Monitor, Save, Camera } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
  { id: 'security', label: 'Security', icon: Shield, emoji: '🔐' },
  { id: 'appearance', label: 'Appearance', icon: Moon, emoji: '🎨' },
  { id: 'notifications', label: 'Notifications', icon: Bell, emoji: '🔔' },
  { id: 'api', label: 'Developer', icon: Key, emoji: '🔑' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuthStore();
  const { success } = useNotificationStore();
  const { theme, setTheme } = useUIStore();

  const handleSave = () => {
    success('Settings saved', 'Your preferences have been updated successfully.');
  };

  return (
    <div className="page-container space-y-7 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Manage your account, appearance, and security preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-2 shadow-[var(--shadow-sm)] flex flex-col gap-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                )}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-2xl">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <h2 className="text-base font-bold text-[var(--text-primary)]">Profile Information</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Update your personal details and avatar.</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors shadow-sm">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'Your Name'}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">{user?.role || 'Member'}</p>
                    <button className="text-xs text-[var(--color-primary)] font-medium mt-1.5 hover:underline">
                      Change avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email Address" defaultValue={user?.email} disabled />
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                  <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-[var(--border)] bg-gradient-to-r from-blue-500/5 to-transparent">
                <h2 className="text-base font-bold text-[var(--text-primary)]">Appearance</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose how DocuFlow looks to you.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-4">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <ThemeCard
                      icon={<Sun size={22} />}
                      label="Light"
                      description="Clean bright workspace"
                      active={theme === 'light'}
                      onClick={() => setTheme('light')}
                    />
                    <ThemeCard
                      icon={<Moon size={22} />}
                      label="Dark"
                      description="Easy on the eyes"
                      active={theme === 'dark'}
                      onClick={() => setTheme('dark')}
                    />
                    <ThemeCard
                      icon={<Monitor size={22} />}
                      label="System"
                      description="Follows your OS"
                      active={theme === 'system'}
                      onClick={() => setTheme('system')}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                  <Button variant="primary" onClick={handleSave}>Apply Appearance</Button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === 'security' || activeTab === 'notifications' || activeTab === 'api') && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] p-12 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface-el)] flex items-center justify-center mx-auto mb-4 text-2xl">
                {TABS.find(t => t.id === activeTab)?.emoji}
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {TABS.find(t => t.id === activeTab)?.label} Settings
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xs mx-auto">
                Advanced configuration for {activeTab} will be available here in the next update.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ThemeCard({ icon, label, description, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center select-none',
        active
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/8 text-[var(--color-primary)] shadow-sm'
          : 'border-[var(--border)] bg-[var(--bg-surface-el)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--text-primary)]'
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-[10px] leading-tight opacity-70">{description}</span>
    </button>
  );
}