import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Gauge, Wand2, ScrollText, Layers, Network, SlidersHorizontal,
  Bell, SunMedium, MoonStar, ScanSearch, LogOut, ChevronDown,
  Sparkles, Menu, X
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
        .app-navbar {
          height: 56px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 0;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }
        .navbar-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 800; letter-spacing: -0.04em;
          color: var(--color-primary); text-decoration: none;
          padding-right: 20px; margin-right: 4px;
          border-right: 1px solid var(--border);
          white-space: nowrap;
        }
        .navbar-logo-sub { font-size: 9px; font-weight: 600; color: var(--text-xmuted); letter-spacing: 0.1em; text-transform: uppercase; display: block; line-height: 1; }
        .navbar-links {
          display: flex; align-items: center; gap: 2px;
          flex: 1; padding: 0 12px; overflow-x: auto;
        }
        .navbar-links::-webkit-scrollbar { display: none; }
        .nav-item {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          font-size: 13px; font-weight: 500;
          text-decoration: none; white-space: nowrap;
          transition: all 0.15s ease;
          color: var(--text-muted);
          position: relative;
        }
        .nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          color: var(--color-primary);
          background: var(--color-primary-subtle);
          font-weight: 600;
        }
        .nav-item.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 12px; right: 12px;
          height: 2px; border-radius: 2px;
          background: var(--color-primary);
        }
        .navbar-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .nav-icon-btn {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); background: transparent; border: none;
          cursor: pointer; transition: all 0.15s;
          position: relative;
        }
        .nav-icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .nav-search {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 8px;
          border: 1px solid var(--border); background: var(--bg-surface-el);
          cursor: pointer; transition: all 0.15s; height: 34px;
          color: var(--text-xmuted); font-size: 12px;
          min-width: 180px;
        }
        .nav-search:hover { border-color: var(--color-primary); background: var(--bg-hover); }
        .nav-generate-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px;
          background: var(--color-primary);
          color: white; font-size: 12px; font-weight: 700;
          border: none; cursor: pointer; white-space: nowrap;
          transition: all 0.2s; text-decoration: none;
          letter-spacing: -0.01em;
        }
        .nav-generate-btn:hover { background: var(--color-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,70,229,0.35); }
        .nav-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 8px 4px 4px; border-radius: 10px;
          border: 1px solid var(--border); background: transparent;
          cursor: pointer; transition: all 0.15s;
          color: var(--text-primary);
        }
        .nav-user-btn:hover { background: var(--bg-hover); border-color: var(--border-strong); }
        .nav-avatar {
          width: 28px; height: 28px; border-radius: 8px;
          overflow: hidden; flex-shrink: 0;
        }
        .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nav-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 220px; border-radius: 14px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden; z-index: 100;
          animation: dropdownFade 0.15s ease;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--color-primary-subtle), transparent);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); cursor: pointer; border: none;
          background: transparent; width: 100%; text-align: left;
          transition: all 0.15s;
        }
        .dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #ef4444; }
        .mobile-menu-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); z-index: 200;
        }
        .mobile-menu {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
          background: var(--bg-surface); z-index: 201;
          display: flex; flex-direction: column;
          border-right: 1px solid var(--border);
          animation: slideInLeft 0.25s ease;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .kbd {
          display: flex; align-items: center; gap: 2px;
          font-size: 10px; color: var(--text-xmuted);
          background: var(--bg-hover); border: 1px solid var(--border);
          border-radius: 4px; padding: 2px 5px; font-family: monospace;
        }
        @media (max-width: 900px) {
          .navbar-links { display: none; }
          .nav-search { display: none; }
          .nav-generate-btn { display: none; }
        }
      `}</style>

      <header className="app-navbar">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span style={{ fontSize: 18 }}>⚡</span>
          <div>
            <span>DocuFlow</span>
            <span className="navbar-logo-sub">AI Documents</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="navbar-links">
          {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn('nav-item', isActive && 'active')}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Search */}
          <button className="nav-search" onClick={openCommandPalette}>
            <ScanSearch size={13} />
            <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>
            <span className="kbd">⌘K</span>
          </button>

          {/* Generate shortcut */}
          <NavLink to="/generate" className="nav-generate-btn" style={{ marginLeft: 6 }}>
            <Sparkles size={13} />
            Generate
          </NavLink>

          {/* Theme */}
          <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme" style={{ marginLeft: 4 }}>
            {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </button>

          {/* Notifications */}
          <button className="nav-icon-btn" style={{ position: 'relative' }}>
            <Bell size={15} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 6, height: 6, borderRadius: '50%',
              background: '#ef4444',
            }} />
          </button>

          {/* User */}
          <div style={{ position: 'relative', marginLeft: 4 }}>
            <button className="nav-user-btn" onClick={() => setProfileOpen(p => !p)}>
              <div className="nav-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&rounded=true&bold=true`}
                  alt="avatar"
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </button>

            {profileOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setProfileOpen(false)} />
                <div className="nav-dropdown">
                  <div className="dropdown-header">
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email || ''}</p>
                  </div>
                  <div style={{ padding: '6px' }}>
                    <button className="dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                      <SlidersHorizontal size={14} /> Settings
                    </button>
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                    <button className="dropdown-item danger" onClick={() => { logout(); navigate('/auth/login'); }}>
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="nav-icon-btn" style={{ display: 'none' }} onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>DocuFlow</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ padding: '12px 8px', flex: 1 }}>
              {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
                <NavLink key={to} to={to} end={end}
                  className={({ isActive }) => cn('nav-item', isActive && 'active')}
                  style={{ display: 'flex', width: '100%', borderRadius: 10, marginBottom: 4 }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </nav>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => { logout(); navigate('/auth/login'); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
