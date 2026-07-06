import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';











const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};

export function Modal({ open, onClose, title, description, children, size = 'md', className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {if (e.key === 'Escape') onClose();};
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} className={cn('relative w-full bg-[var(--bg-surface)] rounded-xl shadow-xl border border-[var(--border)] animate-in', sizes[size], className)}>
        {(title || description) &&
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <div>
              {title && <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>}
              {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
            </div>
            <button onClick={onClose} className="ml-4 p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors">
              <X size={16} />
            </button>
          </div>
        }
        <div className="p-6">{children}</div>
      </div>
    </div>);

}