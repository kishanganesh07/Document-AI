import { useNotificationStore } from '@/stores/notification.store';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: <CheckCircle2 size={18} className="text-[var(--color-success)]" />,
  error: <AlertCircle size={18} className="text-[var(--color-error)]" />,
  warning: <AlertTriangle size={18} className="text-[var(--color-warning)]" />,
  info: <Info size={18} className="text-[var(--color-primary)]" />
};

export function ToastContainer() {
  const { toasts, dismissToast } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md",
              "bg-[var(--bg-surface)] border-[var(--border)]"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {ICONS[toast.variant] || ICONS.info}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-[var(--text-muted)] mt-1 break-words">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 p-1 text-[var(--text-xmuted)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
