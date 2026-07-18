import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import {
  FileText, Wand2, Sparkles, TrendingUp, Clock, ChevronRight,
  CheckCircle2, AlertCircle, ArrowUpRight, Zap,
  Users, Shield, BarChart3, Activity, FileCheck, Network
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const HeroScene = lazy(() => import('@/components/ui/HeroScene'));

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
function useCountUp(target, duration = 1400, autoStart = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!autoStart || started) return;
    if (typeof target !== 'number' || isNaN(target)) return;
    setStarted(true);
    let startTime = null;
    const tick = (now) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => requestAnimationFrame(tick), 200);
    return () => clearTimeout(delay);
  }, [target, autoStart]);

  return count;
}

function useScrollReveal(threshold = 0.1) {
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
  }, []);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function MetricCard({ label, rawValue, icon: Icon, accent, trend, trendUp, delay }) {
  const numericTarget = typeof rawValue === 'number' ? rawValue : parseInt(rawValue) || 0;
  const count = useCountUp(numericTarget, 1200);
  const displayValue = typeof rawValue === 'number' ? count : rawValue;

  return (
    <div
      className="me-metric-card"
      style={{
        animationDelay: `${delay}s`,
        '--accent': accent,
      }}
    >
      {/* Scan line on hover */}
      <div className="me-scan-line" />

      <div className="me-metric-icon" style={{ background: `${accent}12`, borderColor: `${accent}20` }}>
        <Icon size={17} style={{ color: accent }} />
      </div>
      <div className="me-metric-val" style={{ transition: 'color 0.3s' }}>
        {displayValue}
      </div>
      <div className="me-metric-label">{label}</div>
      <div className="me-metric-trend" style={{ color: trendUp ? '#00e476' : '#e5c364' }}>
        <TrendingUp size={10} />
        {trend}
      </div>

      {/* Corner accent */}
      <div className="me-metric-corner" style={{ background: `${accent}15` }} />
    </div>
  );
}

