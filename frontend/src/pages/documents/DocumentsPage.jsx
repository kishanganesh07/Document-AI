import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '@/api/document.api';

import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Search, Filter, Eye, Download, MoreVertical, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['documents', { search, status: statusFilter, type: typeFilter }],
    queryFn: () => fetchDocuments({ search, status: statusFilter, documentType: typeFilter })
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Documents</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage and track all generated documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/generate">
            <Button variant="primary">Generate New</Button>
          </Link>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm flex flex-col flex-1 min-h-0">
        
        {/* Filters */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by title or client name..."
              leftIcon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40">
              <Select
                options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Generated', value: 'generated' },
                { label: 'Draft', value: 'draft' },
                { label: 'Verified', value: 'verified' },
                { label: 'Revoked', value: 'revoked' }]
                }
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)} />
              
            </div>
            <div className="w-48">
              <Select
                options={[
                { label: 'All Document Types', value: 'all' },
                { label: 'Invoice', value: 'invoice' },
                { label: 'Offer Letter', value: 'offer_letter' },
                { label: 'Quotation', value: 'quotation' },
                { label: 'Certificate', value: 'certificate' },
                { label: 'Report', value: 'report' }]
                }
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)} />
              
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--bg-surface-el)] text-[var(--text-secondary)] font-medium sticky top-0 z-10 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3">Document Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
              {isLoading ?
              Array.from({ length: 5 }).map((_, i) =>
              <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-28"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
              ) :
              data?.data.length === 0 ?
              <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={32} className="mb-3 text-[var(--text-xmuted)]" />
                      <p>No documents found matching your criteria.</p>
                      <Button variant="ghost" size="sm" className="mt-4" onClick={() => {setSearch('');setStatusFilter('all');setTypeFilter('all');}}>
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr> :

              data?.data.map((doc) =>
              <tr key={doc._id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{doc.title}</div>
                      {doc.recipientName && <div className="text-xs text-[var(--text-muted)] mt-0.5">To: {doc.recipientName}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <DocumentTypeBadge type={doc.documentType} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {formatDate(doc.updatedAt, 'long')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/documents/${doc._id}`}>
                          <Button variant="ghost" size="xs" icon={<Eye size={14} />}>View</Button>
                        </Link>
                        {doc.status === 'generated' &&
                    <Button variant="ghost" size="xs" icon={<Download size={14} />} title="Download PDF" />
                    }
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <div>Showing {data?.data.length || 0} of {data?.total || 0} results</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

      </div>
    </div>);

}