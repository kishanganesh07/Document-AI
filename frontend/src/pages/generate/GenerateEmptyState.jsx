import { useState } from 'react';
import { Receipt, UserCheck, BadgeCheck, TrendingUp, ClipboardList, GraduationCap, ArrowRight, Wand2, Layers } from 'lucide-react';
import { PromptComposer } from '@/components/domain/ai/PromptComposer';
import { MOCK_TEMPLATES } from '@/mocks/templates.mock';
import { DOCUMENT_TYPE_LABELS } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  { label: 'Create an invoice', prompt: 'Create an invoice for Acme Technologies for ₹45,000, due on August 15.', icon: Receipt, color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
  { label: 'Generate offer letter', prompt: 'Generate an offer letter for Arjun Mehta for the position of Senior Software Engineer with ₹24 LPA CTC, joining August 1.', icon: UserCheck, color: '#00D4AA', bg: 'rgba(0,212,170,0.1)' },
  { label: 'Issue a certificate', prompt: 'Issue a certificate of completion to Ananya Singh for the Advanced React Development course with grade A+.', icon: BadgeCheck, color: '#C026D3', bg: 'rgba(192,38,211,0.1)' },
  { label: 'Prepare a quotation', prompt: 'Prepare a quotation for BuildNext Infra for ERP software license, 10 seats at ₹12,000/seat.', icon: ClipboardList, color: '#F7A731', bg: 'rgba(247,167,49,0.1)' },
  { label: 'Create a monthly report', prompt: 'Create a monthly performance report for June 2024.', icon: TrendingUp, color: '#22D3EE', bg: 'rgba(34,211,238,0.1)' },
  { label: 'Generate a question paper', prompt: 'Generate a question paper for Advanced Mathematics, 3 hours, 100 marks, exam date July 20.', icon: GraduationCap, color: '#FF5C72', bg: 'rgba(255,92,114,0.1)' },
];

export function GenerateEmptyState({ onPrompt, onTemplateSelect }) {
  const [hoveredPrompt, setHoveredPrompt] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 relative overflow-hidden">

      {/* Ambient glow background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(192,38,211,0.10) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">

        {/* Hero heading */}
        <div className="text-center space-y-4">
          <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '60px', height: '60px', borderRadius: '18px', marginBottom: '4px',
          background: 'linear-gradient(135deg, #6C63FF 0%, #C026D3 100%)',
          boxShadow: '0 8px 24px rgba(108,99,255,0.4), 0 0 0 1px rgba(108,99,255,0.2)',
        }}>
            <Wand2 size={26} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, #6C63FF 60%, #C026D3 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', marginBottom: '8px', lineHeight: 1.2,
            }}>
              What would you like to create?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 }}>
              Describe your document in plain English. AI will extract, validate, and structure it instantly.
            </p>
          </div>
        </div>

        {/* Composer */}
        <div style={{
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px var(--border)',
          background: 'var(--bg-surface)',
          overflow: 'hidden',
        }}>
          <PromptComposer
            onSend={onPrompt}
            placeholder="e.g. Create an invoice for Acme Tech for ₹45,000, due August 15..."
          />
        </div>

        {/* Quick start prompts */}
        <div className="space-y-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={11} style={{ color: 'var(--text-xmuted)' }} />
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-xmuted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick start
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {SUGGESTED_PROMPTS.map(({ label, prompt, icon: Icon, color, bg }) => (
              <button
                key={label}
                onClick={() => onPrompt(prompt)}
                onMouseEnter={() => setHoveredPrompt(label)}
                onMouseLeave={() => setHoveredPrompt(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '12px', textAlign: 'left',
                  border: `1px solid ${hoveredPrompt === label ? color + '50' : 'var(--border)'}`,
                  background: hoveredPrompt === label ? bg : 'var(--bg-surface)',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  transform: hoveredPrompt === label ? 'translateY(-1px)' : 'none',
                  boxShadow: hoveredPrompt === label ? `0 4px 16px ${color}20` : 'none',
                }}
              >
                <span style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={14} style={{ color }} />
                </span>
                <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {label}
                </span>
                <ArrowRight size={13} style={{
                  color: 'var(--text-xmuted)',
                  opacity: hoveredPrompt === label ? 1 : 0,
                  transition: 'opacity 0.15s',
                  transform: hoveredPrompt === label ? 'translateX(2px)' : 'none',
                }} />
              </button>
            ))}
          </div>
        </div>

        {/* Templates divider */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-xmuted)', whiteSpace: 'nowrap' }}>Or start from a template</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {MOCK_TEMPLATES.slice(0, 3).map((template) => (
              <button
                key={template._id}
                onClick={() => onTemplateSelect(template._id)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: '4px',
                  padding: '12px', borderRadius: '12px', textAlign: 'left',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-surface-el)',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(91,106,240,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-surface-el)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {template.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-xmuted)' }}>
                  {DOCUMENT_TYPE_LABELS[template.documentType]} · {template.usageCount.toLocaleString()} uses
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}