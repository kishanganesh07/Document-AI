import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, FileText, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      
      {/* Left login panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-12 xl:p-16">
        
        {/* Top Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="text-[#0d52ff]">
            <FileText size={40} className="opacity-20 absolute" />
            <FileText size={32} strokeWidth={2.5} className="relative z-10" />
          </div>
          <span className="font-bold text-xl text-[#0f172a]">Docu-AI</span>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md mx-auto flex-grow flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0f172a] mb-3">Welcome back</h1>
            <p className="text-[#475569] text-base">Access your intelligent workspace and automate your flow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required 
            />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#334155]">Password</label>
                <Link to="#" className="text-sm font-semibold text-[#0d52ff] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] focus:outline-none focus:border-[#0d52ff] focus:ring-1 focus:ring-[#0d52ff] transition-colors pr-10"
                  required 
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-[#0d52ff] focus:ring-[#0d52ff]" />
              <label htmlFor="remember" className="text-sm text-[#475569]">Remember me for 30 days</label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5 bg-[#0044ff] hover:bg-[#0033cc] text-white text-base font-medium rounded-lg mt-2"
              disabled={loading}
              iconRight={!loading && <ArrowRight size={18} />}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-[#e2e8f0] flex-1"></div>
            <span className="text-sm text-[#64748b]">Or continue with</span>
            <div className="h-px bg-[#e2e8f0] flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-[#cbd5e1] rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium text-[#334155]">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-[#cbd5e1] rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path fill="#f25022" d="M0 0h10v10H0z"/>
                <path fill="#7fba00" d="M11 0h10v10H11z"/>
                <path fill="#00a4ef" d="M0 11h10v10H0z"/>
                <path fill="#ffb900" d="M11 11h10v10H11z"/>
              </svg>
              <span className="text-sm font-medium text-[#334155]">Microsoft</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#475569]">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-semibold text-[#0d52ff] hover:underline">
              Start free trial
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#94a3b8] font-medium text-center lg:text-left mt-8">
          © {new Date().getFullYear()} Docu-AI Inc. All rights reserved.
        </div>
      </div>

      {/* Right branding panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0055FF] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen">
          <Ballpit
            count={150}
            gravity={0.5}
            friction={0.8}
            wallBounce={0.95}
            followCursor={true}
            colors={['#ffffff', '#93c5fd', '#3b82f6']}
          />
        </div>
        
        {/* Floating Abstract Cards/UI removed */}
        <div className="relative z-10 flex-grow" />

        {/* Text Content */}
        <div className="relative z-30 flex flex-col items-center text-center mt-auto pb-12 pt-16">
          <h2 className="text-3xl font-bold mb-4">Master your workflow</h2>
          <p className="text-blue-100 text-sm max-w-[400px] leading-relaxed">
            Automate your documents with the power of AI. From intelligent parsing to automated verification, work smarter, not harder.
          </p>
        </div>

        {/* Bottom Right Icons */}
        <div className="absolute bottom-8 right-8 flex gap-3 opacity-60">
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={18} />
          </div>
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
            <Shield size={18} />
          </div>
        </div>

      </div>
    </div>
  );
}
