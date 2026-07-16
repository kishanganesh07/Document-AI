import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import {
  FileText, Wand2, Sparkles, TrendingUp, Clock, ChevronRight,
  CheckCircle2, AlertCircle, ArrowUpRight, Zap,
  Users, Shield, BarChart3, Activity, Terminal, FileCheck
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { label: 'New Invoice', to: '/generate', icon: FileText, accent: '#00e476', bg: 'rgba(0,228,118,0.08)' },
  { label: 'Offer Letter', to: '/generate', icon: Users, accent: '#b1ccc3', bg: 'rgba(177,204,195,0.08)' },
  { label: 'Certificate', to: '/generate', icon: Shield, accent: '#e5c364', bg: 'rgba(229,195,100,0.08)' },
  { label: 'Quotation', to: '/generate', icon: BarChart3, accent: '#00e476', bg: 'rgba(0,228,118,0.06)' },
];

const MONTH_STATS = [
  { label: 'Invoices', count: 4, max: 8, color: '#00e476' },
  { label: 'Offer Letters', count: 2, max: 8, color: '#b1ccc3' },
  { label: 'Certificates', count: 6, max: 8, color: '#e5c364' },
  { label: 'Other', count: 1, max: 8, color: '#849584' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  const METRICS = [
    {
      label: 'TOTAL_DOCUMENTS',
      value: statsLoading ? '—' : (stats?.totalDocuments ?? recentDocs?.total ?? 3),
      icon: FileText,
      accent: '#00e476',
      trend: '+12% this week',
    },
    {
      label: 'GENERATED',
      value: statsLoading ? '—' : (stats?.generatedCount ?? 1),
      icon: CheckCircle2,
      accent: '#00e476',
      trend: '+3 today',
    },
    {
      label: 'PENDING_REVIEW',
      value: statsLoading ? '—' : (stats?.draftCount ?? 2),
      icon: Clock,
      accent: '#e5c364',
      trend: 'Needs attention',
    },
    {
      label: 'TEMPLATES',
      value: 6,
      icon: BarChart3,
      accent: '#b1ccc3',
      trend: '5 popular',
    },
  ];

  return (
    <>
      <style>{`
        .me-dashboard {
          padding: 28px 28px 48px;
          max-width: 1280px;
          margin: 0 auto;
          animation: mePageIn 0.3s ease;
        }
        @keyframes mePageIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .me-hero-row {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 16px;
          margin-bottom: 28px; flex-wrap: wrap;
        }
        .me-greeting {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800; letter-spacing: -0.04em;
          color: #e0e3e5; line-height: 1.1;
        }
        .me-greeting em { font-style: normal; color: #00e476; }
        .me-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #849584;
          letter-spacing: 0.04em; margin-top: 8px;
          text-transform: uppercase;
        }
        .me-gen-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 20px; border-radius: 8px;
          background: #00e476; color: #001a0b;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 800;
          border: none; cursor: pointer; white-space: nowrap;
          letter-spacing: -0.01em;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .me-gen-btn:hover {
          background: #00ff85;
          box-shadow: 0 0 24px rgba(0,228,118,0.4);
          transform: translateY(-1px);
        }

        /* ── Bento metrics ── */
        .me-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .me-metric-card {
          background: #1d2022;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px 20px 18px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .me-metric-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .me-metric-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: transparent; transition: background 0.3s;
        }
        .me-metric-card:hover::before {
          background: linear-gradient(90deg, transparent, rgba(0,228,118,0.35), transparent);
        }
        .me-metric-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .me-metric-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 38px; font-weight: 900;
          letter-spacing: -0.06em; line-height: 1;
          color: #e0e3e5; margin-bottom: 4px;
        }
        .me-metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 500; color: #849584;
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .me-metric-trend {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; margin-top: 12px;
          display: flex; align-items: center; gap: 4px;
          letter-spacing: 0.03em;
        }

        /* ── Main bento grid ── */
        .me-bento {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 12px;
        }
        .me-card {
          background: #1d2022;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .me-card:hover { border-color: rgba(255,255,255,0.11); }
        .me-card-header {
          padding: 16px 20px 13px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .me-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #e0e3e5; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 8px;
        }
        .me-card-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #00e476;
          text-decoration: none; letter-spacing: 0.04em;
          display: flex; align-items: center; gap: 4px;
          transition: color 0.15s;
        }
        .me-card-link:hover { color: #00ff85; }

        /* Activity rows */
        .me-doc-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s; cursor: pointer;
        }
        .me-doc-row:last-child { border-bottom: none; }
        .me-doc-row:hover { background: rgba(255,255,255,0.025); }
        .me-doc-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06);
        }

        /* Quick actions grid */
        .me-quick-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
          padding: 14px;
        }
        .me-quick-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer; transition: all 0.2s;
          text-align: left; width: 100%;
        }
        .me-quick-btn:hover {
          border-color: rgba(0,228,118,0.2);
          background: rgba(0,228,118,0.04);
          transform: translateY(-1px);
        }

        /* AI insight */
        .me-ai-card {
          background: rgba(0,228,118,0.05);
          border: 1px solid rgba(0,228,118,0.15);
          border-radius: 14px; padding: 18px;
        }
        .me-ai-card:hover {
          border-color: rgba(0,228,118,0.25);
          background: rgba(0,228,118,0.07);
          transition: all 0.3s;
        }

        /* Expiry items */
        .me-expiry-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px;
        }
        .me-expiry-item:last-child { border-bottom: none; }

        /* Bar chart */
        .me-bar-row { margin-bottom: 12px; }
        .me-bar-labels {
          display: flex; justify-content: space-between; margin-bottom: 5px;
        }
        .me-bar-track {
          height: 4px; background: rgba(255,255,255,0.07);
          border-radius: 3px; overflow: hidden;
        }
        .me-bar-fill {
          height: 100%; border-radius: 3px;
          transition: width 0.8s ease;
        }

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
        <div className="me-hero-row">
          <div>
            <h1 className="me-greeting">
              {greeting()}, <em>{user?.name?.split(' ')[0] ?? 'there'}</em>
            </h1>
            <p className="me-sub">WORKSPACE_OVERVIEW — {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <button className="me-gen-btn" onClick={() => navigate('/generate')}>
            <Sparkles size={14} />
            Generate Document
          </button>
        </div>

        {/* ── Metric cards ── */}
        <div className="me-metrics">
          {METRICS.map((m) => (
            <div key={m.label} className="me-metric-card">
              <div className="me-metric-icon" style={{ background: `${m.accent}12` }}>
                <m.icon size={17} style={{ color: m.accent }} />
              </div>
              <div className="me-metric-val">{m.value}</div>
              <div className="me-metric-label">{m.label}</div>
              <div className="me-metric-trend" style={{ color: m.accent }}>
                <TrendingUp size={10} />
                {m.trend}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bento grid ── */}
        <div className="me-bento">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Recent Activity */}
            <div className="me-card">
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
                  <div key={i} className="me-doc-row">
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
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#849584', letterSpacing: '0.04em' }}>
                        NO_DOCUMENTS_YET —{' '}
                        <Link to="/generate" style={{ color: '#00e476', textDecoration: 'none' }}>GENERATE_FIRST →</Link>
                      </p>
                    </div>
                  )
                  : recentDocs?.data?.map((doc) => {
                    const isGen = doc.status === 'generated';
                    const isRev = doc.status === 'revoked';
                    const accent = isGen ? '#00e476' : isRev ? '#ffb4ab' : '#e5c364';
                    return (
                      <div key={doc._id} className="me-doc-row" onClick={() => navigate(`/documents/${doc._id}`)}>
                        <div className="me-doc-icon" style={{ background: `${accent}10` }}>
                          {isGen
                            ? <CheckCircle2 size={15} style={{ color: accent }} />
                            : isRev
                              ? <AlertCircle size={15} style={{ color: accent }} />
                              : <Clock size={15} style={{ color: accent }} />
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 13, fontWeight: 600, color: '#e0e3e5',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {doc.title}
                          </p>
                          <p style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, color: '#849584', marginTop: 2, letterSpacing: '0.03em',
                          }}>
                            {doc.documentType?.replace('_', ' ').toUpperCase()} · {doc.status.toUpperCase()}
                          </p>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#3b4b3d', flexShrink: 0 }}>
                          {formatDate(doc.updatedAt)}
                        </span>
                        <ArrowUpRight size={12} style={{ color: '#3b4b3d', flexShrink: 0 }} />
                      </div>
                    );
                  })
              }
            </div>

            {/* Quick Actions */}
            <div className="me-card">
              <div className="me-card-header">
                <span className="me-card-title">
                  <Zap size={13} style={{ color: '#e5c364' }} />
                  Quick Actions
                </span>
              </div>
              <div className="me-quick-grid">
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.label} className="me-quick-btn" onClick={() => navigate(a.to)}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: a.bg,
                      border: `1px solid ${a.accent}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <a.icon size={15} style={{ color: a.accent }} />
                    </div>
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 13, fontWeight: 600, color: '#b9cbb9',
                    }}>
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
            <div className="me-ai-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: 'rgba(0,228,118,0.12)',
                  border: '1px solid rgba(0,228,118,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={12} style={{ color: '#00e476' }} />
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, color: '#00e476', letterSpacing: '0.08em',
                }}>
                  AI_INSIGHT
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#b9cbb9', lineHeight: 1.65, marginBottom: 14 }}>
                You frequently generate <strong style={{ color: '#e0e3e5' }}>Invoices</strong> at month-end.
                Set up automated batch generation to save 40+ minutes.
              </p>
              <button
                onClick={() => navigate('/batch')}
                style={{
                  width: '100%', padding: '9px 14px', borderRadius: 8,
                  border: '1px solid rgba(0,228,118,0.2)',
                  background: 'rgba(0,228,118,0.08)', color: '#00e476',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,228,118,0.14)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,228,118,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,228,118,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Zap size={12} /> Configure Automation
              </button>
            </div>

            {/* Expirations */}
            <div className="me-card">
              <div className="me-card-header">
                <span className="me-card-title">
                  <Clock size={13} style={{ color: '#e5c364' }} />
                  Upcoming Expirations
                </span>
              </div>
              <div style={{ padding: '8px 18px 12px' }}>
                {[
                  { name: 'Acme NDA', when: '2 DAYS', danger: true },
                  { name: 'Vendor Contract', when: 'NEXT WEEK', danger: false },
                  { name: 'Partnership MOU', when: '30 DAYS', danger: false },
                ].map(item => (
                  <div key={item.name} className="me-expiry-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: item.danger ? '#ffb4ab' : '#e5c364',
                        boxShadow: item.danger ? '0 0 6px rgba(255,180,171,0.6)' : '0 0 6px rgba(229,195,100,0.4)',
                      }} />
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#b9cbb9' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                      color: item.danger ? '#ffb4ab' : '#849584',
                    }}>
                      {item.when}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly chart */}
            <div className="me-card">
              <div className="me-card-header">
                <span className="me-card-title">
                  <BarChart3 size={13} style={{ color: '#b1ccc3' }} />
                  This Month
                </span>
              </div>
              <div style={{ padding: '12px 18px 16px' }}>
                {MONTH_STATS.map((item) => (
                  <div key={item.label} className="me-bar-row">
                    <div className="me-bar-labels">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#849584', letterSpacing: '0.04em' }}>
                        {item.label.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: item.color }}>
                        {item.count}
                      </span>
                    </div>
                    <div className="me-bar-track">
                      <div
                        className="me-bar-fill"
                        style={{
                          width: `${(item.count / item.max) * 100}%`,
                          background: item.color,
                          boxShadow: `0 0 6px ${item.color}50`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
