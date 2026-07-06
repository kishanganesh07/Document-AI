import { useState } from 'react';
import { User, Shield, Bell, Key, Moon, Sun, Monitor, Save } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuthStore();
  const { success } = useNotificationStore();

  const handleSave = () => {
    success('Settings saved', 'Your preferences have been updated successfully.');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your personal account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />}>Profile</TabButton>
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />}>Security</TabButton>
          <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={<Moon size={18} />}>Appearance</TabButton>
          <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<Bell size={18} />}>Notifications</TabButton>
          <TabButton active={activeTab === 'api'} onClick={() => setActiveTab('api')} icon={<Key size={18} />}>Developer</TabButton>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'profile' &&
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Profile Information</h2>
                <p className="text-sm text-[var(--text-muted)]">Update your account details and public profile.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-[var(--text-muted)]">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email Address" defaultValue={user?.email} disabled />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button variant="primary" icon={<Save size={16} />} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </div>
          }

          {activeTab === 'appearance' &&
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Appearance</h2>
                <p className="text-sm text-[var(--text-muted)]">Customize the look and feel of your workspace.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] block mb-4">Theme Preference</label>
                  <div className="grid grid-cols-3 gap-4">
                    <ThemeCard icon={<Sun size={24} />} label="Light" active={false} />
                    <ThemeCard icon={<Moon size={24} />} label="Dark" active={true} />
                    <ThemeCard icon={<Monitor size={24} />} label="System" active={false} />
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                  <Button variant="primary" onClick={handleSave}>Apply Theme</Button>
                </div>
              </div>
            </div>
          }

          {/* Placeholders for other tabs to keep it concise but complete enough for navigation */}
          {(activeTab === 'security' || activeTab === 'notifications' || activeTab === 'api') &&
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-8 text-center text-[var(--text-muted)]">
              <p>Advanced configuration for {activeTab} will be available here.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}

function TabButton({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-3 text-left w-full',
        active ?
        'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' :
        'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      )}>
      
      {icon}
      {children}
    </button>);

}

function ThemeCard({ icon, label, active }) {
  return (
    <div className={cn(
      'border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
      active ?
      'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' :
      'border-[var(--border)] bg-[var(--bg-surface-el)] hover:border-[var(--text-muted)] text-[var(--text-secondary)]'
    )}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>);

}