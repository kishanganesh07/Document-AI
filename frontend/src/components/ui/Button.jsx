import React from 'react';
import { cn } from '@/lib/utils';









const variants = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-sm',
  secondary: 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-strong)]',
  ghost: 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-[var(--color-error-bg)] hover:bg-[var(--color-error)] hover:text-white text-[var(--color-error)] border border-[var(--color-error-border)]',
  outline: 'border border-[var(--border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-[var(--text-secondary)]',
  ai: 'bg-[var(--color-ai-bg)] hover:bg-[var(--color-ai-border)] text-[var(--color-ai)] border border-[var(--color-ai-border)]'
};

const sizes = {
  xs: 'px-2 py-1 text-xs gap-1 rounded-md',
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-sm gap-2 rounded-lg font-medium'
};

export const Button = React.forwardRef(
  ({ variant = 'secondary', size = 'md', loading, icon, iconRight, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}>
        
        {loading ? <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" /> : icon}
        {children}
        {!loading && iconRight}
      </button>);

  }
);
Button.displayName = 'Button';