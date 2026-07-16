import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Gauge, Wand2, ScrollText, Layers, Network, SlidersHorizontal,
  Bell, SunMedium, MoonStar, ScanSearch, LogOut, ChevronDown,
  Sparkles, Menu, X, Command
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/dashboard', icon: Gauge, label: 'Dashboard', end: true },
  { to: '/generate', icon: Wand2, label: 'Generate' },
  { to: '/documents', icon: ScrollText, label: 'Documents' },
  { to: '/templates', icon: Layers, label: 'Templates' },
  { to: '/organization', icon: Network, label: 'Organization' },
  { to: '/settings', icon: SlidersHorizontal, label: 'Settings' },
];

export function AppNavbar() {
  const { theme, toggleTheme, openCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        /* ── Midnight Emerald App Navbar ── */
        .me-navbar {
          height: 52px;
          background: #191c1e;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 0;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }
        .me-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 800; letter-spacing: -0.04em;
          color: #e0e3e5; text-decoration: none;
          padding-right: 20px;
          border-right: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0; white-space: nowrap;
        }
        .me-logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00e476;
          box-shadow: 0 0 8px rgba(0,228,118,0.8);
          flex-shrink: 0;
        }
        .me-logo-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; font-weight: 500; color: #3b4b3d;
          letter-spacing: 0.1em; text-transform: uppercase;
          display: block; line-height: 1; margin-top: 1px;
        }
        .me-nav-links {
          display: flex; align-items: center; gap: 2px;
          flex: 1; padding: 0 14px; overflow-x: auto;
        }
        .me-nav-links::-webkit-scrollbar { display: none; }
        .me-nav-item {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 6px;
          font-size: 13px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          text-decoration: none; white-space: nowrap;
          transition: all 0.15s ease;
          color: #849584;
          letter-spacing: -0.01em;
          position: relative;
        }
        .me-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #e0e3e5;
        }
        .me-nav-item.active {
          color: #00e476;
          background: rgba(0,228,118,0.08);
        }
        .me-nav-item.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 10px; right: 10px;
          height: 1px; border-radius: 1px;
          background: #00e476;
          box-shadow: 0 0 6px rgba(0,228,118,0.6);
        }
        .me-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
        .me-icon-btn {
          width: 32px; height: 32px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: #849584; background: transparent; border: none;
          cursor: pointer; transition: all 0.15s; position: relative;
        }
        .me-icon-btn:hover {
          background: rgba(255,255,255,0.06);
          color: #e0e3e5;
        }
        .me-search-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(11,15,16,0.6);
          cursor: pointer; height: 32px;
          color: #849584; font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.02em;
          min-width: 160px;
          transition: all 0.2s;
        }
        .me-search-btn:hover {
          border-color: rgba(0,228,118,0.3);
          background: rgba(0,228,118,0.04);
          color: #b9cbb9;
        }
        .me-kbd {
          display: flex; align-items: center; gap: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: #3b4b3d;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px; padding: 2px 5px;
        }
        .me-generate-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 6px;
          background: #00e476; color: #001a0b;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 800;
          border: none; cursor: pointer; white-space: nowrap;
          letter-spacing: -0.01em; text-decoration: none;
          transition: all 0.2s;
          margin-left: 6px;
        }
        .me-generate-btn:hover {
          background: #00ff85;
          box-shadow: 0 0 20px rgba(0,228,118,0.4);
          transform: translateY(-1px);
        }
        .me-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 8px 4px 4px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; cursor: pointer;
          transition: all 0.15s; color: #e0e3e5;
        }
        .me-user-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.14);
        }
        .me-avatar {
          width: 26px; height: 26px; border-radius: 6px;
          overflow: hidden; flex-shrink: 0;
          border: 1px solid rgba(0,228,118,0.2);
        }
        .me-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .me-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 220px; border-radius: 12px;
          background: #1d2022;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 16px 48px rgba(0,0,0,0.6);
          overflow: hidden; z-index: 100;
          animation: dropFade 0.15s ease;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .me-dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,228,118,0.04);
        }
        .me-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; font-size: 13px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: #b9cbb9; cursor: pointer; border: none;
          background: transparent; width: 100%; text-align: left;
          transition: all 0.15s;
        }
        .me-dropdown-item:hover { background: rgba(255,255,255,0.05); color: #e0e3e5; }
        .me-dropdown-item.danger { color: #ffb4ab; }
        .me-dropdown-item.danger:hover { background: rgba(255,180,171,0.08); }
        .me-mobile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px); z-index: 200;
        }
        .me-mobile-menu {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
          background: #1d2022;
          border-right: 1px solid rgba(255,255,255,0.07);
          z-index: 201; display: flex; flex-direction: column;
          animation: slideLeft 0.25s ease;
        }
        @keyframes slideLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .me-nav-links { display: none; }
          .me-search-btn { display: none; }
          .me-generate-btn { display: none; }
          .me-mobile-toggle { display: flex !important; }
        }
        .me-mobile-toggle { display: none; }
      `}</style>

      <header className="me-navbar">
        {/* Logo */}
        <Link to="/dashboard" className="me-logo">
          <div className="me-logo-dot" />
          <div>
            <span>DocuFlow</span>
            <span className="me-logo-sub">AI Documents</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="me-nav-links">
          {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn('me-nav-item', isActive && 'active')}
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="me-actions">
          {/* Search */}
          <button className="me-search-btn" onClick={openCommandPalette}>
            <ScanSearch size={12} />
            <span style={{ flex: 1, textAlign: 'left' }}>search...</span>
            <span className="me-kbd">⌘K</span>
          </button>

          {/* Generate */}
          <NavLink to="/generate" className="me-generate-btn">
            <Sparkles size={12} />
            Generate
          </NavLink>

          {/* Theme */}
          <button className="me-icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <SunMedium size={15} /> : <MoonStar size={15} />}
          </button>

          {/* Notifications */}
          <button className="me-icon-btn" title="Notifications" style={{ position: 'relative' }}>
            <Bell size={14} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 5, height: 5, borderRadius: '50%',
              background: '#00e476', boxShadow: '0 0 6px #00e476',
            }} />
          </button>

          {/* User */}
          <div style={{ position: 'relative', marginLeft: 4 }}>
            <button className="me-user-btn" onClick={() => setProfileOpen(p => !p)}>
              <div className="me-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1d3a2a&color=00e476&rounded=true&bold=true`}
                  alt="avatar"
                />
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12, fontWeight: 600,
                maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: '#b9cbb9',
              }}>
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown size={12} style={{ color: '#849584', flexShrink: 0 }} />
            </button>

            {profileOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setProfileOpen(false)} />
                <div className="me-dropdown">
                  <div className="me-dropdown-header">
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 13, fontWeight: 700, color: '#e0e3e5',
                    }}>
                      {user?.name || 'User'}
                    </p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#849584', marginTop: 3, letterSpacing: '0.03em' }}>
                      {user?.email || ''}
                    </p>
                  </div>
                  <div style={{ padding: '6px' }}>
                    <button className="me-dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                      <SlidersHorizontal size={13} /> Settings
                    </button>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                    <button className="me-dropdown-item danger" onClick={() => { logout(); navigate('/auth/login'); }}>
                      <LogOut size={13} /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="me-icon-btn me-mobile-toggle" onClick={() => setMobileOpen(true)}>
            <Menu size={17} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <>
          <div className="me-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="me-mobile-menu">
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 800, color: '#e0e3e5' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e476', boxShadow: '0 0 6px #00e476' }} />
                DocuFlow
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#849584' }}>
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
            <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => { logout(); navigate('/auth/login'); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8,
                  border: '1px solid rgba(255,180,171,0.15)',
                  background: 'rgba(255,180,171,0.06)',
                  color: '#ffb4ab', fontWeight: 600, cursor: 'pointer', fontSize: 13,
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
