import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';


const icons = {
  valid: <CheckCircle2 size={13} className="text-[var(--color-success)]" />,
  warning: <AlertTriangle size={13} className="text-[var(--color-warning)]" />,
  error: <AlertCircle size={13} className="text-[var(--color-error)]" />
};

const styles = {
  valid: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  error: 'text-[var(--color-error)]'
};





export function ValidationMessage({ result }) {
  return (
    <div className={`flex items-start gap-1.5 ${styles[result.severity]}`}>
      <span className="mt-0.5 shrink-0">{icons[result.severity]}</span>
      <div>
        <p className="text-[11px]">{result.message}</p>
        {result.suggestion &&
        <p className="text-[10px] opacity-70 mt-0.5">{result.suggestion}</p>
        }
      </div>
    </div>);

}






export function ValidationSummary({ results, onFixWithAI }) {
  const errors = results.filter((r) => r.severity === 'error');
  const warnings = results.filter((r) => r.severity === 'warning');

  if (results.length === 0) return null;

  return (
    <div className="rounded-xl border bg-[var(--bg-surface-el)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {errors.length > 0 &&
          <div className="flex items-center gap-1.5">
              <AlertCircle size={13} className="text-[var(--color-error)]" />
              <span className="text-xs font-medium text-[var(--color-error)]">{errors.length} error{errors.length !== 1 ? 's' : ''}</span>
            </div>
          }
          {warnings.length > 0 &&
          <div className="flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[var(--color-warning)]" />
              <span className="text-xs font-medium text-[var(--color-warning)]">{warnings.length} warning{warnings.length !== 1 ? 's' : ''}</span>
            </div>
          }
        </div>
        {onFixWithAI &&
        <button
          onClick={onFixWithAI}
          className="text-[11px] text-[var(--color-ai)] hover:underline">
          
            Fix with AI
          </button>
        }
      </div>
      <div className="px-4 py-3 space-y-2">
        {results.map((r, i) =>
        <ValidationMessage key={`${r.fieldKey}-${i}`} result={r} />
        )}
      </div>
    </div>);

}