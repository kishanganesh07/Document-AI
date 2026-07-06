import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { verifyDocument } from '@/api/document.api';

import { formatDate } from '@/lib/utils';
import { DOCUMENT_TYPE_LABELS } from '@/lib/utils';

export function VerifyPage() {
  const { verificationId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('not_found');

  useEffect(() => {
    if (!verificationId || verificationId === 'demo') {
      setLoading(false);
      setStatus('not_found');
      return;
    }
    verifyDocument(verificationId).then((doc) => {
      setDocument(doc);
      if (doc) {
        setStatus(doc.status === 'revoked' ? 'revoked' : 'valid');
      }
      setLoading(false);
    });
  }, [verificationId]);

  return (
    <div className="min-h-screen bg-app flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)]">DocuFlow Verification</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {loading ?
          <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-[var(--text-muted)]">Verifying document...</p>
            </div> :
          status === 'valid' && document ?
          <ValidState document={document} /> :
          status === 'revoked' && document ?
          <RevokedState document={document} /> :

          <NotFoundState verificationId={verificationId} />
          }
        </div>
      </div>

      <footer className="border-t border-[var(--border)] py-4">
        <p className="text-center text-xs text-[var(--text-xmuted)]">
          Powered by <span className="text-[var(--color-primary)]">DocuFlow</span> — AI Document Verification
        </p>
      </footer>
    </div>);

}

function ValidState({ document }) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--color-success-border)] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--color-success-bg)] px-6 py-5 border-b border-[var(--color-success-border)]">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={24} className="text-[var(--color-success)]" />
          <div>
            <h1 className="text-base font-semibold text-[var(--color-success)]">Document Verified</h1>
            <p className="text-xs text-[var(--color-success)] opacity-80">
              This document is authentic and matches the issuer's official record.
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-5 space-y-4">
        <InfoRow label="Document Title" value={document.title} />
        <InfoRow label="Document Type" value={DOCUMENT_TYPE_LABELS[document.documentType]} />
        {document.recipientName && <InfoRow label="Recipient / Client" value={document.recipientName} />}
        <InfoRow label="Issuer" value="TechFlow Systems" />
        <InfoRow label="Issue Date" value={formatDate(document.verification?.issuedAt || document.createdAt)} />
        <InfoRow label="Verification ID" value={document.verificationId || '—'} mono />
        {document.verification?.lastVerifiedAt &&
        <InfoRow label="Last Verified" value={formatDate(document.verification.lastVerifiedAt, 'relative')} />
        }
      </div>

      {/* Security */}
      <div className="px-6 py-4 bg-[var(--bg-surface-el)] border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">Document integrity confirmed</p>
        {document.verification?.documentHash &&
        <p className="text-[10px] text-[var(--text-xmuted)] font-mono break-all">
            {document.verification.documentHash.slice(0, 64)}...
          </p>
        }
      </div>
    </div>);

}

function RevokedState({ document }) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--color-error-border)] shadow-lg overflow-hidden">
      <div className="bg-[var(--color-error-bg)] px-6 py-5 border-b border-[var(--color-error-border)]">
        <div className="flex items-center gap-3">
          <XCircle size={24} className="text-[var(--color-error)]" />
          <div>
            <h1 className="text-base font-semibold text-[var(--color-error)]">Document Revoked</h1>
            <p className="text-xs text-[var(--color-error)] opacity-80">
              This document was previously issued but has been revoked by the issuer.
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <InfoRow label="Document" value={document.title} />
        {document.verification?.revokedAt &&
        <InfoRow label="Revoked On" value={formatDate(document.verification.revokedAt)} />
        }
        {document.verification?.revocationReason &&
        <InfoRow label="Reason" value={document.verification.revocationReason} />
        }
        <InfoRow label="Verification ID" value={document.verificationId || '—'} mono />
      </div>
    </div>);

}

function NotFoundState({ verificationId }) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] shadow-lg overflow-hidden">
      <div className="px-6 py-8 text-center">
        <AlertCircle size={40} className="text-[var(--text-xmuted)] mx-auto mb-4" />
        <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Document Not Found</h1>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          We could not find a document matching verification ID{' '}
          {verificationId && <code className="font-mono bg-[var(--bg-surface-el)] px-1.5 py-0.5 rounded">{verificationId}</code>}.
        </p>
        <p className="text-xs text-[var(--text-xmuted)]">
          Please check the ID or contact the document issuer.
        </p>
      </div>
    </div>);

}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-[var(--text-muted)] shrink-0">{label}</span>
      <span className={`text-xs text-[var(--text-primary)] text-right ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
    </div>);

}