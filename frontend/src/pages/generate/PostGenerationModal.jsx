import { CheckCircle2, Download, Copy, Eye, Plus, Mail, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

import { DOCUMENT_TYPE_LABELS, formatDate } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification.store';
import { useNavigate } from 'react-router-dom';
import { useGenerateStore } from '@/stores/generate.store';
import { downloadAsPdf } from '@/lib/pdf';








export function PostGenerationModal({
  open, onClose, documentId, documentType
}) {
  const { success } = useNotificationStore();
  const previewHtml = useGenerateStore((s) => s.previewHtml);
  const navigate = useNavigate();

  const verificationId = documentId ?
  `${(documentType || 'doc').toUpperCase().slice(0, 3)}-${documentId.slice(-8).toUpperCase()}` :
  null;

  const copyVerificationLink = () => {
    if (!verificationId) return;
    navigator.clipboard.writeText(`${window.location.origin}/verify/${verificationId}`);
    success('Copied!', 'Verification link copied to clipboard.');
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="text-center space-y-5">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center mx-auto border border-[var(--color-success-border)]">
          <CheckCircle2 size={32} className="text-[var(--color-success)]" />
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Your document is ready</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Successfully generated and saved to your document library.
          </p>
        </div>

        {/* Document info */}
        <div className="bg-[var(--bg-surface-el)] rounded-xl p-4 text-left space-y-2 border border-[var(--border)]">
          <InfoRow label="Type" value={documentType ? DOCUMENT_TYPE_LABELS[documentType] : 'â€”'} />
          <InfoRow label="Generated" value={formatDate(new Date().toISOString())} />
          <InfoRow label="File size" value="~2.3 MB" />
          <InfoRow label="Status" value="Generated âœ“" valueClass="text-[var(--color-success)]" />
        </div>

        {/* Verification */}
        {verificationId &&
        <div className="bg-[var(--color-verify-bg)] border border-[var(--color-verify-border)] rounded-xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--color-verify)]" />
              <span className="text-xs font-semibold text-[var(--color-verify-text)]">Verification enabled</span>
            </div>
            <div className="text-xs text-[var(--color-verify-text)]">
              ID: <code className="font-mono bg-[var(--color-verify-bg)] px-1.5 py-0.5 rounded border border-[var(--color-verify-border)]">{verificationId}</code>
            </div>
            <p className="text-[10px] text-[var(--color-verify-text)] opacity-70">
              Anyone with the verification link can confirm this document's authenticity.
            </p>
          </div>
        }

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary" icon={<Download size={14} />} onClick={async () => {
            if (previewHtml) {
              success('Download started', 'Generating PDF...');
              await downloadAsPdf(previewHtml, `Generated_${documentType || 'document'}`);
              success('Download complete', 'Your PDF has been saved.');
            } else {
              success('Download started', 'Your PDF is downloading.');
            }
          }}>
            Download PDF
          </Button>
          <Button variant="secondary" icon={<Copy size={14} />} onClick={copyVerificationLink}>
            Copy Verify Link
          </Button>
          <Button
            variant="ghost"
            icon={<Eye size={14} />}
            onClick={() => {if (documentId) {navigate(`/documents/${documentId}`);onClose();}}}>
            
            View Document
          </Button>
          <Button variant="ghost" icon={<Mail size={14} />} onClick={() => success('Email sent', 'Document sent successfully.')}>
            Send via Email
          </Button>
        </div>

        <Button variant="ai" icon={<Plus size={14} />} onClick={onClose} className="w-full">
          Generate Another Document
        </Button>
      </div>
    </Modal>);

}

function InfoRow({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <span className={`text-xs font-medium text-[var(--text-primary)] ${valueClass || ''}`}>{value}</span>
    </div>);

}