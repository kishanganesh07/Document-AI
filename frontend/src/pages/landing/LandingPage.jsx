import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Wand2, FileText, Layers, ShieldCheck, Zap, Users,
  ArrowRight, ChevronRight, Star, CheckCircle, BarChart3,
  Clock, Globe, Lock, Download, Sparkles, Bot, FileCheck
} from 'lucide-react';

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Document Generation',
    desc: 'Describe any document in plain English. Our AI extracts, validates, and structures it instantly.',
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: FileCheck,
    title: 'Smart Auto-fill & Validation',
    desc: 'Intelligent field detection catches errors before they happen. Every document is verified.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: Layers,
    title: 'Template Library',
    desc: 'Start from curated professional templates — invoices, offer letters, certificates, and more.',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    icon: Download,
    title: 'Instant PDF Export',
    desc: 'One click to export pixel-perfect PDFs ready to send, sign, or archive.',
    gradient: 'from-orange-500 to-amber-600',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    icon: ShieldCheck,
    title: 'QR Verification',
    desc: 'Every document gets a unique QR code. Recipients can verify authenticity in seconds.',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.3)',
  },
  {
    icon: Users,
    title: 'Team & Organization',
    desc: 'Invite your team, manage permissions, and collaborate on documents together.',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'rgba(168,85,247,0.3)',
  },
];

const STEPS = [
  {
    num: '01',
    icon: Bot,
    title: 'Describe in plain English',
    desc: 'Type what document you need, just like texting. Our AI understands context, names, amounts, dates.',
    color: '#6C63FF',
  },
  {
    num: '02',
    icon: FileCheck,
    title: 'AI extracts & validates',
    desc: 'All fields are structured automatically. Errors are caught, missing info is flagged instantly.',
    color: '#10B981',
  },
  {
    num: '03',
    icon: Download,
    title: 'Export & verify',
    desc: 'Download your PDF in one click. Share the QR code so anyone can verify authenticity.',
    color: '#F59E0B',
  },
];

const STATS = [
  { value: '10,000+', label: 'Documents Generated' },
  { value: '6', label: 'Document Types' },
  { value: '100%', label: 'AI-Powered' },
  { value: '< 5s', label: 'Avg Generation Time' },
];

const DOC_TYPES = ['Invoice', 'Offer Letter', 'Certificate', 'Quotation', 'Report', 'Resume'];

