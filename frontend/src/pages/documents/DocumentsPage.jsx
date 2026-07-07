import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '@/api/document.api';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Search, Eye, Download, FileText, Plus, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function DocumentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['documents', { search, status: statusFilter, type: typeFilter }],
    queryFn: () => fetchDocuments({ search, status: statusFilter, documentType: typeFilter }),
  });

  const hasFilters = search || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="page-container space-y-6 animate-fade-in flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Documents</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {data?.total ? `${data.total} documents` : 'All generated and saved documents.'}
          </p>
        </div>
        <Link to="/generate">
          <Button variant="primary" icon={<Plus size={15} />}>
            New Document
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[var(--bg-surface-el)]/50">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search documents or client name..."
              leftIcon={<Search size={14} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={14} className="text-[var(--text-muted)]" />
            <div className="w-36">
              <Select
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Generated', value: 'generated' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Verified', value: 'verified' },
                  { label: 'Revoked', value: 'revoked' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Select
                options={[
                  { label: 'All Types', value: 'all' },
                  { label: 'Invoice', value: 'invoice' },
                  { label: 'Offer Letter', value: 'offer_letter' },
                  { label: 'Quotation', value: 'quotation' },
                  { label: 'Certificate', value: 'certificate' },
                  { label: 'Report', value: 'report' },
                ]}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-surface-el)] text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3.5">Document</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Updated</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-primary)]">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[var(--bg-hover)] animate-pulse" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 skeleton-pulse rounded w-40" />
                            <div className="h-3 skeleton-pulse rounded w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-5 skeleton-pulse rounded-full w-20" /></td>
                      <td className="px-6 py-4"><div className="h-5 skeleton-pulse rounded-full w-20" /></td>
                      <td className="px-6 py-4"><div className="h-3 skeleton-pulse rounded w-24" /></td>
                      <td className="px-6 py-4" />
                    </tr>
                  ))
                : data?.data.length === 0
                ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-4xl mb-4">
                            📄
                          </div>
                          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            {hasFilters ? 'No documents found' : 'Your workspace is empty'}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
                            {hasFilters ? 'Try adjusting your filters.' : 'Generate your first document to get started.'}
                          </p>
                          {hasFilters
                            ? (
                                <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}>
                                  Clear Filters
                                </Button>
                              )
                            : (
                                <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/generate')}>
                                  Generate Document
                                </Button>
                              )}
                        </div>
                      </td>
                    </tr>
                  )
                : data?.data.map((doc) => (
                    <tr key={doc._id} className="even:bg-[var(--bg-surface-el)] odd:bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-10 bg-white border border-[var(--border)] shadow-sm rounded-sm shrink-0 p-1 flex flex-col gap-0.5">
                            <div className="h-0.5 w-3 bg-gray-200 rounded-sm" />
                            <div className="h-[1px] w-4 bg-gray-100 rounded-sm" />
                            <div className="h-[1px] w-4 bg-gray-100 rounded-sm" />
                            <div className="mt-auto h-1.5 w-full bg-[var(--color-primary)]/10 rounded-sm" />
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--text-primary)] text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                              {doc.title}
                            </div>
                            {doc.recipientName && (
                              <div className="text-xs text-[var(--text-xmuted)] mt-0.5">
                                To: {doc.recipientName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <DocumentTypeBadge type={doc.documentType} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                        {formatDate(doc.updatedAt, 'long')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/documents/${doc._id}`}>
                            <Button variant="ghost" size="xs" icon={<Eye size={13} />}>View</Button>
                          </Link>
                          {doc.status === 'generated' && (
                            <Button
                              variant="ghost"
                              size="xs"
                              icon={<Download size={13} />}
                              title="View & Download"
                              onClick={() => navigate(`/documents/${doc._id}`)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)] bg-[var(--bg-surface-el)]/40 shrink-0">
          <div>
            Showing <span className="font-semibold text-[var(--text-primary)]">{data?.data.length || 0}</span> of{' '}
            <span className="font-semibold text-[var(--text-primary)]">{data?.total || 0}</span> documents
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>← Previous</Button>
            <Button variant="outline" size="sm" disabled>Next →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}