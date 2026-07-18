import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Wand2, FileText, Layers, ShieldCheck, Zap, Users,
  ArrowRight, CheckCircle, Download, Sparkles, Bot, FileCheck,
  BarChart3, Globe, Lock, ChevronRight, Terminal, SunMedium, MoonStar
} from 'lucide-react';
import MetallicPaint from '@/components/ui/MetallicPaint';
import { useUIStore } from '@/stores/ui.store';



/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || typeof target !== 'number') return;
    let startTime = null;
    const tick = (now) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, start]);
  return count;
}

function useMouseParallax(strength = 20) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      const x = ((e.clientX / w) - 0.5) * strength;
      const y = ((e.clientY / h) - 0.5) * strength;
      setOffset({ x, y });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength]);
  return [ref, offset];
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const DOC_TYPES = ['Invoice', 'Offer Letter', 'Certificate', 'Quotation', 'Report', 'Resume'];

const FEATURES = [
  { icon: Bot, title: 'AI Document Generation', desc: 'Describe any document in plain language. LLM extracts entities, relationships, and industry standards to craft perfect documents in seconds.', accent: 'var(--color-primary)', tag: 'CORE', wide: true },
  { icon: ShieldCheck, title: 'QR Verification', desc: 'Every PDF generated carries a unique QR code for instant authenticity verification by any recipient.', accent: 'var(--color-primary)', tag: 'TRUST' },
  { icon: Layers, title: 'Template Library', desc: 'Access 100+ pre-verified templates for HR, Finance, and Legal. Customised to your brand identity automatically.', accent: '#e5c364', tag: 'LIBRARY' },
  { icon: FileCheck, title: 'Smart Auto-fill', desc: 'Sync with your CRM to automatically populate fields across contracts with own internal data.', accent: '#b1ccc3', tag: 'SMART', wide: true },
  { icon: BarChart3, title: 'Analytics & Insights', desc: 'Track document creation velocity, approval rates, and team productivity in real time.', accent: '#e5c364', tag: 'ANALYTICS', wide: true },
  { icon: Globe, title: 'Multi-language Export', desc: 'Generate documents in 40+ languages. Auto-detect locale from client data and apply formatting.', accent: '#b1ccc3', tag: 'GLOBAL' },
];

const STEPS = [
  { num: '01', icon: Terminal, title: 'Structural Analysis', desc: 'Breaking down the input into semantic components: entities, attributes, and their aliases.', accent: 'var(--color-primary)', tag: 'NATURAL_LANGUAGE_INPUT' },
  { num: '02', icon: Lock, title: 'Compliance Engine', desc: 'Cross-referencing with legal and fiscal jurisdiction-specific company policy guidelines.', accent: '#e5c364', tag: 'VALIDATION_LAYER' },
  { num: '03', icon: FileCheck, title: 'Semantic Styling', desc: 'Mapping the structured data to your brand specific typography and professional layout.', accent: '#b1ccc3', tag: 'GENERATION_OUTPUT' },
];

const STATS = [
  { value: 10000, display: '10,000+', label: 'Documents Generated' },
  { value: 6, display: '6', label: 'Document Types' },
  { value: 100, display: '100%', label: 'AI-Validated' },
  { value: 5, display: '<5s', label: 'Avg Generation' },
];

const DEMO_LINES = [
  { t: 300,  text: '> Parsing input query...', color: 'var(--text-xmuted)' },
  { t: 700,  text: 'ENTITY: client_name = "Acme Tech"', color: 'var(--color-primary)' },
  { t: 1050, text: 'ENTITY: amount = ₹45,000', color: 'var(--color-primary)' },
  { t: 1350, text: 'ENTITY: due_date = "Aug 15"', color: 'var(--color-primary)' },
  { t: 1700, text: 'FIELD: gst_18% = ₹8,100', color: '#e5c364' },
  { t: 2100, text: 'COMPLIANCE: GST_ACT_2017 ✓', color: '#b1ccc3' },
  { t: 2500, text: 'CONFIDENCE_SCORE: 97.4%', color: 'var(--color-primary-hover)' },
  { t: 2900, text: '✓ Invoice ready — exporting PDF...', color: 'var(--color-primary)' },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % DOC_TYPES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      key={idx}
      style={{
        display: 'inline-block',
        color: 'var(--color-primary)',
        fontStyle: 'italic',
        animation: 'wordFadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        textShadow: '0 0 40px rgba(0,228,118,0.4)',
      }}
    >
      {DOC_TYPES[idx]}
    </span>
  );
}

