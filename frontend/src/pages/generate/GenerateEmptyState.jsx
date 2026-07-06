import { useState } from 'react';
import { Sparkles, FileText, Award, Mail, BarChart2, FilePlus, HelpCircle, ArrowRight } from 'lucide-react';
import { PromptComposer } from '@/components/domain/ai/PromptComposer';
import { MOCK_TEMPLATES } from '@/mocks/templates.mock';
import { DOCUMENT_TYPE_LABELS } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
{ label: 'Create an invoice', prompt: 'Create an invoice for Acme Technologies for ₹45,000, due on August 15.', icon: <FileText size={16} />, color: 'var(--color-primary)' },
{ label: 'Generate offer letter', prompt: 'Generate an offer letter for Arjun Mehta for the position of Senior Software Engineer with ₹24 LPA CTC, joining August 1.', icon: <Mail size={16} />, color: 'var(--color-success)' },
{ label: 'Issue a certificate', prompt: 'Issue a certificate of completion to Ananya Singh for the Advanced React Development course with grade A+.', icon: <Award size={16} />, color: 'var(--color-ai)' },
{ label: 'Prepare a quotation', prompt: 'Prepare a quotation for BuildNext Infra for ERP software license, 10 seats at ₹12,000/seat.', icon: <FilePlus size={16} />, color: 'var(--color-warning)' },
{ label: 'Create a monthly report', prompt: 'Create a monthly performance report for June 2024.', icon: <BarChart2 size={16} />, color: 'var(--color-verify)' },
{ label: 'Generate a question paper', prompt: 'Generate a question paper for Advanced Mathematics, 3 hours, 100 marks, exam date July 20.', icon: <HelpCircle size={16} />, color: 'var(--color-error)' }];







export function GenerateEmptyState({ onPrompt, onTemplateSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Heading */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            What would you like to create?
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Describe your document in plain language. AI will structure, validate, and prepare it for you.
          </p>
        </div>

        {/* Composer */}
        <PromptComposer
          onSend={onPrompt}
          placeholder="Create an invoice for Acme Technologies for ₹45,000, due on August 15..." />
        

        {/* Suggested prompts */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[var(--text-xmuted)] uppercase tracking-wider text-center">
            Try a quick start
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTED_PROMPTS.map(({ label, prompt, icon, color }) =>
            <button
              key={label}
              onClick={() => onPrompt(prompt)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-hover)] text-left transition-all group">
              
                <span style={{ color }} className="shrink-0">{icon}</span>
                <span className="flex-1 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {label}
                </span>
                <ArrowRight size={13} className="text-[var(--text-xmuted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Template quick pick */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-xmuted)]">Or start from a template</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MOCK_TEMPLATES.slice(0, 3).map((template) =>
            <button
              key={template._id}
              onClick={() => onTemplateSelect(template._id)}
              className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)] text-left transition-all group">
              
                <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {template.name}
                </span>
                <span className="text-[10px] text-[var(--text-xmuted)]">
                  {DOCUMENT_TYPE_LABELS[template.documentType]} · {template.usageCount.toLocaleString()} uses
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>);

}