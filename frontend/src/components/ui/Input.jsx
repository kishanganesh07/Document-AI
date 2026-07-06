import React from 'react';
import { cn } from '@/lib/utils';









export const Input = React.forwardRef(
  ({ label, error, helpText, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label &&
        <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        }
        <div className="relative flex items-center">
          {leftIcon &&
          <span className="absolute left-3 text-[var(--text-muted)] flex items-center">{leftIcon}</span>
          }
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] transition-colors duration-150',
              'focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
              leftIcon && 'pl-9',
              rightElement && 'pr-9',
              className
            )}
            {...props} />
          
          {rightElement &&
          <span className="absolute right-3 text-[var(--text-muted)] flex items-center">{rightElement}</span>
          }
        </div>
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        {helpText && !error && <p className="text-xs text-[var(--text-muted)]">{helpText}</p>}
      </div>);

  }
);
Input.displayName = 'Input';







export const Textarea = React.forwardRef(
  ({ label, error, helpText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label &&
        <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        }
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] transition-colors duration-150 resize-none',
            'focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-error)]',
            className
          )}
          rows={3}
          {...props} />
        
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        {helpText && !error && <p className="text-xs text-[var(--text-muted)]">{helpText}</p>}
      </div>);

  }
);
Textarea.displayName = 'Textarea';







export const Select = React.forwardRef(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label &&
        <label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        }
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] transition-colors duration-150 cursor-pointer',
            'focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
            error && 'border-[var(--color-error)]',
            className
          )}
          {...props}>
          
          <option value="">Select...</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      </div>);

  }
);
Select.displayName = 'Select';