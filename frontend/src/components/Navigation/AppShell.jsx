import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppNavbar } from './AppNavbar';
import { CommandPalette } from '@/components/global/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';
import Particles from '@/components/ui/Particles';

/* ── Ambient floating particles overlay (shared across all app pages) ── */
export function AmbientParticles() {
  return (
    <>
      <style>{`
        .ambient-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          will-change: transform;
        }
        .ambient-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,228,118,0.07) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: orbDrift 20s ease-in-out infinite;
        }
        .ambient-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(177,204,195,0.04) 0%, transparent 70%);
          bottom: 20%; left: -80px;
          animation: orbDrift 25s ease-in-out infinite reverse;
          animation-delay: -8s;
        }
        .ambient-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(0,228,118,0.04) 0%, transparent 70%);
          bottom: -60px; right: 30%;
          animation: floatSlow 18s ease-in-out infinite;
          animation-delay: -4s;
        }
        .particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: #00e476;
          pointer-events: none;
          animation: particleFloat var(--dur) ease-in-out infinite var(--delay);
          opacity: 0;
          --drift: 0px;
        }
      `}</style>
      <div className="ambient-canvas" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        {/* Scattered micro-particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${5 + (i * 5.3) % 92}%`,
              bottom: `${(i * 7) % 40}%`,
              '--dur': `${6 + (i * 1.3) % 8}s`,
              '--delay': `-${(i * 0.7) % 6}s`,
              '--drift': `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}px`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              opacity: 0,
              background: i % 4 === 0 ? '#e5c364' : '#00e476',
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ── Page transition wrapper ── */
function PageTransition({ children, locationKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey}
        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppShell() {
  const location = useLocation();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: 'transparent',
      position: 'relative',
    }}>


      {/* Global background is now handled in App.jsx */}

      {/* Navbar is above the particle layer */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        <AppNavbar />
      </div>

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <PageTransition locationKey={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      {/* Global overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
