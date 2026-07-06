import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { cn } from '@/lib/utils';

const icons = {
  success: <CheckCircle size={18} className="text-[var(--color-success)]" />,
  error: <XCircle size={18} className="text-[var(--color-error)]" />,
  warning: <AlertTriangle size={18} className="text-[var(--color-warning)]" />,
  info: <Info size={18} className="text-[var(--color-info)]" />
};

const variants = {
  success: 'border-[var(--color-success-border)] bg-[var(--color-success-bg)]',
  error: 'border-[var(--color-error-border)] bg-[var(--color-error-bg)]',
  warning: 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]',
  info: 'border-[var(--color-info-border)] bg-[var(--color-info-bg)]'
};

export function ToastContainer() {
  const { toasts, dismissToast } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) =>
      <div
        key={toast.id}
        className={cn(
          'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md animate-slide-up',
          variants[toast.variant]
        )}>
        
          <div className="shrink-0 mt-0.5">{icons[toast.variant]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{toast.title}</h4>
            {toast.description &&
          <p className="text-xs text-[var(--text-secondary)] mt-1">{toast.description}</p>
          }
          </div>
          <button
          onClick={() => dismissToast(toast.id)}
          className="shrink-0 p-1 -mr-1 -mt-1 rounded-md text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          
            <X size={14} />
          </button>
        </div>
      )}
    </div>);

}