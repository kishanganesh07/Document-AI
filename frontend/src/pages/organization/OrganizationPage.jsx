import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Building2, Users, Key, Copy, Plus, MoreVertical, Shield } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification.store';



export function OrganizationPage() {
  const { organization, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const { success } = useNotificationStore();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    success('Copied to clipboard', 'API Key has been copied.');
  };

  if (!organization) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Organization Settings</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your team, billing, and developer integrations.</p>
      </div>

      <div className="flex border-b border-[var(--border)]">
        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Building2 size={16} />}>General</TabButton>
        <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={16} />}>Members</TabButton>
        <TabButton active={activeTab === 'api-keys'} onClick={() => setActiveTab('api-keys')} icon={<Key size={16} />}>API Keys</TabButton>
      </div>

      <div className="pt-4">
        {activeTab === 'general' &&
        <div className="space-y-6 max-w-2xl">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-4">Organization Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Organization Name" defaultValue={organization.name} />
                <Input label="Organization ID" defaultValue={organization._id} readOnly disabled />
              </div>
              
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">Current Plan</label>
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-el)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)] capitalize">{organization.plan} Plan</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Includes all enterprise features and unlimited document generations.</p>
                  </div>
                  <Button variant="outline" size="sm">Manage Billing</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </div>
        }

        {activeTab === 'members' &&
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Team Members</h2>
              <Button variant="primary" size="sm" icon={<Plus size={16} />}>Invite Member</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[var(--bg-surface-el)] text-[var(--text-secondary)] font-medium">
                  <tr>
                    <th className="px-6 py-3">Member</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
                  <tr className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user?.name.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{user?.name} (You)</div>
                        <div className="text-xs text-[var(--text-muted)]">{user?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info"><Shield size={12} className="mr-1 inline" /> {user?.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{formatDate(user?.createdAt || new Date().toISOString())}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="xs" icon={<MoreVertical size={14} />} />
                    </td>
                  </tr>
                  {/* Mock additional user */}
                  <tr className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] flex items-center justify-center font-bold text-xs shrink-0">
                        A
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">Alice Cooper</div>
                        <div className="text-xs text-[var(--text-muted)]">alice@docuflow.io</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">manager</Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{formatDate(new Date(Date.now() - 864000000).toISOString())}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="xs" icon={<MoreVertical size={14} />} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }

        {activeTab === 'api-keys' &&
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">API Keys</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Use these keys to authenticate via the DocuFlow REST API.</p>
              </div>
              <Button variant="primary" size="sm" icon={<Plus size={16} />}>Generate Key</Button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--text-primary)]">Production Server Key</h3>
                    <Badge variant="default">Never used</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs bg-[var(--bg-surface-el)] px-2 py-1 rounded border border-[var(--border)] font-mono text-[var(--text-secondary)]">
                      sk_live_********************************
                    </code>
                    <button onClick={() => handleCopy('sk_live_mock_key')} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Copy">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <Button variant="outline" size="sm">Revoke</Button>
              </div>

            </div>
          </div>
        }
      </div>

    </div>);

}

function TabButton({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-[1px]',
        active ?
        'text-[var(--color-primary)] border-[var(--color-primary)]' :
        'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border)]'
      )}>
      
      {icon}
      {children}
    </button>);

}