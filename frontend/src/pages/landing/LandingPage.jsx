import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Wand2, FileText, Layers, ShieldCheck, Zap, Users,
  ArrowRight, CheckCircle, Download, Sparkles, Bot, FileCheck,
  BarChart3, Globe, Lock, ChevronRight, Terminal
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const DOC_TYPES = ['Invoice', 'Offer Letter', 'Certificate', 'Quotation', 'Report', 'Resume'];

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Document Generation',
    desc: 'Describe any document in plain language. LLM extracts entities, relationships, and industry standards to craft perfect documents in seconds.',
    accent: '#00e476',
    tag: 'Core',
  },
  {
    icon: ShieldCheck,
    title: 'QR Verification',
    desc: 'Every PDF generated carries a unique QR code for instant authenticity verification by any recipient.',
    accent: '#00e476',
    tag: 'Trust',
  },
  {
    icon: Layers,
    title: 'Template Library',
    desc: 'Access 100+ pre-verified templates for HR, Finance, and Legal. Customised to your brand identity automatically.',
    accent: '#e5c364',
    tag: 'Library',
    wide: true,
  },
  {
    icon: FileCheck,
    title: 'Smart Auto-fill',
    desc: 'Sync with your CRM to automatically populate fields across contracts with own internal data.',
    accent: '#b1ccc3',
    tag: 'Smart',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    desc: 'Track document creation velocity, approval rates, and team productivity in real time.',
    accent: '#e5c364',
    tag: 'Analytics',
  },
  {
    icon: Globe,
    title: 'Multi-language Export',
    desc: 'Generate documents in 40+ languages. Auto-detect locale from client data and apply formatting.',
    accent: '#b1ccc3',
    tag: 'Global',
  },
];

const STEPS = [
  {
    num: '01',
    icon: Terminal,
    title: 'Structural Analysis',
    desc: 'Breaking down the input into semantic components: entities, attributes, and their aliases.',
    accent: '#00e476',
    tag: 'NATURAL_LANGUAGE_INPUT',
  },
  {
    num: '02',
    icon: Lock,
    title: 'Compliance Engine',
    desc: 'Cross-referencing with legal and fiscal jurisdiction-specific company policy guidelines.',
    accent: '#e5c364',
    tag: 'VALIDATION_LAYER',
  },
  {
    num: '03',
    icon: FileCheck,
    title: 'Semantic Styling',
    desc: 'Mapping the structured data to your brand specific typography and professional layout.',
    accent: '#b1ccc3',
    tag: 'GENERATION_OUTPUT',
  },
];

const STATS = [
  { value: '10,000+', label: 'Documents Generated' },
  { value: '6', label: 'Document Types' },
  { value: '100%', label: 'AI-Validated' },
  { value: '<5s', label: 'Avg Generation' },
];

/* ─────────────────────────────────────────────
   Animated cycling word
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
        color: '#00e476',
        animation: 'wordFadeIn 0.35s ease forwards',
        fontStyle: 'italic',
      }}
    >
      {DOC_TYPES[idx]}
    </span>
  );
}

/* ─────────────────────────────────────────────
   AI terminal demo (hero right panel)
───────────────────────────────────────────── */
const DEMO_LINES = [
  { t: 200,  text: '> Parsing input...', color: '#849584' },
  { t: 600,  text: 'ENTITY: client_name = "Acme Tech"', color: '#00e476' },
  { t: 900,  text: 'ENTITY: amount = ₹45,000', color: '#00e476' },
  { t: 1200, text: 'ENTITY: due_date = "Aug 15"', color: '#00e476' },
  { t: 1600, text: 'FIELD: gst_18% = ₹8,100', color: '#e5c364' },
  { t: 2000, text: 'COMPLIANCE: GST_ACT ✓', color: '#b1ccc3' },
  { t: 2400, text: 'CONFIDENCE: 97.4%', color: '#00ff85' },
  { t: 2800, text: '✓ Invoice ready — exporting PDF', color: '#00e476' },
];