function AnimatedBar({ color, label, count, max, delay }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div ref={ref} className="me-bar-row">
      <div className="me-bar-labels">
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#849584', letterSpacing: '0.04em' }}>
          {label.toUpperCase()}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color }}>
          {count}
        </span>
      </div>
      <div className="me-bar-track">
        <div
          className="me-bar-fill"
          style={{
            width: visible ? `${(count / max) * 100}%` : '0%',
            background: color,
            boxShadow: `0 0 8px ${color}60`,
            transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

function DocRow({ doc, index }) {
  const navigate = useNavigate();
  const isGen = doc.status === 'generated';
  const isRev = doc.status === 'revoked';
  const accent = isGen ? '#00e476' : isRev ? '#ffb4ab' : '#e5c364';

  return (
    <div
      className="me-doc-row"
      onClick={() => navigate(`/documents/${doc._id}`)}
      style={{
        animation: `staggerReveal 0.5s cubic-bezier(0.22,1,0.36,1) ${0.05 + index * 0.07}s both`,
      }}
    >
      <div className="me-doc-icon" style={{ background: `${accent}12`, borderColor: `${accent}20` }}>
        {isGen ? <CheckCircle2 size={15} style={{ color: accent }} />
          : isRev ? <AlertCircle size={15} style={{ color: accent }} />
            : <Clock size={15} style={{ color: accent }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="me-doc-title">{doc.title}</p>
        <p className="me-doc-meta">
          {doc.documentType?.replace('_', ' ').toUpperCase()} · {doc.status.toUpperCase()}
        </p>
      </div>
      <span className="me-doc-date">{formatDate(doc.updatedAt)}</span>
      <ArrowUpRight size={12} className="me-doc-arrow" />
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: 'Build Workflow', to: '/workflows', icon: Network, accent: '#00e476', bg: 'rgba(0,228,118,0.08)' },
  { label: 'AI Hub', to: '/agents', icon: Wand2, accent: '#b1ccc3', bg: 'rgba(177,204,195,0.08)' },
  { label: 'Manual Gen', to: '/generate', icon: Wand2, accent: '#e5c364', bg: 'rgba(229,195,100,0.08)' },
  { label: 'Doc History', to: '/documents', icon: FileText, accent: '#00e476', bg: 'rgba(0,228,118,0.06)' },
];

const MONTH_STATS = [
  { label: 'Invoices', count: 4, max: 8, color: '#00e476' },
  { label: 'Offer Letters', count: 2, max: 8, color: '#b1ccc3' },
  { label: 'Certificates', count: 6, max: 8, color: '#e5c364' },
  { label: 'Other', count: 1, max: 8, color: '#849584' },
];

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quickRef, quickVisible] = useScrollReveal(0.1);
  const [aiRef, aiVisible] = useScrollReveal(0.2);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchRecentStats,
  });

  const { data: recentDocs, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', { pageSize: 6 }],
    queryFn: () => fetchDocuments({ pageSize: 6 }),
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalDocs = stats?.totalDocuments ?? recentDocs?.total ?? 3;
  const generatedCount = stats?.generatedCount ?? 1;
  const draftCount = stats?.draftCount ?? 2;

  const METRICS = [
    { label: 'TOTAL_DOCUMENTS', rawValue: statsLoading ? 0 : totalDocs, icon: FileText, accent: '#00e476', trend: '+12% this week', trendUp: true },
    { label: 'GENERATED', rawValue: statsLoading ? 0 : generatedCount, icon: CheckCircle2, accent: '#00e476', trend: '+3 today', trendUp: true },
    { label: 'PENDING_REVIEW', rawValue: statsLoading ? 0 : draftCount, icon: Clock, accent: '#e5c364', trend: 'Needs attention', trendUp: false },
    { label: 'TEMPLATES', rawValue: 6, icon: BarChart3, accent: '#b1ccc3', trend: '5 popular', trendUp: true },
  ];

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════
           MIDNIGHT EMERALD DASHBOARD ANIMATIONS
        ══════════════════════════════════════ */
        .me-dashboard {
          padding: 28px 28px 48px;
          max-width: 1280px;
          margin: 0 auto;
          animation: pageEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Hero row */
        .me-hero-row {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 16px;
          margin-bottom: 28px; flex-wrap: wrap;
          animation: fadeDown 0.5s ease 0.05s both;
        }
        .me-greeting {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800; letter-spacing: -0.04em;
          color: var(--text-primary); line-height: 1.1;
        }
        .me-greeting em { font-style: normal; color: var(--color-primary); }
        .me-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--text-muted);
          letter-spacing: 0.04em; margin-top: 8px; text-transform: uppercase;
        }
        .me-gen-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 20px; border-radius: 8px;
          background: var(--color-primary); color: #001a0b;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 800;
          border: none; cursor: pointer; white-space: nowrap;
          letter-spacing: -0.01em; flex-shrink: 0;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .me-gen-btn::before {
          content: '';
          position: absolute; top: 0; bottom: 0;
          left: -60px; width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-15deg);
        }
        .me-gen-btn:hover::before { animation: mintBeam 0.6s ease forwards; }
        .me-gen-btn:hover {
          background: var(--color-primary-hover);
          box-shadow: var(--glow-mint);
          transform: translateY(-2px) scale(1.02);
        }
        .me-gen-btn:active { transform: translateY(0) scale(1); }
        .me-gen-btn .btn-icon { transition: transform 0.2s ease; }
        .me-gen-btn:hover .btn-icon { transform: rotate(20deg) scale(1.2); }

        /* Metric grid */
        .me-metrics {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 20px;
        }
        .me-metric-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 20px 18px;
          position: relative; overflow: hidden;
          cursor: default;
          animation: staggerReveal 0.6s cubic-bezier(0.22,1,0.36,1) both;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
        }
        .me-metric-card:hover {
          border-color: var(--border-mint);
          transform: translateY(-5px) scale(1.01);
          box-shadow: var(--shadow-hover);
        }
        /* Scan-line sweep on hover */
        .me-scan-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent, #00e476), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .me-metric-card:hover .me-scan-line { transform: scaleX(1); }
        /* Bottom corner glow */
        .me-metric-corner {
          position: absolute; bottom: -20px; right: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          filter: blur(20px); pointer-events: none;
          opacity: 0; transition: opacity 0.4s ease;
        }
        .me-metric-card:hover .me-metric-corner { opacity: 1; }
        .me-metric-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px; border: 1px solid;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .me-metric-card:hover .me-metric-icon { transform: scale(1.15) rotate(-5deg); }
        .me-metric-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 38px; font-weight: 900;
          letter-spacing: -0.06em; line-height: 1;
          color: var(--text-primary); margin-bottom: 4px;
          animation: counterUp 0.4s ease both;
        }
        .me-metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 500; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .me-metric-trend {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; margin-top: 12px;
          display: flex; align-items: center; gap: 4px;
        }

        /* Bento grid */
        .me-bento {
          display: grid; grid-template-columns: 1fr 320px;
          gap: 12px;
        }
        .me-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .me-card:hover { border-color: var(--border-strong); }
        .me-card-header {
          padding: 16px 20px 13px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .me-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: var(--text-primary); letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 8px;
        }
        .me-card-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: var(--color-primary); text-decoration: none;
          letter-spacing: 0.04em; display: flex; align-items: center; gap: 4px;
          transition: color 0.2s, gap 0.2s;
        }
        .me-card-link:hover { color: var(--color-primary-hover); gap: 8px; }

        /* Document rows */
        .me-doc-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s ease, transform 0.2s ease;
          cursor: pointer;
          position: relative; overflow: hidden;
        }
        .me-doc-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--color-primary);
          transform: scaleY(0); transform-origin: top;
          transition: transform 0.25s ease;
        }
        .me-doc-row:last-child { border-bottom: none; }
        .me-doc-row:hover { background: var(--bg-hover); transform: translateX(4px); }
        .me-doc-row:hover::before { transform: scaleY(1); }
        .me-doc-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border: 1px solid;
          transition: transform 0.25s ease;
        }
        .me-doc-row:hover .me-doc-icon { transform: scale(1.1) rotate(-5deg); }
        .me-doc-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--text-primary);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color 0.2s;
        }
        .me-doc-row:hover .me-doc-title { color: var(--color-primary); }
        .me-doc-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: var(--text-muted); margin-top: 2px; letter-spacing: 0.03em;
        }
        .me-doc-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: var(--text-xmuted); flex-shrink: 0;
        }
        .me-doc-arrow {
          color: var(--text-xmuted); flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }
        .me-doc-row:hover .me-doc-arrow { color: var(--color-primary); transform: translate(2px, -2px); }

        /* Quick actions */
        .me-quick-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px;
        }
        .me-quick-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-surface-el);
          cursor: pointer; width: 100%;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .me-quick-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, var(--color-primary-subtle) 100%);
          opacity: 0; transition: opacity 0.3s;
        }
        .me-quick-btn:hover {
          border-color: var(--border-mint);
          background: var(--color-primary-subtle);
          transform: translateY(-2px) scale(1.02);
          box-shadow: var(--shadow-sm);
        }
        .me-quick-btn:hover::after { opacity: 1; }
        .me-quick-btn:active { transform: translateY(0) scale(1); }
        .me-quick-icon {
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .me-quick-btn:hover .me-quick-icon { transform: scale(1.2) rotate(-8deg); }

        /* AI insight card */
        .me-ai-card {
          background: var(--color-ai-bg);
          border: 1px solid var(--color-ai-border);
          border-radius: 14px; padding: 18px;
          transition: all 0.35s ease;
          position: relative; overflow: hidden;
        }
        .me-ai-card::before {
          content: ''; position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, var(--color-primary-subtle) 0%, transparent 60%);
          animation: orbPulse 4s ease-in-out infinite;
          pointer-events: none;
        }
        .me-ai-card:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-subtle);
          box-shadow: var(--glow-mint-sm);
          transform: translateY(-2px);
        }
        .me-ai-auto-btn {
          width: 100%; padding: 9px 14px; border-radius: 8px;
          border: 1px solid var(--color-ai-border);
          background: var(--color-ai-bg); color: var(--color-primary);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          letter-spacing: -0.01em;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .me-ai-auto-btn:hover {
          background: var(--color-primary-subtle);
          color: var(--color-primary-hover);
          box-shadow: var(--glow-mint-sm);
          transform: translateY(-1px);
        }

        /* Expiry */
        .me-expiry-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid var(--border);
          font-size: 13px;
          transition: background 0.2s, padding-left 0.2s;
          border-radius: 4px;
        }
        .me-expiry-item:last-child { border-bottom: none; }
        .me-expiry-item:hover { padding-left: 8px; }

        /* Bars */
        .me-bar-row { margin-bottom: 12px; }
        .me-bar-labels { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .me-bar-track {
          height: 4px; background: var(--border);
          border-radius: 3px; overflow: hidden;
          position: relative;
        }
        .me-bar-fill { height: 100%; border-radius: 3px; }

        /* Responsive */
        @media (max-width: 1100px) {
          .me-metrics { grid-template-columns: repeat(2, 1fr); }
          .me-bento { grid-template-columns: 1fr; }
          .me-dashboard { padding: 18px 16px 36px; }
        }
        @media (max-width: 600px) {
          .me-metrics { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="me-dashboard">
        {/* ── Hero row ── */}
        <div className="me-hero-row" style={{ position: 'relative', overflow: 'hidden', padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', minHeight: '180px' }}>
          
          <div style={{ position: 'absolute', right: 0, top: '-50%', width: '400px', height: '400px', pointerEvents: 'auto', zIndex: 0 }}>
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <h1 className="me-greeting">
                {greeting()}, <em>{user?.name?.split(' ')[0] ?? 'there'}</em>
              </h1>
              <p className="me-sub" style={{ marginBottom: '16px' }}>
                WORKSPACE_OVERVIEW — {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            </div>
            <motion.button 
              className="me-gen-btn" 
              onClick={() => navigate('/generate')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={14} className="btn-icon" />
              Generate Document
            </motion.button>
          </div>
        </div>

        {/* ── Metric cards (count-up) ── */}
        <motion.div 
          className="me-metrics"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {METRICS.map((m, i) => (
            <motion.div key={m.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <MetricCard {...m} delay={0} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="me-bento">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Recent Activity */}
            <div className="me-card" style={{ animation: 'staggerReveal 0.6s ease 0.35s both' }}>
              <div className="me-card-header">
                <span className="me-card-title">
                  <Activity size={13} style={{ color: '#00e476' }} />
                  Recent Activity
                </span>
                <Link to="/documents" className="me-card-link">
                  VIEW_ALL <ChevronRight size={11} />
                </Link>
              </div>

              {docsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="me-doc-row" style={{ pointerEvents: 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9 }} className="skeleton-pulse" />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, width: '55%', marginBottom: 6 }} className="skeleton-pulse" />
                      <div style={{ height: 8, width: '35%' }} className="skeleton-pulse" />
                    </div>
                  </div>
                ))
                : recentDocs?.data?.length === 0
                  ? (
                    <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#849584', letterSpacing: '0.04em' }}>
                        NO_DOCUMENTS_YET —{' '}
                        <Link to="/generate" style={{ color: '#00e476', textDecoration: 'none' }}>GENERATE_FIRST →</Link>
                      </p>
                    </div>
                  )
                  : recentDocs?.data?.map((doc, index) => (
                    <DocRow key={doc._id} doc={doc} index={index} />
                  ))
              }
            </div>

            {/* Quick Actions */}
            <div ref={quickRef} className="me-card" style={{
              opacity: quickVisible ? 1 : 0,
              transform: quickVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}>
              <div className="me-card-header">
                <span className="me-card-title">
                  <Zap size={13} style={{ color: '#e5c364' }} />
                  Quick Actions
                </span>
              </div>
              <div className="me-quick-grid">
                {QUICK_ACTIONS.map((a, qi) => (
                  <button
                    key={a.label}
                    className="me-quick-btn"
                    onClick={() => navigate(a.to)}
                    style={{
                      opacity: quickVisible ? 1 : 0,
                      transform: quickVisible ? 'scale(1)' : 'scale(0.92)',
                      transition: `opacity 0.4s ease ${0.1 + qi * 0.06}s, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${0.1 + qi * 0.06}s`,
                    }}
                  >
                    <div
                      className="me-quick-icon"
                      style={{ background: a.bg, border: `1px solid ${a.accent}20` }}
                    >
                      <a.icon size={15} style={{ color: a.accent }} />
                    </div>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: '#b9cbb9' }}>
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* AI Insight */}
            <div
              ref={aiRef}
              className="me-ai-card"
              style={{
                opacity: aiVisible ? 1 : 0,
                transform: aiVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: 'opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: 'rgba(0,228,118,0.12)',
                  border: '1px solid rgba(0,228,118,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite',
                }}>
                  <Sparkles size={12} style={{ color: '#00e476' }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#00e476', letterSpacing: '0.08em' }}>
                  AI_INSIGHT
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14, position: 'relative', zIndex: 1 }}>
                Automate your recruitment process by routing <strong style={{ color: 'var(--text-primary)' }}>LinkedIn profiles</strong> through the AI Workflow Builder to generate instant Professional Resumes.
              </p>
              <button className="me-ai-auto-btn" onClick={() => navigate('/workflows')}>
                <Zap size={12} /> Open Workflow Builder
              </button>
            </div>

            {/* Upcoming Expirations */}
            <div className="me-card" style={{ animation: 'staggerReveal 0.6s ease 0.5s both' }}>
              <div className="me-card-header">
                <span className="me-card-title">
                  <Clock size={13} style={{ color: '#e5c364' }} />
                  Upcoming Expirations
                </span>
              </div>
              <div style={{ padding: '8px 18px 12px' }}>
                {[
                  { name: 'Acme NDA', when: '2 DAYS', danger: true, delay: 0.55 },
                  { name: 'Vendor Contract', when: 'NEXT WEEK', danger: false, delay: 0.62 },
                  { name: 'Partnership MOU', when: '30 DAYS', danger: false, delay: 0.69 },
                ].map((item, i) => (
                  <div
                    key={item.name}
                    className="me-expiry-item"
                    style={{
                      animation: `staggerReveal 0.5s ease ${item.delay}s both`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: item.danger ? 'var(--color-error)' : 'var(--color-warning)',
                        boxShadow: item.danger ? '0 0 8px var(--color-error-border)' : '0 0 8px var(--color-warning-border)',
                        animation: item.danger ? 'mintPulse 1.5s ease-in-out infinite' : 'none',
                      }} />
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                      color: item.danger ? 'var(--color-error)' : 'var(--text-muted)',
                    }}>
                      {item.when}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly chart with animated bars */}
            <div className="me-card" style={{ animation: 'staggerReveal 0.6s ease 0.6s both' }}>
              <div className="me-card-header">
                <span className="me-card-title">
                  <BarChart3 size={13} style={{ color: '#b1ccc3' }} />
                  This Month
                </span>
              </div>
              <div style={{ padding: '12px 18px 16px' }}>
                {MONTH_STATS.map((item, i) => (
                  <AnimatedBar
                    key={item.label}
                    color={item.color}
                    label={item.label}
                    count={item.count}
                    max={item.max}
                    delay={0.1 + i * 0.08}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
