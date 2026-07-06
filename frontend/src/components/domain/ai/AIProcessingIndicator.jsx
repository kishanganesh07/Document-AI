import { Loader2 } from 'lucide-react';


const STAGE_LABELS = {
  understanding: 'Understanding your request...',
  classifying: 'Detecting document type...',
  extracting: 'Extracting document fields...',
  validating: 'Validating information...',
  preparing_preview: 'Preparing live preview...',
  generating: 'Generating document...',
  complete: 'Complete'
};

const STAGE_ORDER = [
'understanding', 'classifying', 'extracting', 'validating', 'preparing_preview'];






export function AIProcessingIndicator({ stage }) {
  const currentIdx = STAGE_ORDER.indexOf(stage);

  return (
    <div className="bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 size={14} className="text-[var(--color-ai)] animate-spin" />
        <span className="text-xs font-medium text-[var(--color-ai)]">
          {STAGE_LABELS[stage]}
        </span>
      </div>

      {/* Progress steps */}
      <div className="space-y-1.5">
        {STAGE_ORDER.map((s, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
              isDone ? 'bg-[var(--color-ai)]' :
              isActive ? 'bg-[var(--color-ai)] animate-pulse' :
              'bg-[var(--color-ai-border)]'}`
              } />
              <span className={`text-[11px] transition-colors ${
              isDone || isActive ? 'text-[var(--color-ai-text)]' : 'text-[var(--text-xmuted)]'}`
              }>
                {STAGE_LABELS[s]}
              </span>
              {isDone && <span className="text-[var(--color-ai)] text-[10px] ml-auto">✓</span>}
            </div>);

        })}
      </div>
    </div>);

}

export function DotPulse() {
  return (
    <div className="dot-pulse flex items-center gap-1">
      <span /><span /><span />
    </div>);

}