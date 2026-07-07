import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';









export function PromptComposer({
  onSend, disabled, isProcessing, onStop,
  placeholder = 'Describe your document or ask to make changes...'
}) {
  const [value, setValue] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [value]);

  const handleSend = () => {
    const msg = value.trim();
    if ((!msg && !attachedFile) || disabled || isProcessing) return;
    onSend(msg, attachedFile);
    setValue('');
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    // reset input so the same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  return (
    <div className={cn(
      'flex flex-col border border-[var(--border)] bg-[var(--bg-surface)] rounded-xl transition-colors',
      'focus-within:border-[var(--color-primary)]',
      disabled && !isProcessing && 'opacity-50'
    )}>
      {attachedFile && (
        <div className="flex items-center gap-2 px-3 pt-3 pb-1">
          <div className="flex items-center gap-2 bg-[var(--bg-surface-el)] border border-[var(--border)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] max-w-[200px]">
            <FileText size={14} className="text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{attachedFile.name}</span>
            <button onClick={handleRemoveFile} className="p-0.5 hover:bg-[var(--bg-hover)] rounded ml-1 shrink-0 text-[var(--text-muted)] hover:text-red-500">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 px-3 py-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept=".pdf,.txt,.docx,.csv" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-0.5"
          disabled={disabled && !isProcessing}
        >
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
        disabled={(!value.trim() && !attachedFile) || disabled}
        className={cn(
          'p-1.5 rounded-lg transition-colors shrink-0 mb-0.5',
          (value.trim() || attachedFile) && !disabled ?
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]' :
          'text-[var(--text-xmuted)] cursor-not-allowed'
        )}>
        
          <Send size={14} />
        </button>
      }
      </div>
    </div>);

}