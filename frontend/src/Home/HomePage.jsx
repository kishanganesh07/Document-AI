import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import { FileText, Edit3, LayoutTemplate, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomePage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchRecentStats
  });

  const { data: recentDocs, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', { pageSize: 10 }],
    queryFn: () => fetchDocuments({ pageSize: 10 })
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1.5 text-sm font-medium">Welcome back. Here's what's happening with your documents today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Documents"
          value={stats?.totalDocuments}
          icon={<FileText size={20} />}
          loading={statsLoading}
          bgClass="bg-blue-500/5 text-blue-600 dark:text-blue-400"
        />
        
        <KpiCard
          title="Active Drafts"
          value={stats?.drafts}
          icon={<Edit3 size={20} />}
          loading={statsLoading}
          bgClass="bg-amber-500/5 text-amber-600 dark:text-amber-400"
        />
        
        <KpiCard
          title="Templates Used"
          value={stats?.templatesUsed}
          icon={<LayoutTemplate size={20} />}
          loading={statsLoading}
          bgClass="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Main Content Area - Full Width Recent Documents */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Documents</h2>
          <Link to="/documents" className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center gap-1 transition-colors">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docsLoading ?
          Array.from({ length: 6 }).map((_, i) =>
          <div key={i} className="flex gap-3 p-3 border border-[var(--border)]/40 rounded-xl">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
          ) :
          recentDocs?.data.length === 0 ?
          <div className="col-span-2 text-center py-8 text-sm text-[var(--text-muted)]">No documents yet.</div> :

          recentDocs?.data.map((doc) =>
          <Link key={doc._id} to={`/documents/${doc._id}`} className="flex items-start gap-3 p-3.5 border border-[var(--border)]/50 rounded-xl hover:bg-[var(--bg-hover)]/30 hover:border-[var(--color-primary)]/40 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-el)] border border-[var(--border)]/60 flex items-center justify-center shrink-0 text-[var(--text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all duration-300">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {doc.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={doc.status} />
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">{formatDate(doc.updatedAt)}</span>
                  </div>
                </div>
              </Link>
          )
          }
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, loading, bgClass }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-[var(--border)]/80 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{title}</p>
        {loading ?
        <Skeleton className="h-8 w-16 mt-1.5" /> :

        <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mt-1">{value?.toLocaleString()}</h3>
        }
      </div>
    </div>
  );
}