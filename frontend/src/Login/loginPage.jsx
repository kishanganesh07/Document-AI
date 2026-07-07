import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Wand2, Sparkles, BadgeCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import Ballpit from '@/components/ui/Ballpit';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { success, error } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/generate';

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
    <>
      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          background: #F0F2F8;
        }
        .login-left {
          width: 100%;
          max-width: 520px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 56px;
          background: #ffffff;
          box-shadow: 4px 0 40px rgba(108,99,255,0.08);
        }
        .login-right {
          display: none;
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #1a0533 0%, #0f0c29 40%, #0d1b5e 100%);
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .login-right { display: flex; }
        }
        .login-input {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          border: 1.5px solid #E0E4F0;
          border-radius: 10px;
          background: #F6F8FC;
          color: #0D1117;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .login-input:focus { border-color: #6C63FF; }
        .login-input-pw {
          padding-right: 40px;
        }
        .login-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6C63FF 0%, #C026D3 100%);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(108,99,255,0.35);
          transition: all 0.2s;
          margin-top: 4px;
          font-family: inherit;
        }
        .login-btn:disabled {
          background: #9AA3B4;
          box-shadow: none;
          cursor: not-allowed;
        }
        .login-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(108,99,255,0.45);
        }
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="login-root">

        {/* ===== LEFT: Login Form ===== */}
        <div className="login-left">

          {/* Brand */}
          <div style={{ marginBottom: '48px' }}>
            <span style={{
              fontSize: '22px', fontWeight: '800', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #6C63FF 0%, #C026D3 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              DocuFlow
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0D1117', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#5A6478', lineHeight: 1.6 }}>
              Sign in to your workspace and continue creating.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#2D3748' }}>Email Address</label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#2D3748' }}>Password</label>
                <Link to="#" style={{ fontSize: '12px', fontWeight: '600', color: '#6C63FF', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input login-input-pw"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9AA3B4',
                    display: 'flex', alignItems: 'center', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Sign up link */}
          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: '#5A6478' }}>
            Don't have an account?{' '}
            <Link to="/auth/register" style={{ fontWeight: '700', color: '#6C63FF', textDecoration: 'none' }}>
              Start free trial
            </Link>
          </p>

          {/* Footer */}
          <p style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '11px', color: '#9AA3B4', textAlign: 'center' }}>
            © {new Date().getFullYear()} DocuFlow. All rights reserved.
          </p>
        </div>

        {/* ===== RIGHT: Branding Panel ===== */}
        <div className="login-right">
          {/* Ballpit background animation */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.6, zIndex: 0 }}>
            <Ballpit
              count={120}
              gravity={0.4}
              friction={0.82}
              wallBounce={0.95}
              followCursor={true}
              colors={['#6C63FF', '#C026D3', '#22D3EE', '#F7A731', '#00D4AA']}
            />
          </div>

          {/* Gradient depth overlays */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.3) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: 'radial-gradient(ellipse at 80% 80%, rgba(192,38,211,0.25) 0%, transparent 55%)',
          }} />

          {/* Content */}
          <div style={{
            position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px', textAlign: 'center',
          }}>

            {/* Icon badge */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '22px', marginBottom: '28px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <Sparkles size={30} color="white" />
            </div>

            <h2 style={{
              fontSize: '32px', fontWeight: '800', color: 'white',
              letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: 1.2,
            }}>
              Master your<br />workflow
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '300px', lineHeight: 1.7, marginBottom: '36px' }}>
              Automate documents with the power of AI. Intelligent parsing, smart validation, and instant export.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="feature-pill">
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(108,99,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={14} color="white" />
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
