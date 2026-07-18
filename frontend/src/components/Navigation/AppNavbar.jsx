import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Gauge, Wand2, ScrollText, Layers, Network, SlidersHorizontal,
  Bell, SunMedium, MoonStar, ScanSearch, LogOut, ChevronDown,
  Sparkles, Menu, X, Command
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import MetallicPaint from '@/components/ui/MetallicPaint';


const NAV_LINKS = [
  { to: '/dashboard', icon: Gauge, label: 'Dashboard', end: true },
  { to: '/workflows', icon: Network, label: 'Workflows' },
  { to: '/agents', icon: Wand2, label: 'AI Hub' },
  { to: '/generate', icon: SlidersHorizontal, label: 'Manual Gen' },
  { to: '/documents', icon: ScrollText, label: 'History' },
];

export function AppNavbar() {
  const { theme, toggleTheme, openCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        /* ── Floating Capsule App Navbar ── */
        .me-navbar {
          height: 80px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }
        .me-logo {
          display: flex; align-items: center; gap: 3px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .me-logo:hover {
          opacity: 0.8;
        }
        .me-logo-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
          align-self: flex-end;
          margin-bottom: 8px;
        }
        .logo-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg);
          animation: shine 3s infinite;
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
        
        /* Floating Glassmorphic Capsule */
        .me-capsule-container {
          display: flex;
          align-items: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 9999px;
          padding: 5px 6px 5px 24px;
          gap: 20px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .me-capsule-container:hover {
          border-color: var(--border-mint);
          box-shadow: 0 16px 40px rgba(0, 228, 118, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .me-nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .me-nav-item {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 11px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none; white-space: nowrap;
          transition: all 0.2s ease;
          color: var(--text-muted);
        }
        .me-nav-item:hover {
          color: var(--text-primary);
        }
        .me-nav-item.active {
          color: var(--color-primary);
          background: var(--color-primary-subtle);
        }

        .me-capsule-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          border-left: 1px solid var(--border);
          padding-left: 12px;
          margin-left: 4px;
        }

        .me-icon-btn {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); background: transparent; border: none;
          cursor: pointer; transition: all 0.15s; position: relative;
        }
        .me-icon-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        /* Solid Pill Button */
        .me-user-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--text-primary);
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }
        .me-user-btn:hover {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
          box-shadow: 0 0 15px rgba(0, 228, 118, 0.4);
        }

        .me-dropdown {
          position: absolute; right: 0; top: calc(100% + 12px);
          width: 220px; border-radius: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          overflow: hidden; z-index: 100;
          animation: dropFade 0.15s ease;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .me-dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-surface-el);
        }
        .me-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; font-size: 13px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: var(--text-secondary); cursor: pointer; border: none;
          background: transparent; width: 100%; text-align: left;
          transition: all 0.15s;
        }
        .me-dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .me-dropdown-item.danger { color: var(--color-error); }
        .me-dropdown-item.danger:hover { background: var(--color-error-bg); }
        
        .me-mobile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px); z-index: 200;
        }
        .me-mobile-menu {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          z-index: 201; display: flex; flex-direction: column;
          animation: slideLeft 0.25s ease;
        }
        @keyframes slideLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .me-capsule-container { display: none; }
          .me-mobile-toggle { display: flex !important; }
        }
        .me-mobile-toggle { display: none; }
      `}</style>

      <header className="me-navbar">
        {/* Logo */}
        <Link to="/" className="me-logo">
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>DocuFlow</span>
          <span className="me-logo-dot"></span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', alignSelf: 'flex-start', marginTop: '2px', marginLeft: '2px' }}>AI</span>
        </Link>

        {/* Floating Capsule containing Navigation & Actions */}
        <div className="me-capsule-container">
          {/* Nav links */}
          <nav className="me-nav-links">
            {NAV_LINKS.map(({ to, label, end }) => (
              <motion.div key={to} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => cn('me-nav-item', isActive && 'active')}
                >
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Capsule actions */}
          <div className="me-capsule-actions">
            {/* Search (Icon Only for capsule simplicity) */}
            <button className="me-icon-btn" onClick={openCommandPalette} title="Search (⌘K)">
              <ScanSearch size={14} />
            </button>

            {/* Theme Toggle */}
            <button className="me-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <SunMedium size={14} /> : <MoonStar size={14} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                className="me-icon-btn" 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                title="Notifications" 
                style={{ position: 'relative' }}
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 3, right: 3,
                    minWidth: 12, height: 12, padding: '0 2px',
                    borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, fontWeight: 800,
                    background: 'var(--color-primary)', color: '#001a0b',
                    boxShadow: '0 0 6px var(--color-primary)',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>
          </div>

          {/* User Profile / Account Button OR Login/Sign up */}
          <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    className="me-user-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <span>{user.name ? user.name.split(' ')[0].slice(0,2) : 'US'}</span>
                    <ChevronDown size={10} style={{ opacity: 0.8 }} />
                  </button>
                </motion.div>

                {profileOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setProfileOpen(false)} />
                    <div className="me-dropdown">
                      <div className="me-dropdown-header">
                        <p style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                        }}>
                          {user.name || 'User'}
                        </p>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.03em' }}>
                          {user.email || ''}
                        </p>
                      </div>
                      <div style={{ padding: '6px' }}>
                        <button className="me-dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                          <SlidersHorizontal size={13} /> Settings
                        </button>
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                        <button className="me-dropdown-item danger" onClick={() => { logout(); navigate('/auth/login'); }}>
                          <LogOut size={13} /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <button 
                  className="me-user-btn" 
                  onClick={() => navigate('/auth/login')}
                  style={{ background: 'transparent', border: '1px solid transparent', boxShadow: 'none' }}
                >
                  Login
                </button>
                <button 
                  className="me-user-btn" 
                  onClick={() => navigate('/auth/register')}
                  style={{ background: 'var(--color-primary)', color: '#ffffff', borderColor: 'var(--color-primary)' }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="me-icon-btn me-mobile-toggle" onClick={() => setMobileOpen(true)}>
          <Menu size={17} />
        </button>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <>
          <div className="me-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="me-mobile-menu">
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 6px var(--color-primary)' }} />
                DocuFlow
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            <nav style={{ padding: '10px 8px', flex: 1 }}>
              {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => cn('me-nav-item', isActive && 'active')}
                  style={{ display: 'flex', width: '100%', borderRadius: 8, marginBottom: 4, padding: '10px 14px' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} /> {label}
                </NavLink>
              ))}
            </nav>
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => { logout(); navigate('/auth/login'); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8,
                  border: '1px solid var(--color-error-border)',
                  background: 'var(--color-error-bg)',
                  color: 'var(--color-error)', fontWeight: 600, cursor: 'pointer', fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <LogOut size={13} /> Log out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
