import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import {
  FileText, Edit3, LayoutTemplate, ArrowUpRight,
  Sparkles, TrendingUp, Clock, ChevronRight
} from 'lucide-react';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { label: 'Generate Invoice', emoji: '🧾', path: '/generate', color: 'hover:border-blue-500/40 hover:bg-blue-500/5' },
  { label: 'Create Offer Letter', emoji: '✉️', path: '/generate', color: 'hover:border-emerald-500/40 hover:bg-emerald-500/5' },
  { label: 'Issue Certificate', emoji: '🏆', path: '/generate', color: 'hover:border-violet-500/40 hover:bg-violet-500/5' },
  { label: 'Prepare Quotation', emoji: '📋', path: '/generate', color: 'hover:border-amber-500/40 hover:bg-amber-500/5' },
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

  return (
    <div className="page-container space-y-7 animate-fade-in">
      {/* Hero Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            Here's an overview of your workspace today.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Sparkles size={15} />}
          onClick={() => navigate('/generate')}
        >
          Generate Document
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Documents"
          value={stats?.totalDocuments}
          icon={<FileText size={18} />}
          loading={statsLoading}
          trend="+12% this month"
          iconClass="bg-blue-500/10 text-blue-500"
          accentClass="border-l-blue-500"
        />
        <KpiCard
          title="Active Drafts"
          value={stats?.drafts}
          icon={<Edit3 size={18} />}
          loading={statsLoading}
          trend="Needs attention"
          iconClass="bg-amber-500/10 text-amber-500"
          accentClass="border-l-amber-500"
        />
        <KpiCard
          title="Templates Used"
          value={stats?.templatesUsed}
          icon={<LayoutTemplate size={18} />}
          loading={statsLoading}
          trend="Across all types"
          iconClass="bg-emerald-500/10 text-emerald-500"
          accentClass="border-l-emerald-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Documents — wide column */}
        <div className="xl:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[var(--text-muted)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Recent Documents</h2>
            </div>
            <Link
              to="/documents"
              className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {docsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-lg skeleton-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 skeleton-pulse rounded w-48" />
                      <div className="h-3 skeleton-pulse rounded w-24" />
                    </div>
                    <div className="h-5 skeleton-pulse rounded-full w-20" />
                  </div>
                ))
              : recentDocs?.data.length === 0
              ? (
                  <div className="flex flex-col items-center py-14 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-el)] flex items-center justify-center mb-3">
                      <FileText size={20} className="text-[var(--text-xmuted)]" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">No documents yet</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Generate your first document to see it here.</p>
                    <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/generate')}>
                      Get Started
                    </Button>
                  </div>
                )
              : recentDocs?.data.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/documents/${doc._id}`}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-[var(--bg-hover)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/8 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] transition-colors">
                      <FileText size={15} className="text-[var(--color-primary)] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-xs text-[var(--text-xmuted)] mt-0.5">{formatDate(doc.updatedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={doc.status} />
                      <ChevronRight size={14} className="text-[var(--text-xmuted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* Quick Actions panel */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border)]">
              <TrendingUp size={16} className="text-[var(--text-muted)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-left transition-all text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    action.color
                  )}
                >
                  <span className="text-base">{action.emoji}</span>
                  {action.label}
                  <ChevronRight size={14} className="ml-auto text-[var(--text-xmuted)]" />
                </button>
              ))}
            </div>
          </div>

          {/* Browse templates */}
          <Link
            to="/templates"
            className="flex items-center gap-3 bg-gradient-to-br from-[var(--color-primary)]/10 to-violet-500/5 border border-[var(--color-primary)]/15 rounded-2xl p-5 hover:border-[var(--color-primary)]/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-sm">
              <LayoutTemplate size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)]">Browse Templates</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Start from a pre-built layout</p>
            </div>
            <ArrowUpRight size={16} className="text-[var(--color-primary)] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, loading, trend, iconClass, accentClass }) {
  return (
    <div className={cn(
      'bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)] border-l-4 hover:shadow-[var(--shadow-md)] transition-all duration-200',
      accentClass
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconClass)}>
          {icon}
        </div>
        {!loading && (
          <span className="text-xs text-[var(--text-xmuted)] font-medium">{trend}</span>
        )}
      </div>
      {loading
        ? <Skeleton className="h-8 w-16 mt-1" />
        : <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{value?.toLocaleString() ?? '—'}</div>
      }
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">{title}</p>
    </div>
  );
}