import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Edit3, LayoutTemplate, ArrowUpRight } from 'lucide-react';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomePage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchRecentStats
  });

  const { data: recentDocs, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', { pageSize: 5 }],
    queryFn: () => fetchDocuments({ pageSize: 5 })
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1">Welcome back. Here's what's happening with your documents today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Documents"
          value={stats?.totalDocuments}
          icon={<FileText size={20} />}
          loading={statsLoading} />
        
        <KpiCard
          title="Active Drafts"
          value={stats?.drafts}
          icon={<Edit3 size={20} />}
          loading={statsLoading} />
        
        <KpiCard
          title="Templates Used"
          value={stats?.templatesUsed}
          icon={<LayoutTemplate size={20} />}
          loading={statsLoading} />
        
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Documents Generated (Last 30 Days)</h2>
          <div className="h-72 w-full">
            {statsLoading ?
            <Skeleton className="w-full h-full" /> :

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  dy={10}
                  minTickGap={30} />
                
                  <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                
                  <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }} />
                
                  <Line
                  type="monotone"
                  dataKey="generated"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'var(--color-primary)' }} />
                
                </LineChart>
              </ResponsiveContainer>
            }
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Documents</h2>
            <Link to="/documents" className="text-xs font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {docsLoading ?
            Array.from({ length: 5 }).map((_, i) =>
            <div key={i} className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
            ) :
            recentDocs?.data.length === 0 ?
            <div className="text-center py-8 text-sm text-[var(--text-muted)]">No documents yet.</div> :

            recentDocs?.data.map((doc) =>
            <Link key={doc._id} to={`/documents/${doc._id}`} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-el)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={doc.status} />
                      <span className="text-[11px] text-[var(--text-muted)]">{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
            )
            }
          </div>
        </div>
        
      </div>
    </div>);

}

function KpiCard({ title, value, icon, loading }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
        {loading ?
        <Skeleton className="h-8 w-16 mt-1" /> :

        <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{value?.toLocaleString()}</h3>
        }
      </div>
    </div>);

}