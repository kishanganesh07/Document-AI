import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import {
  FileText, Wand2, Sparkles, TrendingUp, Clock, ChevronRight,
  CheckCircle2, AlertCircle, ArrowUpRight, Zap, Star,
  FileCheck, Users, Shield, BarChart3, Activity
} from 'lucide-react';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

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

  const METRIC_CARDS = [
    {
      label: 'Total Documents',
      value: statsLoading ? '—' : (stats?.totalDocuments ?? recentDocs?.total ?? 3),
      icon: FileText,
      color: '#6C63FF',
      bg: 'rgba(108,99,255,0.1)',
      trend: '+12% this week',
      trendUp: true,
    },
    {
      label: 'Generated',
      value: statsLoading ? '—' : (stats?.generatedCount ?? 1),
      icon: CheckCircle2,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
      trend: '+3 today',
      trendUp: true,
    },
    {
      label: 'Pending Review',
      value: statsLoading ? '—' : (stats?.draftCount ?? 2),
      icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
      trend: 'Needs attention',
      trendUp: false,
    },
    {
      label: 'Templates',
      value: 6,
      icon: Star,
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.1)',
      trend: '5 popular',
      trendUp: true,
    },
  ];

  const QUICK_ACTIONS = [
    { label: 'New Invoice', prompt: '/generate', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)', icon: FileText },
    { label: 'Offer Letter', prompt: '/generate', color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: Users },
    { label: 'Certificate', prompt: '/generate', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: Shield },
    { label: 'Quotation', prompt: '/generate', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: BarChart3 },
  ];

  return (
    <>
      <style>{`
        .dashboard-page {
          padding: 28px 32px 40px;
          max-width: 1400px;
          margin: 0 auto;
          animation: dashFadeIn 0.3s ease;
        }
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .dash-greeting {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          line-height: 1.15;
        }
        .dash-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .metric-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px 22px 18px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .metric-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.25s;
          pointer-events: none;
        }
        .metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: var(--border-strong);
        }
        .metric-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .metric-value {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 4px;
        }
        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .metric-trend {
          font-size: 11px;
          font-weight: 500;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        .card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
        .card-header {
          padding: 18px 22px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .doc-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          cursor: pointer;
        }
        .doc-row:last-child { border-bottom: none; }
        .doc-row:hover { background: var(--bg-hover); }
        .doc-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-surface-el);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .quick-action-btn:hover {
          transform: translateY(-2px);
          border-color: var(--border-strong);
          background: var(--bg-surface);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .ai-suggestion-card {
          background: linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(129,140,248,0.04) 100%);
          border: 1px solid rgba(108,99,255,0.2);
          border-radius: 14px;
          padding: 18px;
        }
        .expiry-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .expiry-item:last-child { border-bottom: none; }
        @media (max-width: 1100px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
          .dashboard-page { padding: 20px 16px 32px; }
        }
        @media (max-width: 600px) {
          .metrics-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dashboard-page">
        {/* Hero */}
        <div className="dash-hero">
          <div>
            <h1 className="dash-greeting">
              {greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="dash-sub">Here's your workspace overview for today</p>
          </div>
          <Button
            variant="primary"
            icon={<Sparkles size={15} />}
            onClick={() => navigate('/generate')}
          >
            Generate Document
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="metrics-grid">
          {METRIC_CARDS.map((m) => (
            <div key={m.label} className="metric-card">
              <div className="metric-icon" style={{ background: m.bg }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-trend" style={{ color: m.trendUp ? '#10B981' : '#F59E0B' }}>
                <TrendingUp size={11} />
                {m.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="main-grid">
          {/* Left: Recent Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Recent docs card */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Activity size={14} style={{ color: 'var(--color-primary)' }} />
                  Recent Activity
                </span>
                <Link to="/documents" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ChevronRight size={13} />
                </Link>
              </div>

              {docsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="doc-row">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-hover)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 12, width: 180, background: 'var(--bg-hover)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ height: 10, width: 120, background: 'var(--bg-hover)', borderRadius: 4, marginTop: 6, animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ))
                : recentDocs?.data?.length === 0
                  ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      No documents yet. <Link to="/generate" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Generate your first →</Link>
                    </div>
                  )
                  : recentDocs?.data?.map((doc) => (
                    <div
                      key={doc._id}
                      className="doc-row"
                      onClick={() => navigate(`/documents/${doc._id}`)}
                    >
                      <div
                        className="doc-icon"
                        style={{
                          background: doc.status === 'generated' ? 'rgba(16,185,129,0.12)' : doc.status === 'revoked' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        }}
                      >
                        {doc.status === 'generated'
                          ? <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                          : doc.status === 'revoked'
                            ? <AlertCircle size={16} style={{ color: '#ef4444' }} />
                            : <Clock size={16} style={{ color: '#F59E0B' }} />
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.title}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {doc.documentType?.replace('_', ' ')} · {doc.status}
                        </p>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-xmuted)', flexShrink: 0 }}>
                        {formatDate(doc.updatedAt)}
                      </span>
                      <ArrowUpRight size={13} style={{ color: 'var(--text-xmuted)', flexShrink: 0 }} />
                    </div>
                  ))
              }
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Zap size={14} style={{ color: '#F59E0B' }} />
                  Quick Actions
                </span>
              </div>
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.label} className="quick-action-btn" onClick={() => navigate(a.prompt)}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <a.icon size={16} style={{ color: a.color }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Suggestion */}
            <div className="ai-suggestion-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={13} style={{ color: '#818CF8' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#818CF8', letterSpacing: '-0.01em' }}>AI Insight</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You frequently generate <strong>Invoices</strong> at the end of the month. Would you like to set up automated batch generation?
              </p>
              <button
                onClick={() => navigate('/batch')}
                style={{
                  marginTop: 14, width: '100%', padding: '9px 14px',
                  borderRadius: 10, border: '1px solid rgba(108,99,255,0.3)',
                  background: 'rgba(108,99,255,0.1)', color: '#818CF8',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; }}
              >
                <Zap size={13} /> Configure Automation
              </button>
            </div>

            {/* Upcoming Expirations */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Clock size={14} style={{ color: '#F59E0B' }} />
                  Upcoming Expirations
                </span>
              </div>
              <div style={{ padding: '8px 18px 12px' }}>
                <div className="expiry-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>Acme NDA</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>2 days</span>
                </div>
                <div className="expiry-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>Vendor Contract</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Next week</span>
                </div>
                <div className="expiry-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>Partnership MOU</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>30 days</span>
                </div>
              </div>
            </div>

            {/* Stats mini */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <BarChart3 size={14} style={{ color: '#6C63FF' }} />
                  This Month
                </span>
              </div>
              <div style={{ padding: '12px 18px 16px' }}>
                {[
                  { label: 'Invoices', count: 4, max: 8, color: '#6C63FF' },
                  { label: 'Offer Letters', count: 2, max: 8, color: '#10B981' },
                  { label: 'Certificates', count: 6, max: 8, color: '#F59E0B' },
                  { label: 'Other', count: 1, max: 8, color: '#3B82F6' },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.count}</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: item.color,
                        borderRadius: 3,
                        width: `${(item.count / item.max) * 100}%`,
                        transition: 'width 0.8s ease',
                      }} />
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
