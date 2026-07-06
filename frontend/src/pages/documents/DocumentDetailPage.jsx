import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/api/document.api';
import { generateDocumentPreviewHtml } from '@/api/ai.api';
import { downloadAsPdf } from '@/lib/pdf';
import { StatusBadge, DocumentTypeBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DocumentPreview } from '@/components/domain/document/DocumentPreview';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Download, Edit3, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';

export function DocumentDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { success } = useNotificationStore();
  const [html, setHtml] = useState(null);

  const { data: document, isLoading, isError } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId
  });

  useEffect(() => {
    if (document) {
      generateDocumentPreviewHtml(document.documentType, document.documentData).then(setHtml);
    }
  }, [document]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <div className="h-[600px] w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl" />
      </div>);

  }

  if (isError || !document) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Document Not Found</h2>
        <p className="text-[var(--text-muted)] mt-2">The document you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/documents" className="inline-block mt-6">
          <Button variant="primary">Back to Documents</Button>
        </Link>
      </div>);

  }

  const handleDownload = async () => {
    if (!html) return;
    try {
      success('Download started', 'Generating PDF...');
      await downloadAsPdf(html, document.title);
      success('Download complete', 'Your PDF has been saved.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 shrink-0">
        <div className="space-y-3">
          <Link to="/documents" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{document.title}</h1>
            <StatusBadge status={document.status} />
            <DocumentTypeBadge type={document.documentType} />
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--text-muted)]" />
              Last updated {formatDate(document.updatedAt, 'long')}
            </div>
            {document.verificationId &&
            <div className="flex items-center gap-1.5 text-[var(--color-verify)]">
                <ShieldCheck size={14} />
                ID: {document.verificationId}
              </div>
            }
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" icon={<Edit3 size={16} />}>Edit Data</Button>
          <Button variant="primary" icon={<Download size={16} />} onClick={handleDownload}>
            Download PDF
          </Button>
          <Button variant="ghost" className="text-[var(--color-error)] hover:bg-[var(--color-error-bg)]" icon={<Trash2 size={16} />} />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Preview Panel */}
        <div className="lg:col-span-2 h-full overflow-hidden bg-[var(--bg-surface-el)] border border-[var(--border)] rounded-xl shadow-inner relative">
          <DocumentPreview html={html} isLoading={!html} />
        </div>

        {/* Metadata Panel */}
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Document Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--text-muted)]">Document Type</span>
                <span className="font-medium text-[var(--text-primary)] capitalize">{document.documentType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--text-muted)]">Schema Version</span>
                <span className="font-medium text-[var(--text-primary)]">{document.schemaVersion}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--text-muted)]">Created</span>
                <span className="font-medium text-[var(--text-primary)]">{formatDate(document.createdAt)}</span>
              </div>
              {document.recipientName &&
              <div className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-[var(--text-muted)]">Recipient</span>
                  <span className="font-medium text-[var(--text-primary)]">{document.recipientName}</span>
                </div>
              }
            </div>
          </div>
          
          {document.status === 'generated' && document.verificationId &&
          <div className="bg-[var(--color-verify-bg)] border border-[var(--color-verify-border)] rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-[var(--color-verify)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-verify)]">Cryptographically Verified</h3>
                  <p className="text-xs text-[var(--color-verify)]/80 mt-1 mb-3">
                    This document's integrity is secured. It can be verified independently by third parties using the Verification ID.
                  </p>
                  <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white text-[var(--color-verify)] border-[var(--color-verify-border)] hover:bg-[var(--color-verify)] hover:text-white"
                  onClick={() => navigate(`/verify/${document.verificationId}`)}>
                  
                    View Public Verification Page
                  </Button>
                </div>
              </div>
            </div>
          }
        </div>

      </div>

    </div>);

}