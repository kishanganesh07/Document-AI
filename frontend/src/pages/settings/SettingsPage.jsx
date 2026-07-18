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
  { id: 'appearance', label: 'Appearance', icon: Moon, emoji: '🎨' },
  { id: 'security', label: 'Security', icon: Key, emoji: '🔐' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, changePassword } = useAuthStore();
  const { success, error } = useNotificationStore();
  const { theme, setTheme } = useUIStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSave = () => {
    success('Settings saved', 'Your preferences have been updated successfully.');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      error('Input required', 'All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      error('Password length', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Password mismatch', 'New passwords do not match.');
      return;
    }

    setUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      success('Password Updated', 'Your account password has been successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      error('Update failed', err.message || 'Could not change password.');
    } finally {
      setUpdating(false);
    }
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
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Your personal identity and registration details.</p>
              </div>
              <div className="p-6 space-y-6">
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
          {/* Security */}
          {activeTab === 'security' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-[var(--border)] bg-gradient-to-r from-amber-500/5 to-transparent">
                <h2 className="text-base font-bold text-[var(--text-primary)]">Security</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Secure your account by updating your credentials.</p>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                <div className="space-y-4">
                  <Input 
                    type="password" 
                    label="Current Password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    label="New Password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    label="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                  />
                </div>
                <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={updating}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
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