function AnimatedWords() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % DOC_TYPES.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span key={idx} style={{
      display: 'inline-block',
      background: 'linear-gradient(135deg, #818CF8 0%, #6C63FF 40%, #A78BFA 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'wordFadeIn 0.4s ease forwards',
    }}>
      {DOC_TYPES[idx]}
    </span>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes wordFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes gradShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lp-root {
          min-height: 100vh;
          background: #06070A;
          color: #F1F5F9;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
        }
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.3s ease;
        }
        .lp-nav.scrolled {
          background: rgba(6, 7, 10, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }
        .lp-nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-size: 20px; font-weight: 800; letter-spacing: -0.04em;
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; text-decoration: none;
        }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-link {
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: color 0.2s; letter-spacing: -0.01em;
        }
        .lp-nav-link:hover { color: #ffffff; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 10px;
          background: linear-gradient(135deg, #6C63FF, #818CF8);
          color: white; font-size: 14px; font-weight: 700;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(108,99,255,0.4);
          letter-spacing: -0.01em;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(108,99,255,0.5);
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: white; font-size: 14px; font-weight: 600;
          text-decoration: none; cursor: pointer; transition: all 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .hero-section {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 32px 80px;
          position: relative; overflow: hidden;
        }
        .hero-glow-1 {
          position: absolute; top: 10%; left: 20%;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%);
          filter: blur(60px); animation: pulseGlow 6s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute; bottom: 10%; right: 10%;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          filter: blur(60px); animation: pulseGlow 8s ease-in-out infinite 2s;
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px; border-radius: 100px;
          background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.35);
          font-size: 12px; font-weight: 600; color: #a5b4fc;
          letter-spacing: 0.02em; margin-bottom: 28px;
          animation: slideUp 0.6s ease 0.1s both;
        }
        .hero-title {
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 900; letter-spacing: -0.04em; line-height: 1.0;
          color: #ffffff; margin-bottom: 24px;
          animation: slideUp 0.6s ease 0.2s both;
        }
        .hero-sub {
          font-size: 18px; color: rgba(255,255,255,0.55); line-height: 1.7;
          max-width: 520px; margin: 0 auto 48px;
          animation: slideUp 0.6s ease 0.3s both;
        }
        .hero-ctas {
          display: flex; align-items: center; gap: 16px; justify-content: center;
          flex-wrap: wrap;
          animation: slideUp 0.6s ease 0.4s both;
        }
        .hero-doc-preview {
          margin-top: 80px; width: 100%; max-width: 900px;
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.2);
          animation: slideUp 0.8s ease 0.5s both;
          position: relative;
        }
        .preview-bar {
          background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 14px 20px; display: flex; align-items: center; gap: 8px;
        }
        .preview-dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-content {
          background: #0D0F14;
          padding: 32px 32px 40px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        .preview-chat-bubble {
          padding: 14px 18px; border-radius: 14px; font-size: 13px; line-height: 1.5;
          max-width: 90%; text-align: left;
        }
        .preview-ai { background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.2); color: #c4b5fd; }
        .preview-user { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); margin-left: auto; }
        .stats-section {
          padding: 60px 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .stats-grid {
          max-width: 900px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
        }
        .stat-item {
          text-align: center; padding: 24px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-size: 42px; font-weight: 900; letter-spacing: -0.04em;
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; color: rgba(255,255,255,0.45); font-weight: 500; }
        .features-section { padding: 100px 32px; max-width: 1200px; margin: 0 auto; }
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #6C63FF; margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(32px, 4vw, 52px); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1.1; color: #ffffff; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: rgba(255,255,255,0.5); max-width: 480px; line-height: 1.7; }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: rgba(255,255,255,0.06); border-radius: 20px;
          overflow: hidden; margin-top: 60px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .feature-card {
          padding: 36px 32px; background: #0D0F14;
          transition: background 0.3s;
          cursor: default;
        }
        .feature-card:hover { background: #111318; }
        .feature-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; flex-shrink: 0;
        }
        .feature-title { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.02em; }
        .feature-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; }
        .steps-section { padding: 100px 32px; background: rgba(255,255,255,0.015); }
        .steps-inner { max-width: 900px; margin: 0 auto; text-align: center; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 64px; position: relative; }
        .steps-connector {
          position: absolute; top: 32px; left: calc(50% - 400px); right: calc(50% - 400px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(108,99,255,0.4), rgba(108,99,255,0.4), transparent);
        }
        .step-card { text-align: center; position: relative; }
        .step-num {
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.25); margin-bottom: 20px;
        }
        .step-icon-wrap {
          width: 64px; height: 64px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .step-title { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.02em; }
        .step-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; }
        .cta-section {
          padding: 100px 32px; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-card {
          max-width: 700px; margin: 0 auto;
          padding: 64px 48px;
          border-radius: 28px;
          border: 1px solid rgba(108,99,255,0.25);
          background: linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(129,140,248,0.04) 100%);
          position: relative; z-index: 1;
        }
        .footer { padding: 40px 32px; border-top: 1px solid rgba(255,255,255,0.06); }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: rgba(255,255,255,0.7); }
        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-nav-inner { padding: 16px 20px; }
          .hero-section { padding: 100px 20px 60px; }
          .features-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .steps-grid { grid-template-columns: 1fr; gap: 32px; }
          .steps-connector { display: none; }
          .preview-content { grid-template-columns: 1fr; }
          .cta-card { padding: 40px 24px; }
          .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="lp-root">
        {/* ===== NAVBAR ===== */}
        <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="lp-nav-inner">
            <Link to="/" className="lp-logo">DocuFlow</Link>
            <div className="lp-nav-links">
              <a href="#features" className="lp-nav-link">Features</a>
              <a href="#how-it-works" className="lp-nav-link">How it works</a>
              <Link to="/auth/login" className="lp-nav-link">Sign In</Link>
              <Link to="/auth/register" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ===== HERO ===== */}
        <section className="hero-section">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />

          <div className="hero-badge">
            <Sparkles size={12} />
            AI-Powered Document Intelligence
          </div>

          <h1 className="hero-title">
            Generate any<br />
            <AnimatedWords /><br />
            in seconds
          </h1>

          <p className="hero-sub">
            Describe your document in plain English. DocuFlow's AI extracts,
            validates, and structures it — then exports a perfect PDF instantly.
          </p>

          <div className="hero-ctas">
            <Link to="/auth/register" className="btn-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/auth/login" className="btn-ghost" style={{ fontSize: '15px', padding: '14px 28px' }}>
              Sign in
            </Link>
          </div>

          {/* App preview mockup */}
          <div className="hero-doc-preview">
            <div className="preview-bar">
              <div className="preview-dot" style={{ background: '#FF5F57' }} />
              <div className="preview-dot" style={{ background: '#FEBC2E' }} />
              <div className="preview-dot" style={{ background: '#28C840' }} />
              <span style={{ marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                docuflow.app/generate
              </span>
            </div>
            <div className="preview-content">
              {/* Left: AI chat */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  ✦ AI Assistant
                </div>
                <div className="preview-chat-bubble preview-user">
                  Create an invoice for Acme Tech for ₹45,000 due August 15th
                </div>
                <div className="preview-chat-bubble preview-ai">
                  ✓ Invoice detected with 98% confidence. I've extracted all fields — client name, amount, due date, and tax. Ready to generate!
                </div>
                <div className="preview-chat-bubble preview-user">
                  Add GST 18%
                </div>
                <div className="preview-chat-bubble preview-ai">
                  Done! GST calculated: ₹8,100. Total updated to ₹53,100. Your document is validated and ready.
                </div>
              </div>
              {/* Right: Document preview */}
              <div style={{
                background: 'white', borderRadius: 12, padding: '20px 20px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ borderBottom: '2px solid #6C63FF', paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>INVOICE</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>INV-2024-0847</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Bill To</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e' }}>Acme Technologies</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>acme@tech.com</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Due Date</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Aug 15, 2024</div>
                  </div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#374151' }}>Software License (Annual)</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>₹45,000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>GST 18%</span>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>₹8,100</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 9, color: '#9ca3af' }}>✓ Verified by DocuFlow</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#6C63FF' }}>₹53,100</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="stats-section">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-val">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="features-section" id="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need<br />to automate documents</h2>
          <p className="section-sub">
            From generation to verification — DocuFlow handles the full document lifecycle with AI precision.
          </p>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div
                  className="feature-icon"
                  style={{ background: `linear-gradient(135deg, ${f.glow.replace('0.3', '0.2')}, ${f.glow.replace('0.3', '0.08')})`, border: `1px solid ${f.glow}` }}
                >
                  <f.icon size={20} style={{ color: '#fff' }} />
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="steps-section" id="how-it-works">
          <div className="steps-inner">
            <div className="section-label">How it works</div>
            <h2 className="section-title">From idea to PDF<br />in under 30 seconds</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              No forms to fill, no templates to wrestle with. Just describe what you need.
            </p>

            <div className="steps-grid">
              <div className="steps-connector" />
              {STEPS.map((s) => (
                <div key={s.num} className="step-card">
                  <div className="step-num">{s.num}</div>
                  <div
                    className="step-icon-wrap"
                    style={{ background: `rgba(${s.color === '#6C63FF' ? '108,99,255' : s.color === '#10B981' ? '16,185,129' : '245,158,11'}, 0.12)` }}
                  >
                    <s.icon size={24} style={{ color: s.color }} />
                  </div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta-section">
          <div className="cta-bg" />
          <div className="cta-card">
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #6C63FF, #818CF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(108,99,255,0.5)',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <Wand2 size={24} color="white" />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', marginBottom: 16 }}>
              Ready to win your workflow?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
              Join teams already generating invoices, offer letters, certificates,
              and more — in seconds, not hours.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth/register" className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                Get started free <ArrowRight size={16} />
              </Link>
              <Link to="/auth/login" className="btn-ghost" style={{ fontSize: '15px', padding: '14px 32px' }}>
                Sign in
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              {['No credit card required', 'Setup in 30 seconds', 'Free to start'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <span className="lp-logo" style={{ fontSize: '16px' }}>DocuFlow</span>
              <div className="footer-copy" style={{ marginTop: 6 }}>
                © {new Date().getFullYear()} DocuFlow. All rights reserved.
              </div>
            </div>
            <div className="footer-links">
              <Link to="/auth/login" className="footer-link">Sign In</Link>
              <Link to="/auth/register" className="footer-link">Register</Link>
              <a href="#features" className="footer-link">Features</a>
              <a href="#how-it-works" className="footer-link">How it works</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