function AITerminal() {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    const timers = DEMO_LINES.map((line, i) =>
      setTimeout(() => setVisible(v => [...v, i]), line.t)
    );
    const loop = setTimeout(() => { setVisible([]); }, 4000);
    return () => { timers.forEach(clearTimeout); clearTimeout(loop); };
  }, []);

  useEffect(() => {
    if (visible.length === 0 && visible !== undefined) {
      // restart loop
    }
  }, [visible]);

  // Auto-restart
  useEffect(() => {
    let restarted = false;
    const check = setInterval(() => {
      if (!restarted) {
        setVisible([]);
        restarted = true;
      }
    }, 5500);
    return () => clearInterval(check);
  }, []);

  return (
    <div style={{
      background: '#0b0f10',
      border: '1px solid rgba(0,228,118,0.2)',
      borderRadius: 14,
      padding: '20px 22px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      minHeight: 220,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ marginLeft: 8, color: '#3b4b3d', fontSize: 11 }}>docuflow — ai-engine v2.4</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DEMO_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color,
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
            }}
          >
            {line.text}
          </div>
        ))}
        <span style={{ display: 'inline-block', width: 8, height: 14, background: '#00e476', animation: 'mintPulse 1s infinite', borderRadius: 1 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Landing Page
───────────────────────────────────────────── */
export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <style>{`
        /* ── Midnight Emerald Landing ── */
        .lp {
          min-height: 100vh;
          background: #101415;
          color: #e0e3e5;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* ── Navbar ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.3s;
        }
        .lp-nav.scrolled {
          background: rgba(16, 20, 21, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .lp-nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 18px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 800; letter-spacing: -0.04em;
          color: #e0e3e5; text-decoration: none;
          display: flex; align-items: center; gap: 10px;
        }
        .lp-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00e476;
          box-shadow: 0 0 10px #00e476;
        }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-link {
          font-size: 13px; font-weight: 500; color: #849584;
          text-decoration: none; letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .lp-nav-link:hover { color: #e0e3e5; }
        .lp-cta-nav {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 6px;
          background: #00e476; color: #001a0b;
          font-size: 13px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s;
        }
        .lp-cta-nav:hover {
          background: #00ff85;
          box-shadow: 0 0 20px rgba(0,228,118,0.4);
          transform: translateY(-1px);
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 120px 32px 80px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          background: rgba(0,228,118,0.08);
          border: 1px solid rgba(0,228,118,0.25);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; color: #00e476;
          letter-spacing: 0.05em; margin-bottom: 24px;
          width: fit-content;
        }
        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(40px, 5.5vw, 72px);
          font-weight: 700; letter-spacing: -0.03em;
          line-height: 1.1; color: #e0e3e5;
          margin-bottom: 24px;
        }
        .hero-sub {
          font-size: 17px; color: #849584; line-height: 1.7;
          max-width: 480px; margin-bottom: 40px;
        }
        .hero-ctas { display: flex; align-items: center; gap: 14px; }
        .btn-primary-lp {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 8px;
          background: #00e476; color: #001a0b;
          font-size: 15px; font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none; border: none; cursor: pointer;
          letter-spacing: -0.01em;
          transition: all 0.25s;
        }
        .btn-primary-lp:hover {
          background: #00ff85;
          box-shadow: 0 0 32px rgba(0,228,118,0.45);
          transform: translateY(-2px);
        }
        .btn-ghost-lp {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #e0e3e5; font-size: 15px; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost-lp:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
        }
        .hero-right {
          position: relative;
        }
        .hero-glass-card {
          background: rgba(29,32,34,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .hero-glass-card:hover {
          border-color: rgba(0,228,118,0.25);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,228,118,0.06);
          transition: all 0.4s ease;
        }
        .doc-preview-mini {
          background: #0b0f10;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 16px 18px;
          margin-top: 16px;
        }

        /* ── Stats ── */
        .stats-bar {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(11,15,16,0.6);
          padding: 0;
        }
        .stats-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          padding: 36px 24px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; letter-spacing: -0.05em;
          color: #e0e3e5; line-height: 1; margin-bottom: 8px;
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          color: #849584; text-transform: uppercase;
        }

        /* ── Section common ── */
        .section { padding: 96px 32px; max-width: 1280px; margin: 0 auto; }
        .section-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          color: #00e476; text-transform: uppercase; margin-bottom: 14px;
        }
        .section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 700; letter-spacing: -0.03em;
          line-height: 1.15; color: #e0e3e5; margin-bottom: 16px;
        }
        .section-title em {
          font-style: normal; color: #00e476;
        }
        .section-sub {
          font-size: 16px; color: #849584; line-height: 1.7;
          max-width: 500px;
        }

        /* ── Bento Feature Grid ── */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 56px;
        }
        .bento-card {
          background: #1d2022;
          padding: 32px 28px;
          transition: background 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }
        .bento-card.wide { grid-column: span 2; }
        .bento-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: transparent;
          transition: background 0.25s;
        }
        .bento-card:hover { background: #252829; }
        .bento-card:hover::before {
          background: linear-gradient(90deg, transparent, rgba(0,228,118,0.4), transparent);
        }
        .bento-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }
        .bento-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          color: #3b4b3d; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .bento-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px; font-weight: 700;
          color: #e0e3e5; margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .bento-desc {
          font-size: 14px; color: #849584; line-height: 1.7;
        }

        /* ── How AI Thinks ── */
        .ai-section {
          padding: 96px 32px;
          background: rgba(11,15,16,0.5);
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ai-inner { max-width: 1280px; margin: 0 auto; }
        .ai-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
          margin-top: 56px;
        }
        .ai-step {
          display: flex; gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ai-step:last-child { border-bottom: none; }
        .ai-step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #3b4b3d;
          letter-spacing: 0.05em; flex-shrink: 0; padding-top: 2px;
        }
        .ai-step-body {}
        .ai-step-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          margin-bottom: 6px; text-transform: uppercase;
        }
        .ai-step-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #e0e3e5; margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .ai-step-desc { font-size: 14px; color: #849584; line-height: 1.7; }

        /* ── CTA ── */
        .cta-section {
          padding: 96px 32px; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 80%, rgba(0,228,118,0.07) 0%, transparent 65%);
        }
        .cta-card {
          max-width: 680px; margin: 0 auto;
          padding: 64px 48px;
          background: rgba(29,32,34,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative; z-index: 1;
        }
        .cta-card:hover {
          border-color: rgba(0,228,118,0.2);
          box-shadow: 0 0 40px rgba(0,228,118,0.06);
          transition: all 0.4s ease;
        }
        .cta-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; letter-spacing: -0.04em;
          color: #e0e3e5; margin-bottom: 16px;
          line-height: 1.15;
        }
        .cta-title em { font-style: normal; color: #00e476; }
        .cta-sub { font-size: 16px; color: #849584; margin-bottom: 40px; line-height: 1.7; }
        .cta-trust {
          display: flex; gap: 28px; justify-content: center; flex-wrap: wrap;
          margin-top: 32px;
        }
        .cta-trust-item {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #849584; letter-spacing: 0.04em;
        }

        /* ── Footer ── */
        .lp-footer {
          padding: 32px 32px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .lp-footer-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .lp-footer-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #3b4b3d; letter-spacing: 0.04em;
        }
        .lp-footer-links { display: flex; gap: 24px; }
        .lp-footer-link {
          font-size: 12px; color: #849584; text-decoration: none;
          transition: color 0.2s;
        }
        .lp-footer-link:hover { color: #00e476; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 100px 20px 60px; gap: 40px; }
          .hero-right { display: none; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card.wide { grid-column: span 1; }
          .ai-grid { grid-template-columns: 1fr; gap: 40px; }
          .cta-card { padding: 40px 24px; }
          .lp-nav-links { display: none; }
          .section { padding: 64px 20px; }
        }
      `}</style>

      <div className="lp">
        {/* ══════ NAVBAR ══════ */}
        <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="lp-nav-inner">
            <Link to="/" className="lp-logo">
              <div className="lp-logo-dot" />
              DocuFlow
            </Link>
            <div className="lp-nav-links">
              <a href="#features" className="lp-nav-link">Features</a>
              <a href="#how-it-works" className="lp-nav-link">How the AI Thinks</a>
              <Link to="/auth/login" className="lp-nav-link">Sign In</Link>
              <Link to="/auth/register" className="lp-cta-nav">
                Get Started <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════ HERO ══════ */}
        <section>
          <div className="hero">
            {/* Left */}
            <div>
              <div className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e476', boxShadow: '0 0 8px #00e476', flexShrink: 0 }} />
                AI_DOCUMENT_INTELLIGENCE — V2.4
              </div>

              <h1 className="hero-title">
                Generate any<br />
                <AnimatedWord /><br />
                in seconds
              </h1>

              <p className="hero-sub">
                Describe your document in natural language. DocuFlow's AI extracts
                entities, validates against regulations, and exports a perfect PDF instantly.
              </p>

              <div className="hero-ctas">
                <Link to="/auth/register" className="btn-primary-lp">
                  Start for free <ArrowRight size={16} />
                </Link>
                <Link to="/auth/login" className="btn-ghost-lp">
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right — glass card with AI terminal */}
            <div className="hero-right">
              <div className="hero-glass-card">
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 18,
                }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13, fontWeight: 700, color: '#e0e3e5',
                    letterSpacing: '-0.02em',
                  }}>
                    AI Processing
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, color: '#00e476', letterSpacing: '0.05em',
                    }}>● LIVE</span>
                  </div>
                </div>

                <AITerminal />

                {/* Mini document preview */}
                <div className="doc-preview-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b4b3d', marginBottom: 4 }}>INVOICE / INV-2024-0847</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#e0e3e5' }}>Acme Technologies</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b4b3d', marginBottom: 4 }}>TOTAL</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: '#00e476' }}>₹53,100</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e476', boxShadow: '0 0 8px #00e476' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#00e476', letterSpacing: '0.04em' }}>
                      CONFIDENCE: 97.4% — QR VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Ambient glow behind card */}
              <div style={{
                position: 'absolute', bottom: -40, left: '10%', right: '10%',
                height: 80, background: 'rgba(0,228,118,0.08)',
                filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none',
              }} />
            </div>
          </div>
        </section>

        {/* ══════ STATS ══════ */}
        <div className="stats-bar">
          <div className="stats-inner">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-val">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ FEATURES ══════ */}
        <section className="section" id="features">
          <div className="section-tag">// CAPABILITIES</div>
          <h2 className="section-title">
            Everything you need to<br />
            <em>automate</em> documents
          </h2>
          <p className="section-sub">
            From idea to pixel-perfect PDF, our proprietary model handles the full lifecycle with surgical precision.
          </p>

          <div className="bento-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className={`bento-card${f.wide ? ' wide' : ''}`}>
                <div className="bento-tag">{f.tag}</div>
                <div className="bento-icon" style={{ border: `1px solid ${f.accent}22` }}>
                  <f.icon size={20} style={{ color: f.accent }} />
                </div>
                <div className="bento-title">{f.title}</div>
                <div className="bento-desc">{f.desc}</div>

                {f.wide && (
                  <Link
                    to="/auth/register"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 13, fontWeight: 700, color: '#00e476',
                      textDecoration: 'none', letterSpacing: '-0.01em',
                    }}
                  >
                    Browse library <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════ HOW THE AI THINKS ══════ */}
        <div className="ai-section" id="how-it-works">
          <div className="ai-inner">
            <div className="section-tag">// PROCESS</div>
            <h2 className="section-title">How the AI <em>"Thinks"</em></h2>
            <p className="section-sub">
              DocuFlow doesn't just generate text. It analyzes complex structures to ensure real-time accuracy.
            </p>

            <div className="ai-grid">
              {/* Steps */}
              <div>
                {STEPS.map((s) => (
                  <div key={s.num} className="ai-step">
                    <div className="ai-step-num">{s.num}</div>
                    <div className="ai-step-body">
                      <div className="ai-step-tag" style={{ color: s.accent }}>
                        {s.tag}
                      </div>
                      <div className="ai-step-title">{s.title}</div>
                      <div className="ai-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal live */}
              <div>
                <div style={{
                  background: '#0b0f10',
                  border: '1px solid rgba(0,228,118,0.15)',
                  borderRadius: 16, overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b4b3d', letterSpacing: '0.06em' }}>
                      ● AI_REAL_TIME_PROCESSING
                    </span>
                  </div>
                  <div style={{ padding: '20px 20px' }}>
                    {[
                      { label: 'PARSING', val: 'INVOICE_STANDARD_IND', color: '#00e476' },
                      { label: 'ENTITY', val: 'ACME_TECHNOLOGIES_LTD', color: '#00e476' },
                      { label: 'COMPLIANCE', val: 'GST_ACT_2017 ✓', color: '#b1ccc3' },
                      { label: 'CONFIDENCE', val: '97.4%', color: '#00ff85' },
                      { label: 'GENERATION_LATENCY', val: '2.3s', color: '#e5c364' },
                    ].map((row) => (
                      <div key={row.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      }}>
                        <span style={{ color: '#3b4b3d', letterSpacing: '0.04em' }}>{row.label}</span>
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
        <section className="cta-section">
          <div className="cta-glow" />
          <div className="cta-card">
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(0,228,118,0.12)',
              border: '1px solid rgba(0,228,118,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <Wand2 size={22} style={{ color: '#00e476' }} />
            </div>

            <h2 className="cta-title">
              Ready to <em>evolve</em><br />your workflow?
            </h2>
            <p className="cta-sub">
              Join over 2,000+ fin-tech teams already using DocuFlow to innovate 3× more a month in document and contract overhead.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth/register" className="btn-primary-lp">
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link to="/auth/login" className="btn-ghost-lp">
                Schedule Demo
              </Link>
            </div>

            <div className="cta-trust">
              {['No credit card', 'GDPR Compliant', 'SOC Certified'].map((t) => (
                <div key={t} className="cta-trust-item">
                  <CheckCircle size={12} style={{ color: '#00e476' }} />
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
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15, fontWeight: 800, color: '#e0e3e5',
                letterSpacing: '-0.03em', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e476', boxShadow: '0 0 8px #00e476' }} />
                DocuFlow
              </div>
              <div className="lp-footer-copy">© {new Date().getFullYear()} DocuFlow. AI Secure Document Intelligence.</div>
            </div>
            <div className="lp-footer-links">
              <a href="#features" className="lp-footer-link">FEATURES</a>
              <a href="#" className="lp-footer-link">PRIVACY POLICY</a>
              <a href="#" className="lp-footer-link">TERMS OF SERVICE</a>
              <Link to="/auth/login" className="lp-footer-link">APP LOGIN</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
