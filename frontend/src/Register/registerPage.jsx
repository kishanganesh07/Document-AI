import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { AmbientParticles } from '@/components/Navigation/AppShell';
import Particles from '@/components/ui/Particles';
import MetallicPaint from '@/components/ui/MetallicPaint';


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
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error('Registration failed', err.message || 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const BENEFITS = [
    'Invite unlimited team members',
    'Custom branding and white-labeling',
    'API access for programmatic generation',
    'Enterprise-grade security and compliance'
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0f0c] relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={["#00e476", "#b1ccc3", "#e5c364", "#00ff85"]}
          particleCount={100}
          particleSpread={10}
          speed={0.08}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      {/* Ambient Background */}
      <AmbientParticles />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary-dim)_0%,_transparent_60%)] opacity-25 pointer-events-none" />

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10">
        <div className="anim-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              DocuFlow<span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] inline-block ml-1 shadow-[0_0_10px_var(--color-primary)]"></span>
              <span className="text-xs font-semibold tracking-[0.12em] text-[var(--text-xmuted)] uppercase ml-2 select-none align-super">AI</span>
            </span>
          </div>
        </div>

        <div className="anim-fade-right" style={{ animationDelay: '0.3s' }}>
          <blockquote className="text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight mb-10">
            "Automate your entire document pipeline. Setup takes <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-emerald-300">seconds.</span>"
          </blockquote>
          
          <div className="flex flex-col gap-5">
            {BENEFITS.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-lg text-[var(--text-secondary)] anim-fade-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-[var(--text-muted)] anim-fade-up" style={{ animationDelay: '0.9s' }}>
          © {new Date().getFullYear()} DocuFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right register panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 h-screen overflow-y-auto">
        <div className="w-full max-w-[460px] glass-tile p-10 rounded-3xl border border-[var(--border)] shadow-2xl relative overflow-hidden anim-scale-up my-auto">
          {/* Subtle glow behind form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                DocuFlow<span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] inline-block ml-1 shadow-[0_0_10px_var(--color-primary)]"></span>
                <span className="text-xs font-semibold tracking-[0.12em] text-[var(--text-xmuted)] uppercase ml-2 select-none align-super">AI</span>
              </span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Create workspace</h2>
              <p className="text-[var(--text-secondary)]">Start generating AI-powered documents today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Organization</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-primary)] text-emerald-950 font-bold text-base py-4 rounded-xl shadow-[0_0_20px_var(--color-primary-dim)] hover:shadow-[0_0_30px_var(--color-primary)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold text-[var(--color-primary)] hover:text-emerald-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
