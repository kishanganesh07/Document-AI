import { useState, useRef, useEffect } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';


import { ValidationMessage } from './ValidationMessage';









export function EditableField({ field, value, onChange, validation, isAIGenerated }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value ?? ''));
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(String(value ?? ''));
  }, [value]);

  const commit = () => {
    onChange(field.key, localValue);
    setEditing(false);
  };

  const cancel = () => {
    setLocalValue(String(value ?? ''));
    setEditing(false);
  };

  const borderClass = validation ?
  validation.severity === 'error' ? 'border-[var(--color-error)]' :
  validation.severity === 'warning' ? 'border-[var(--color-warning)]' :
  'border-[var(--color-success)]' :
  'border-[var(--border)]';

  const displayValue = value !== undefined && value !== null && value !== '' ?
  String(value) :
  <span className="text-[var(--text-xmuted)] italic">Not set</span>;

  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        <FieldLabel field={field} isAIGenerated={isAIGenerated} />
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={cn(
            'w-full bg-[var(--bg-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]',
            borderClass
          )} />
        
        {validation && <ValidationMessage result={validation} />}
      </div>);

  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="flex flex-col gap-1">
        <FieldLabel field={field} isAIGenerated={isAIGenerated} />
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={cn(
            'w-full bg-[var(--bg-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]',
            borderClass
          )}>
          
          <option value="">Select...</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {validation && <ValidationMessage result={validation} />}
      </div>);

  }

  // Default: inline editable field
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel field={field} isAIGenerated={isAIGenerated} />
      {editing ?
      <div className="flex items-center gap-1.5">
          <input
          ref={inputRef}
          type={field.type === 'date' ? 'date' : field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'email' ? 'email' : 'text'}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={(e) => {if (e.key === 'Enter') commit();if (e.key === 'Escape') cancel();}}
          autoFocus
          placeholder={field.placeholder}
          className={cn(
            'flex-1 bg-[var(--bg-surface)] border rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]',
            borderClass
          )} />
        
          <button onClick={commit} className="p-1.5 text-[var(--color-success)] hover:bg-[var(--color-success-bg)] rounded-lg transition-colors">
            <Check size={13} />
          </button>
          <button onClick={cancel} className="p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
            <X size={13} />
          </button>
        </div> :

      <button
        onClick={() => setEditing(true)}
        className={cn(
          'text-left border rounded-lg px-3 py-1.5 text-sm transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--bg-hover)] group',
          borderClass
        )}>
        
          <span className="text-[var(--text-primary)]">{displayValue}</span>
        </button>
      }
      {validation && <ValidationMessage result={validation} />}
    </div>);

}

function FieldLabel({ field, isAIGenerated }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
      {field.label}
      {field.required && <span className="text-[var(--color-error)]">*</span>}
      {isAIGenerated &&
      <span className="flex items-center gap-0.5 text-[10px] text-[var(--color-ai)] bg-[var(--color-ai-bg)] px-1.5 py-0.5 rounded-full border border-[var(--color-ai-border)]">
          <Sparkles size={9} />
          AI
        </span>
      }
    </label>);

}