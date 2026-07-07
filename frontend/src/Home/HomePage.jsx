import { useQuery } from '@tanstack/react-query';
import { fetchRecentStats, fetchDocuments } from '@/api/document.api';
import {
  FileText, Edit3, LayoutTemplate, ArrowUpRight,
  Sparkles, TrendingUp, Clock, ChevronRight,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const CONTINUE_WORKING = {
  title: 'Invoice for Stripe',
  type: 'invoice',
  updatedAt: '10 min ago',
  id: 'doc_1',
};

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
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
            {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1.5 text-base">
            Here's what is happening in your workspace today.
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

      {/* Today's Summary & Continue Working */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Today's Summary */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 pb-2 border-b border-[var(--border)]">
            Today
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} className="text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">3 documents generated</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={12} className="text-[var(--color-warning)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">2 drafts need attention</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[var(--bg-hover)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px]">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">1 teammate invited</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Continue Working */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 pb-2 border-b border-[var(--border)]">
            Continue Working
          </h2>
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 hover:-translate-y-[1px] hover:shadow-sm transition-all cursor-pointer group" onClick={() => navigate(`/documents/${CONTINUE_WORKING.id}`)}>
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {/* Tiny Thumbnail */}
                <div className="w-12 h-16 bg-white border border-[var(--border)] shadow-sm rounded shrink-0 p-1.5 flex flex-col gap-1">
                  <div className="h-1.5 w-4 bg-gray-200 rounded-sm" />
                  <div className="h-0.5 w-6 bg-gray-100 rounded-sm" />
                  <div className="h-0.5 w-5 bg-gray-100 rounded-sm" />
                  <div className="mt-auto h-2 w-full bg-blue-50/50 rounded-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{CONTINUE_WORKING.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Edited {CONTINUE_WORKING.updatedAt}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Continue <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-6">
        
        {/* Recent Activity — wide column */}
        <div className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 pb-2 border-b border-[var(--border)]">
            Recent Activity
          </h2>

          <div className="space-y-1">
            {docsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-2 py-3">
                    <div className="h-8 w-8 rounded-full skeleton-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 skeleton-pulse rounded w-48" />
                    </div>
                  </div>
                ))
              : recentDocs?.data.length === 0
              ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">No recent activity.</p>
                  </div>
                )
              : recentDocs?.data.map((doc, idx) => (
                  <div
                    key={doc._id}
                    className="flex items-start gap-4 px-2 py-3 hover:bg-[var(--bg-hover)] rounded-lg transition-colors group"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      doc.status === 'generated' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                    )}>
                      {doc.status === 'generated' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {doc.documentType === 'invoice' ? 'Invoice' : doc.documentType === 'offer_letter' ? 'Offer letter' : 'Document'}{' '}
                          <span className="text-[var(--text-secondary)] font-normal">{doc.status === 'generated' ? 'generated' : 'needs review'}</span>
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {doc.title}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-xmuted)] shrink-0">{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Widgets panel */}
        <div className="space-y-8">
          
          <div>
             <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 pb-2 border-b border-[var(--border)]">
              Upcoming Expirations
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]" />
                  Acme NDA
                </div>
                <span className="text-xs font-medium text-[var(--color-error)]">2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                  Vendor Contract
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)]">Next week</span>
              </div>
            </div>
          </div>

          <div>
             <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 pb-2 border-b border-[var(--border)]">
              AI Suggestions
            </h2>
            <div className="bg-[var(--bg-surface-el)] rounded-xl p-4">
               <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                 You frequently generate <strong>Invoices</strong> at the end of the month. Would you like to set up an automated batch run?
               </p>
               <Button variant="outline" size="sm" className="mt-4 w-full bg-white">
                 Configure Automation
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
