import { cn } from '@/lib/utils';





const badgeVariants = {
  default: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  error: 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  ai: 'bg-[var(--color-ai-bg)] text-[var(--color-ai)]',
  verify: 'bg-[var(--color-verify-bg)] text-[var(--color-verify)]',
  muted: 'bg-[var(--bg-surface-el)] text-[var(--text-muted)]'
};

export function Badge({ variant = 'default', children, className, dot, size = 'sm' }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium rounded-full', size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs', badgeVariants[variant], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>);

}

export function StatusBadge({ status }) {
  const map = {
    draft: { label: 'Draft', variant: 'muted' },
    needs_review: { label: 'Needs Review', variant: 'warning' },
    validated: { label: 'Validated', variant: 'info' },
    generated: { label: 'Generated', variant: 'success' },
    verified: { label: 'Verified', variant: 'verify' },
    expired: { label: 'Expired', variant: 'warning' },
    revoked: { label: 'Revoked', variant: 'error' }
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function DocumentTypeBadge({ type }) {
  const labels = {
    invoice: 'Invoice', quotation: 'Quotation', offer_letter: 'Offer Letter', certificate: 'Certificate', report: 'Report', question_paper: 'Question Paper'
  };
  return <Badge variant="default">{labels[type]}</Badge>;
}