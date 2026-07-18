import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Wand2, Sparkles, BadgeCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { AmbientParticles } from '@/components/Navigation/AppShell';
import Particles from '@/components/ui/Particles';
import MetallicPaint from '@/components/ui/MetallicPaint';


export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { success, error } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!', 'You have been signed in.');
      navigate(from, { replace: true });
    } catch (err) {
      error('Sign in failed', err.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const FEATURES = [
    { icon: Wand2, text: 'AI-powered document generation' },
    { icon: BadgeCheck, text: 'Smart validation & auto-fill' },
    { icon: Zap, text: 'Instant PDF export' },
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-dim)_0%,_transparent_70%)] opacity-25 pointer-events-none" />

      {/* Left panel - Branding (Visible on lg) */}
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
          <h1 className="text-5xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight mb-6">
            Create professional documents <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-emerald-300">instantly.</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-md mb-12">
            Automate your entire document pipeline with the power of AI. Intelligent parsing, smart validation, and instant export.
          </p>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <div key={i} className="glass-tile px-6 py-4 rounded-xl flex items-center gap-4 w-fit border border-[var(--border)] anim-fade-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon size={20} />
                </div>
                <span className="font-medium text-[var(--text-primary)]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-[var(--text-muted)] anim-fade-up" style={{ animationDelay: '0.8s' }}>
          © {new Date().getFullYear()} DocuFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px] glass-tile p-10 rounded-3xl border border-[var(--border)] shadow-2xl relative overflow-hidden anim-scale-up">
          {/* Subtle glow behind form */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[var(--color-primary)]/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                DocuFlow<span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] inline-block ml-1 shadow-[0_0_10px_var(--color-primary)]"></span>
                <span className="text-xs font-semibold tracking-[0.12em] text-[var(--text-xmuted)] uppercase ml-2 select-none align-super">AI</span>
              </span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-3">Welcome back</h2>
              <p className="text-[var(--text-secondary)]">Sign in to your workspace and continue creating.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Password</label>
                  <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:text-emerald-400 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all pr-12"
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
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-semibold text-[var(--color-primary)] hover:text-emerald-400 transition-colors">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
