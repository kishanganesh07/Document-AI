import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuthStore();
  const { success, error } = useNotificationStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !orgName || !password) {
      error('Missing fields', 'Please fill out all fields to register.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, orgName, password);
      success('Workspace created!', 'Welcome to DocuFlow.');
      navigate('/generate', { replace: true });
    } catch (err) {
      error('Registration failed', err.message || 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[var(--bg-surface)] border-r border-[var(--border)] p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-base text-[var(--text-primary)]">DocuFlow</span>
        </div>

        <div>
          <blockquote className="text-2xl font-semibold text-[var(--text-primary)] leading-snug mb-6">
            "Automate your entire document pipeline. Setup takes seconds."
          </blockquote>
          <div className="flex flex-col gap-4 mt-8">
            {[
            'Invite unlimited team members',
            'Custom branding and white-labeling',
            'API access for programmatic generation',
            'Enterprise-grade security and compliance'].
            map((feature, i) =>
            <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                {feature}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)]">
          (C) {new Date().getFullYear()} DocuFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right register panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create workspace</h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">Start generating AI-powered documents today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required />
            
            
            <Input
              label="Organization Name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Corp"
              required />
            

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              required />
            
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)] block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors pr-10"
                  required />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center mt-2"
              disabled={loading}
              iconRight={!loading && <ArrowRight size={16} />}>
              
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>);

}
