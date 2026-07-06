import { Sparkles, X, Check } from 'lucide-react';








export function SuggestionCard({ suggestion, onApply, onDismiss }) {
  if (suggestion.applied || suggestion.dismissed) return null;

  return (
    <div className="border border-[var(--color-ai-border)] bg-[var(--color-ai-bg)] rounded-lg px-3 py-2.5 space-y-1.5">
      <div className="flex items-start gap-2">
        <Sparkles size={12} className="text-[var(--color-ai)] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-ai-text)]">{suggestion.title}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{suggestion.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4">
        <button
          onClick={() => onApply(suggestion.id)}
          className="flex items-center gap-1 text-[11px] text-[var(--color-ai)] border border-[var(--color-ai-border)] px-2 py-0.5 rounded-md hover:bg-[var(--color-ai-border)] transition-colors">
          
          <Check size={10} />
          Apply
        </button>
        <button
          onClick={() => onDismiss(suggestion.id)}
          className="flex items-center gap-1 text-[11px] text-[var(--text-xmuted)] hover:text-[var(--text-muted)] transition-colors">
          
          <X size={10} />
          Dismiss
        </button>
      </div>
    </div>);

}