function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [cursor, setCursor] = useState(true);
  const timersRef = useRef([]);

  useEffect(() => {
    const startLoop = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setVisibleLines([]);

      // Schedule each line to slide in
      DEMO_LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
        }, line.t);
        timersRef.current.push(t);
      });

      // Restart after last line + 1.5s pause
      const lastT = DEMO_LINES[DEMO_LINES.length - 1].t + 1500;
      const restart = setTimeout(startLoop, lastT);
      timersRef.current.push(restart);
    };

    startLoop();
    const blink = setInterval(() => setCursor(c => !c), 530);

    return () => {
      timersRef.current.forEach(clearTimeout);
      clearInterval(blink);
    };
  }, []);

  return (
    <div style={{
      background: 'var(--bg-deep)',
      border: '1px solid var(--color-success-bg)',
      borderRadius: 14, padding: '18px 20px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11.5, minHeight: 210,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ marginLeft: 10, color: 'var(--text-xmuted)', fontSize: 10, letterSpacing: '0.06em' }}>docuflow — ai-engine v2.4</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {DEMO_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color,
              opacity: visibleLines.includes(i) ? 1 : 0,
              transform: visibleLines.includes(i) ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              letterSpacing: '0.02em',
            }}
          >
            {line.text}
          </div>
        ))}
        <span style={{
          display: 'inline-block', width: 7, height: 14,
          background: 'var(--color-primary)', borderRadius: 1,
          opacity: cursor ? 1 : 0,
          transition: 'opacity 0.1s',
          boxShadow: '0 0 8px rgba(0,228,118,0.8)',
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats section with count-up
───────────────────────────────────────────── */
function StatsBar() {
  const [ref, visible] = useScrollReveal(0.3);
  const counts = [
    useCountUp(10000, 2000, visible),
    useCountUp(6, 800, visible),
    useCountUp(100, 1200, visible),
    useCountUp(5, 600, visible),
  ];

  const display = (stat, count) => {
    if (stat.display.includes('+')) return count.toLocaleString() + '+';
    if (stat.display.includes('%')) return count + '%';
    if (stat.display.includes('<')) return '<' + count + 's';
    return count;
  };

  return (
    <div ref={ref} className="lp-stats-bar">
      <div className="lp-stats-inner">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="lp-stat-item"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.6s ease ${0.1 * i}s, transform 0.6s ease ${0.1 * i}s`,
            }}
          >
            <div className="lp-stat-val">{visible ? display(s, counts[i]) : '0'}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Bento feature card with reveal
───────────────────────────────────────────── */
function FeatureCard({ feature, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`lp-bento-card${feature.wide ? ' wide' : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      <div className="lp-bento-tag" style={{ color: feature.accent + 'aa' }}>{feature.tag}</div>
      <div className="lp-bento-icon" style={{ borderColor: feature.accent + '25' }}>
        <feature.icon size={20} style={{ color: feature.accent }} />
      </div>
      <div className="lp-bento-title">{feature.title}</div>
      <div className="lp-bento-desc">{feature.desc}</div>
      {feature.wide && (
        <Link to="/auth/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13, fontWeight: 700, color: 'var(--color-primary)',
          textDecoration: 'none', letterSpacing: '-0.01em',
          transition: 'gap 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.gap = '10px'}
          onMouseLeave={e => e.currentTarget.style.gap = '6px'}
        >
          Browse library <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Landing Page
───────────────────────────────────────────── */
export function LandingPage() {
  const { theme, toggleTheme } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [, parallaxOffset] = useMouseParallax(14);
  const [heroRef, heroVisible] = useScrollReveal(0.01);
  const [stepsRef, stepsVisible] = useScrollReveal(0.1);
  const [ctaRef, ctaVisible] = useScrollReveal(0.2);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════
           LANDING PAGE — MIDNIGHT EMERALD + ANIMATIONS
        ═══════════════════════════════════════════ */
        .lp-root {
          min-height: 100vh;
          background: var(--bg-app);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Floating particle background */
        .lp-particle-bg {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .lp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; will-change: transform;
        }
        .lp-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, var(--color-primary-subtle) 0%, transparent 70%);
          top: -150px; right: -150px;
          animation: orbDrift 22s ease-in-out infinite;
        }
        .lp-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, var(--color-info-bg) 0%, transparent 70%);
          bottom: 10%; left: -120px;
          animation: orbDrift 28s ease-in-out infinite reverse;
          animation-delay: -10s;
        }
        .lp-orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, var(--color-warning-bg) 0%, transparent 70%);
          top: 40%; left: 40%;
          animation: floatSlow 20s ease-in-out infinite;
          animation-delay: -5s;
        }
        .lp-particle {
          position: absolute; border-radius: 50%;
          pointer-events: none;
          animation: particleFloat var(--dur) ease-in-out infinite var(--delay);
          opacity: 0; --drift: 0px;
        }

        /* ── Navbar ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.4s ease, backdrop-filter 0.4s ease,
                      border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .lp-nav.scrolled {
          background: var(--glass-bg);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .lp-nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 18px 32px;
          display: flex; align-items: center; justify-content: space-between;
          animation: fadeDown 0.6s ease 0.05s both;
        }
        .lp-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 800; letter-spacing: -0.04em;
          color: var(--text-primary); text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          transition: color 0.2s;
        }
        .lp-logo:hover { color: var(--color-primary); }
        .lp-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-primary); box-shadow: 0 0 10px var(--color-primary);
          animation: mintPulse 2s ease-in-out infinite;
        }
        .lp-nav-links {
          display: flex; align-items: center; gap: 32px;
          animation: fadeDown 0.6s ease 0.1s both;
        }
        .lp-nav-link {
          font-size: 13px; font-weight: 500; color: var(--text-muted);
          text-decoration: none; letter-spacing: 0.01em;
          transition: color 0.2s, transform 0.2s;
          position: relative;
        }
        .lp-nav-link::after {
          content: ''; position: absolute; bottom: -3px; left: 0; right: 0;
          height: 1px; background: var(--color-primary); transform: scaleX(0);
          transition: transform 0.25s ease; transform-origin: left;
        }
        .lp-nav-link:hover { color: var(--text-primary); transform: translateY(-1px); }
        .lp-nav-link:hover::after { transform: scaleX(1); }
        .lp-cta-nav {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 6px;
          background: var(--color-primary); color: var(--bg-app);
          font-size: 13px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .lp-cta-nav::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.2s;
        }
        .lp-cta-nav:hover {
          background: var(--color-primary-hover);
          box-shadow: 0 0 24px rgba(0,228,118,0.5);
          transform: translateY(-2px) scale(1.03);
        }
        .lp-cta-nav:hover::after { opacity: 1; }
        .lp-cta-nav:active { transform: translateY(0) scale(1); }

        /* ── Hero ── */
        .lp-hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 60px;
          max-width: 1280px; margin: 0 auto;
          padding: 120px 32px 80px;
          position: relative; z-index: 1;
        }
        .lp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          background: var(--color-primary-subtle);
          border: 1px solid var(--color-primary-border, var(--border-mint));
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; color: var(--color-primary);
          letter-spacing: 0.05em; width: fit-content;
          animation: scaleInBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .lp-hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-primary); box-shadow: 0 0 8px var(--color-primary);
          position: relative;
          animation: neonFlicker 4s ease-in-out infinite;
        }
        .lp-hero-badge-dot::after {
          content: '';
          position: absolute; inset: -3px; border-radius: 50%;
          background: rgba(0,228,118,0.3);
          animation: dotPulseRing 2s ease-out infinite;
        }
        .lp-hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(40px, 5.5vw, 72px);
          font-weight: 700; letter-spacing: -0.03em;
          line-height: 1.1; color: var(--text-primary);
          margin: 24px 0 24px;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .lp-hero-sub {
          font-size: 17px; color: var(--text-muted); line-height: 1.7;
          max-width: 480px; margin-bottom: 40px;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.45s both;
        }
        .lp-hero-ctas {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.6s both;
        }
        .lp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 8px;
          background: var(--color-primary); color: var(--bg-app);
          font-size: 15px; font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none; border: none; cursor: pointer;
          letter-spacing: -0.01em;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .lp-btn-primary::before {
          content: '';
          position: absolute; top: 0; bottom: 0;
          left: -60px; width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-15deg);
        }
        .lp-btn-primary:hover::before { animation: mintBeam 0.6s ease forwards; }
        .lp-btn-primary:hover {
          background: var(--color-primary-hover);
          box-shadow: 0 0 40px rgba(0,228,118,0.5);
          transform: translateY(-3px) scale(1.02);
        }
        .lp-btn-primary:active { transform: translateY(0) scale(1); }
        .lp-btn-primary .btn-arrow {
          transition: transform 0.2s ease;
        }
        .lp-btn-primary:hover .btn-arrow { transform: translateX(4px); }

        .lp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 8px;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-primary); font-size: 15px; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.25s ease;
        }
        .lp-btn-ghost:hover {
          background: var(--border);
          border-color: var(--border-mint);
          transform: translateY(-2px);
        }

        /* Hero right card */
        .lp-hero-right {
          position: relative;
          animation: fadeLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both;
        }
        .lp-hero-glass {
          background: var(--glass-bg);
          border: 1px solid var(--border);
          border-radius: 20px; padding: 28px;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease;
          will-change: transform;
        }
        .lp-hero-glass:hover {
          border-color: var(--color-primary-border, var(--border-mint));
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 50px var(--color-primary-subtle);
        }
        .lp-doc-mini {
          background: var(--bg-deep);
          border: 1px solid var(--border);
          border-radius: 10px; padding: 16px 18px; margin-top: 16px;
          transition: border-color 0.3s;
        }
        .lp-hero-glass:hover .lp-doc-mini {
          border-color: var(--color-success-bg);
        }

        /* ── Stats bar ── */
        .lp-stats-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--bg-surface-el);
          position: relative; z-index: 1;
        }
        .lp-stats-bar::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, var(--color-primary-subtle), transparent);
          animation: gradientShift 6s ease infinite;
          background-size: 200% 100%;
        }
        .lp-stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          position: relative; z-index: 1;
        }
        .lp-stat-item {
          padding: 36px 24px; text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.3s;
        }
        .lp-stat-item:last-child { border-right: none; }
        .lp-stat-item:hover { background: var(--color-primary-subtle); }
        .lp-stat-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; letter-spacing: -0.05em;
          color: var(--text-primary); line-height: 1; margin-bottom: 8px;
          transition: color 0.3s;
        }
        .lp-stat-item:hover .lp-stat-val { color: var(--color-primary); }
        .lp-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          color: var(--text-muted); text-transform: uppercase;
        }

        /* ── Sections ── */
        .lp-section { padding: 96px 32px; max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
        .lp-section-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          color: var(--color-primary); text-transform: uppercase; margin-bottom: 14px;
        }
        .lp-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 700; letter-spacing: -0.03em;
          line-height: 1.15; color: var(--text-primary); margin-bottom: 16px;
        }
        .lp-section-title em { font-style: normal; color: var(--color-primary); }
        .lp-section-sub { font-size: 16px; color: var(--text-muted); line-height: 1.7; max-width: 500px; }

        /* ── Bento grid ── */
        .lp-bento-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          margin-top: 56px;
        }
        .lp-bento-card {
          background: var(--bg-surface); padding: 32px 28px;
          transition: background 0.3s ease, transform 0.3s ease;
          position: relative; overflow: hidden; cursor: default;
        }
        .lp-bento-card.wide { grid-column: span 2; }
        .lp-bento-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: transparent; transition: background 0.3s ease;
        }
        .lp-bento-card::after {
          content: '';
          position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 50%, var(--color-primary-subtle) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .lp-bento-card:hover { background: #242729; }
        .lp-bento-card:hover::before {
          background: linear-gradient(90deg, transparent, rgba(0,228,118,0.4), transparent);
        }
        .lp-bento-card:hover::after { opacity: 1; }
        .lp-bento-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; border: 1px solid;
          background: rgba(255,255,255,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .lp-bento-card:hover .lp-bento-icon {
          transform: scale(1.12) rotate(-3deg);
        }
        .lp-bento-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .lp-bento-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--text-primary); margin-bottom: 10px; letter-spacing: -0.02em;
          transition: color 0.2s;
        }
        .lp-bento-card:hover .lp-bento-title { color: var(--color-primary); }
        .lp-bento-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

        /* ── AI Steps ── */
        .lp-ai-section {
          padding: 96px 32px; position: relative; z-index: 1;
          background: var(--bg-surface-el);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .lp-ai-inner { max-width: 1280px; margin: 0 auto; }
        .lp-ai-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: start; margin-top: 56px;
        }
        .lp-ai-step {
          display: flex; gap: 20px;
          padding: 20px 0; border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .lp-ai-step:last-child { border-bottom: none; }
        .lp-ai-step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--text-xmuted);
          letter-spacing: 0.05em; flex-shrink: 0; padding-top: 2px;
          transition: color 0.3s;
        }
        .lp-ai-step:hover .lp-ai-step-num { color: var(--text-muted); }
        .lp-ai-step-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          margin-bottom: 6px; text-transform: uppercase;
        }
        .lp-ai-step-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.02em;
          transition: color 0.2s;
        }
        .lp-ai-step:hover .lp-ai-step-title { color: var(--color-primary); }
        .lp-ai-step-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

        /* ── CTA ── */
        .lp-cta-section {
          padding: 96px 32px; text-align: center;
          position: relative; z-index: 1; overflow: hidden;
        }
        .lp-cta-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 100%, rgba(0,228,118,0.1) 0%, transparent 60%);
        }
        .lp-cta-card {
          max-width: 680px; margin: 0 auto;
          padding: 64px 48px;
          background: var(--glass-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          position: relative; z-index: 1;
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
        }
        .lp-cta-card:hover {
          border-color: var(--color-primary-border, var(--border-mint));
          box-shadow: 0 0 60px var(--color-primary-subtle);
          transform: translateY(-4px);
        }
        .lp-cta-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; letter-spacing: -0.04em;
          color: var(--text-primary); margin-bottom: 16px; line-height: 1.15;
        }
        .lp-cta-title em { font-style: normal; color: var(--color-primary); }

        /* ── Footer ── */
        .lp-footer {
          padding: 32px 32px;
          border-top: 1px solid var(--border);
          position: relative; z-index: 1;
        }
        .lp-footer-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .lp-footer-link {
          font-size: 12px; color: var(--text-muted); text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          display: inline-block;
        }
        .lp-footer-link:hover { color: var(--color-primary); transform: translateY(-1px); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .lp-hero { grid-template-columns: 1fr; padding: 100px 20px 60px; gap: 40px; }
          .lp-hero-right { display: none; }
          .lp-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .lp-stat-item:nth-child(2) { border-right: none; }
          .lp-bento-grid { grid-template-columns: 1fr; }
          .lp-bento-card.wide { grid-column: span 1; }
          .lp-ai-grid { grid-template-columns: 1fr; gap: 40px; }
          .lp-cta-card { padding: 40px 24px; }
          .lp-nav-links { display: none; }
          .lp-section { padding: 64px 20px; }
          .lp-ai-section { padding: 64px 20px; }
          .lp-cta-section { padding: 64px 20px; }
        }
      `}</style>

      <div className="lp-root">
        {/* Global background is now handled in App.jsx */}

        {/* ── Particle background ── */}
        <div className="lp-particle-bg" aria-hidden="true">
          <div className="lp-orb lp-orb-1" />
          <div className="lp-orb lp-orb-2" />
          <div className="lp-orb lp-orb-3" />
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="lp-particle" style={{
              left: `${5 + (i * 4.3) % 90}%`,
              bottom: `${(i * 7) % 45}%`,
              '--dur': `${7 + (i * 1.1) % 7}s`,
              '--delay': `-${(i * 0.8) % 7}s`,
              '--drift': `${(i % 2 === 0 ? 1 : -1) * (10 + i * 4)}px`,
              width: i % 4 === 0 ? '3px' : '2px',
              height: i % 4 === 0 ? '3px' : '2px',
              background: i % 5 === 0 ? '#e5c364' : i % 3 === 0 ? '#b1ccc3' : 'var(--color-primary)',
              boxShadow: i % 3 === 0 ? '0 0 6px var(--color-primary)' : 'none',
            }} />
          ))}
        </div>

        {/* ══════ NAVBAR ══════ */}
        <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="lp-nav-inner">
            <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>DocuFlow</span>
              <span className="lp-logo-dot" style={{ width: '6px', height: '6px', alignSelf: 'flex-end', marginBottom: '8px' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', alignSelf: 'flex-start', marginTop: '2px', marginLeft: '2px' }}>AI</span>
            </Link>
            <div className="lp-nav-links">
              <a href="#features" className="lp-nav-link">Features</a>
              <a href="#how-it-works" className="lp-nav-link">How the AI Thinks</a>
              <Link to="/about" className="lp-nav-link">About</Link>
              <Link to="/auth/login" className="lp-nav-link">Sign In</Link>
              <button 
                onClick={toggleTheme} 
                className="lp-theme-btn" 
                title="Toggle Theme"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: 'transparent', 
                  border: '1px solid var(--border)', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s',
                  marginLeft: 8,
                  marginRight: 8
                }}
              >
                {theme === 'dark' ? <MoonStar size={14} /> : <SunMedium size={14} />}
              </button>
              <Link to="/auth/register" className="lp-cta-nav">
                Get Started <ArrowRight size={13} className="btn-arrow" />
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════ HERO ══════ */}
        <div ref={heroRef}>
          <div className="lp-hero">
            {/* Left */}
            <div>
              <div className="lp-hero-badge">
                <div className="lp-hero-badge-dot" />
                AI_DOCUMENT_INTELLIGENCE — V2.4
              </div>

              <h1 className="lp-hero-title">
                Generate any<br />
                <AnimatedWord /><br />
                in seconds
              </h1>

              <p className="lp-hero-sub">
                Describe your document in natural language. DocuFlow's AI extracts
                entities, validates against regulations, and exports a perfect PDF instantly.
              </p>

              <div className="lp-hero-ctas">
                <Link to="/auth/register" className="lp-btn-primary">
                  Start for free <ArrowRight size={16} className="btn-arrow" />
                </Link>
                <Link to="/auth/login" className="lp-btn-ghost">
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right — parallax glass card */}
            <div className="lp-hero-right">
              <div
                className="lp-hero-glass"
                style={{
                  transform: `perspective(1000px) rotateY(${parallaxOffset.x * 0.4}deg) rotateX(${-parallaxOffset.y * 0.3}deg) translateZ(0)`,
                  transition: 'transform 0.1s ease-out, border-color 0.4s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    AI Processing
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--color-primary)', letterSpacing: '0.05em', animation: 'neonFlicker 5s ease-in-out infinite' }}>● LIVE</span>
                </div>
                <LiveTerminal />
                <div className="lp-doc-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-xmuted)', marginBottom: 4 }}>INVOICE / INV-2024-0847</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Acme Technologies</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-xmuted)', marginBottom: 4 }}>TOTAL</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', animation: 'mintPulse 3s ease-in-out infinite' }}>₹53,100</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 8px var(--color-primary)', animation: 'mintPulse 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                      CONFIDENCE: 97.4% — QR VERIFIED
                    </span>
                  </div>
                </div>
              </div>
              {/* Ambient glow behind card */}
              <div style={{
                position: 'absolute', bottom: -40, left: '10%', right: '10%',
                height: 80, background: 'var(--color-primary-subtle)',
                filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none',
                animation: 'orbPulse 4s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>

        {/* ══════ STATS (count-up) ══════ */}
        <StatsBar />

        {/* ══════ FEATURES ══════ */}
        <section className="lp-section" id="features">
          <div
            className="reveal"
            ref={el => {
              if (!el) return;
              const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } }, { threshold: 0.1 });
              obs.observe(el);
            }}
          >
            <div className="lp-section-tag">// CAPABILITIES</div>
            <h2 className="lp-section-title">
              Everything you need to<br /><em>automate</em> documents
            </h2>
            <p className="lp-section-sub">
              From idea to pixel-perfect PDF, our proprietary model handles the full lifecycle with surgical precision.
            </p>
          </div>

          <div className="lp-bento-grid">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} delay={i * 0.07} />
            ))}
          </div>
        </section>

        {/* ══════ HOW AI THINKS ══════ */}
        <div className="lp-ai-section" id="how-it-works">
          <div className="lp-ai-inner">
            <div ref={stepsRef}>
              <div
                className="lp-section-tag"
                style={{
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease',
                }}
              >// PROCESS</div>
              <h2
                className="lp-section-title"
                style={{
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease 0.1s',
                }}
              >
                How the AI <em>"Thinks"</em>
              </h2>
              <p
                className="lp-section-sub"
                style={{
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease 0.2s',
                }}
              >
                DocuFlow doesn't just generate text. It analyzes complex structures to ensure real-time accuracy.
              </p>
            </div>

            <div className="lp-ai-grid">
              {/* Steps */}
              <div>
                {STEPS.map((s, i) => (
                  <div
                    key={s.num}
                    className="lp-ai-step"
                    style={{
                      opacity: stepsVisible ? 1 : 0,
                      transform: stepsVisible ? 'translateX(0)' : 'translateX(-24px)',
                      transition: `opacity 0.6s ease ${0.3 + i * 0.12}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.12}s`,
                    }}
                  >
                    <div className="lp-ai-step-num">{s.num}</div>
                    <div>
                      <div className="lp-ai-step-tag" style={{ color: s.accent }}>{s.tag}</div>
                      <div className="lp-ai-step-title">{s.title}</div>
                      <div className="lp-ai-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal panel */}
              <div style={{
                opacity: stepsVisible ? 1 : 0,
                transform: stepsVisible ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s',
              }}>
                <div style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--color-success-bg)',
                  borderRadius: 16, overflow: 'hidden',
                  transition: 'border-color 0.3s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,228,118,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-success-bg)'}
                >
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-xmuted)', letterSpacing: '0.06em' }}>● AI_REAL_TIME_PROCESSING</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    {[
                      { label: 'PARSING', val: 'INVOICE_STANDARD_IND', color: 'var(--color-primary)' },
                      { label: 'ENTITY', val: 'ACME_TECHNOLOGIES_LTD', color: 'var(--color-primary)' },
                      { label: 'COMPLIANCE', val: 'GST_ACT_2017 ✓', color: '#b1ccc3' },
                      { label: 'CONFIDENCE', val: '97.4%', color: 'var(--color-primary-hover)' },
                      { label: 'GENERATION_LATENCY', val: '2.3s', color: '#e5c364' },
                    ].map((row, ri) => (
                      <div
                        key={row.label}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 0', borderBottom: '1px solid var(--border)',
                          fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                          opacity: stepsVisible ? 1 : 0,
                          transition: `opacity 0.4s ease ${0.6 + ri * 0.1}s`,
                        }}
                      >
                        <span style={{ color: 'var(--text-xmuted)', letterSpacing: '0.04em' }}>{row.label}</span>
                        <span style={{ color: row.color, letterSpacing: '0.02em' }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ CTA ══════ */}
        <section className="lp-cta-section">
          <div className="lp-cta-glow" />
          <div
            ref={ctaRef}
            className="lp-cta-card"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
              transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-primary-border, var(--border-mint))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <Wand2 size={22} style={{ color: 'var(--color-primary)' }} />
            </div>

            <h2 className="lp-cta-title">
              Ready to <em>evolve</em><br />your workflow?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7 }}>
              Join over 2,000+ teams already using DocuFlow to generate documents 3× faster with AI.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth/register" className="lp-btn-primary">
                Get Started Free <ArrowRight size={16} className="btn-arrow" />
              </Link>
              <Link to="/auth/login" className="lp-btn-ghost">Schedule Demo</Link>
            </div>

            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              {['No credit card', 'GDPR Compliant', 'SOC Certified'].map((t, i) => (
                <div
                  key={t}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em',
                    opacity: ctaVisible ? 1 : 0,
                    transition: `opacity 0.5s ease ${0.3 + i * 0.1}s`,
                  }}
                >
                  <CheckCircle size={12} style={{ color: 'var(--color-primary)' }} />
                  {t.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ FOOTER ══════ */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-success-bg)', boxShadow: '0 0 15px var(--color-primary-subtle)' }}>
                  <MetallicPaint
                    imageSrc="/logo-black.png"
                    seed={42}
                    scale={4}
                    patternSharpness={1.2}
                    noiseScale={0.3}
                    speed={0.4}
                    liquid={0.6}
                    mouseAnimation={false}
                    brightness={1.6}
                    contrast={0.9}
                    refraction={0.02}
                    blur={0.008}
                    chromaticSpread={1.5}
                    fresnel={0.8}
                    angle={45}
                    waveAmplitude={0.8}
                    distortion={0.3}
                    contour={0.4}
                    lightColor="#ffffff"
                    darkColor="#031405"
                    tintColor="var(--color-primary)"
                  />
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-xmuted)', letterSpacing: '0.04em' }}>
                © {new Date().getFullYear()} DocuFlow. AI Secure Document Intelligence.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['FEATURES', 'ABOUT US', 'PRIVACY POLICY', 'TERMS OF SERVICE', 'APP LOGIN'].map(l => (
                <Link 
                  key={l} 
                  to={l === 'ABOUT US' ? "/about" : l === 'APP LOGIN' ? "/auth/login" : "#"} 
                  className="lp-footer-link"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
