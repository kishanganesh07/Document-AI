import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square } from 'lucide-react';
import { cn } from '@/lib/utils';









export function PromptComposer({
  onSend, disabled, isProcessing, onStop,
  placeholder = 'Describe your document or ask to make changes...'
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [value]);

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled || isProcessing) return;
    onSend(msg);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      'flex items-end gap-2 border border-[var(--border)] bg-[var(--bg-surface)] rounded-xl px-3 py-2 transition-colors',
      'focus-within:border-[var(--color-primary)]',
      disabled && !isProcessing && 'opacity-50'
    )}>
      <button className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-0.5">
        <Paperclip size={15} />
      </button>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled && !isProcessing}
        className={cn(
          'flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] resize-none outline-none leading-relaxed',
          'min-h-[36px] max-h-[120px]'
        )}
        rows={1} />
      

      {isProcessing ?
      <button
        onClick={onStop}
        className="p-1.5 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-colors shrink-0 mb-0.5"
        title="Stop generation">
        
          <Square size={14} fill="currentColor" />
        </button> :

      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={cn(
          'p-1.5 rounded-lg transition-colors shrink-0 mb-0.5',
          value.trim() && !disabled ?
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]' :
          'text-[var(--text-xmuted)] cursor-not-allowed'
        )}>
        
          <Send size={14} />
        </button>
      }
    </div>);

}