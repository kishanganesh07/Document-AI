import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Building2, Users, Key, Copy, Plus, MoreVertical, Shield, X, Check, Eye, EyeOff } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification.store';

function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'sk_live_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export function OrganizationPage() {
  const { organization, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const { success, error } = useNotificationStore();

  // Invite Member modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [members, setMembers] = useState([
    { id: 'u_alice', name: 'Alice Cooper', email: 'alice@docuflow.io', role: 'manager', createdAt: new Date(Date.now() - 864000000).toISOString() }
  ]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production Server Key', key: 'sk_live_' + '*'.repeat(32), created: new Date().toISOString(), used: false }
  ]);
  const [visibleKeys, setVisibleKeys] = useState({});

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    success('Copied to clipboard', 'API Key has been copied.');
  };

  const handleInvite = () => {
    if (!inviteEmail || !inviteName) {
      error('Missing fields', 'Please fill in name and email before sending invite.');
      return;
    }
    const newMember = {
      id: `u_${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      createdAt: new Date().toISOString()
    };
    setMembers((prev) => [...prev, newMember]);
    success('Invite sent!', `An invite has been sent to ${inviteEmail}.`);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('member');
    setShowInviteModal(false);
  };

  const handleGenerateKey = () => {
    const newKey = generateApiKey();
    const keyEntry = {
      id: `key_${Date.now()}`,
      name: `API Key ${apiKeys.length + 1}`,
      key: newKey,
      created: new Date().toISOString(),
      used: false
    };
    setApiKeys((prev) => [...prev, keyEntry]);
    setVisibleKeys((prev) => ({ ...prev, [keyEntry.id]: true }));
    success('API Key generated!', 'Your new key is visible below. Copy it now — it won\'t be shown again.');
  };

  const handleRevokeKey = (id) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    success('Key revoked', 'The API key has been deleted.');
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
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
        {activeTab === 'general' && (
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
                <Button variant="primary" onClick={() => success('Changes saved', 'Organization profile updated successfully.')}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Team Members</h2>
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setShowInviteModal(true)}>Invite Member</Button>
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
                  {/* Current user */}
                  <tr className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user?.name?.charAt(0) || 'U'}
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
                  {/* Dynamic members */}
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] flex items-center justify-center font-bold text-xs shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{m.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{m.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{m.role}</Badge>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{formatDate(m.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="xs" icon={<MoreVertical size={14} />} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">API Keys</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Use these keys to authenticate via the DocuFlow REST API.</p>
              </div>
              <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleGenerateKey}>Generate Key</Button>
            </div>
            <div className="p-6 space-y-4">
              {apiKeys.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)] py-6">No API keys yet. Click "Generate Key" to create one.</p>
              )}
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--text-primary)]">{k.name}</h3>
                      <Badge variant={k.used ? 'default' : 'success'}>{k.used ? 'Used' : 'Never used'}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-[var(--bg-surface-el)] px-2 py-1 rounded border border-[var(--border)] font-mono text-[var(--text-secondary)] max-w-xs truncate">
                        {visibleKeys[k.id] ? k.key : (k.key.startsWith('sk_live_*') ? k.key : 'sk_live_' + '*'.repeat(32))}
                      </code>
                      <button onClick={() => toggleKeyVisibility(k.id)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title={visibleKeys[k.id] ? 'Hide' : 'Reveal'}>
                        {visibleKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => handleCopy(k.key)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Copy">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleRevokeKey(k.id)}>Revoke</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowInviteModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Invite Team Member</h2>
                <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="e.g. Jane Smith" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                <Input label="Email Address" type="email" placeholder="e.g. jane@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-app)] text-[var(--text-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border)]">
                <Button variant="secondary" className="flex-1" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" icon={<Check size={16} />} onClick={handleInvite}>Send Invite</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
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
    </button>
  );
}