import { Sparkles, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

import { AIProcessingIndicator } from './AIProcessingIndicator';
import { DOCUMENT_TYPE_LABELS } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';






export function AIMessage({ message, onQuickAction }) {
  return (
    <div className="flex gap-3 animate-in">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={13} className="text-[var(--color-ai)]" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-ai)]">AI Assistant</span>
          <span className="text-[10px] text-[var(--text-xmuted)]">{formatDate(message.timestamp, 'relative')}</span>
        </div>

        {/* Processing indicator */}
        {message.isProcessing && message.processingStage &&
        <AIProcessingIndicator stage={message.processingStage} />
        }

        {/* Message content */}
        {!message.isProcessing && message.content &&
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {message.content}
          </div>
        }

        {/* Detected type chip */}
        {message.detectedType && !message.isProcessing &&
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--text-muted)]">Detected:</span>
            <Badge variant="ai">
              <Sparkles size={10} />
              {DOCUMENT_TYPE_LABELS[message.detectedType]}
            </Badge>
            {message.confidence !== undefined &&
          <Badge variant="default">{Math.round(message.confidence * 100)}% confidence</Badge>
          }
          </div>
        }

        {/* Missing fields */}
        {message.missingFields && message.missingFields.length > 0 &&
        <div className="bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] rounded-lg px-3 py-2.5 space-y-1">
            <p className="text-xs font-medium text-[var(--color-warning)]">Missing information needed:</p>
            <ul className="space-y-0.5">
              {message.missingFields.map((f) =>
            <li key={f} className="text-xs text-[var(--color-warning)] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-warning)]" />
                  {f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </li>
            )}
            </ul>
          </div>
        }

        {/* Quick action */}
        {message.missingFields?.includes('invoiceDate') && onQuickAction &&
        <button
          onClick={() => onQuickAction('use_today')}
          className="text-xs text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded-lg hover:bg-[var(--color-primary-muted)] transition-colors">
          
            Use today's date
          </button>
        }
      </div>
    </div>);

}

export function UserMessage({ message }) {
  return (
    <div className="flex gap-3 flex-row-reverse animate-in">
      <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
        <User size={13} className="text-white" />
      </div>
      <div className="max-w-[80%]">
        <div className="text-[10px] text-[var(--text-xmuted)] text-right mb-1">
          {formatDate(message.timestamp, 'relative')}
        </div>
        <div className="bg-[var(--color-primary-muted)] border border-[var(--color-primary)]/30 rounded-xl px-4 py-2.5">
          <p className="text-sm text-[var(--text-primary)]">{message.content}</p>
        </div>
      </div>
    </div>);

}