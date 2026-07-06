import { useQuery } from '@tanstack/react-query';
import { fetchTemplates } from '@/api/document.api';
import { Button } from '@/components/ui/Button';
import { DocumentTypeBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  LayoutTemplate, Sparkles, Users, Star, ArrowRight,
  FileText, Award, Receipt, FileQuestion, BarChart2, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  invoice: {
    icon: Receipt,
    gradient: 'from-blue-500/10 to-indigo-500/5',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    accent: 'border-blue-500/20',
  },
  offer_letter: {
    icon: Mail,
    gradient: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    accent: 'border-emerald-500/20',
  },
  certificate: {
    icon: Award,
    gradient: 'from-violet-500/10 to-purple-500/5',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    accent: 'border-violet-500/20',
  },
  quotation: {
    icon: FileText,
    gradient: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    accent: 'border-amber-500/20',
  },
  report: {
    icon: BarChart2,
    gradient: 'from-rose-500/10 to-pink-500/5',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/10',
    accent: 'border-rose-500/20',
  },
  question_paper: {
    icon: FileQuestion,
    gradient: 'from-cyan-500/10 to-sky-500/5',
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-500/10',
    accent: 'border-cyan-500/20',
  },
};

const DEFAULT_CONFIG = {
  icon: LayoutTemplate,
  gradient: 'from-slate-500/10 to-slate-500/5',
  iconColor: 'text-slate-500',
  iconBg: 'bg-slate-500/10',
  accent: 'border-slate-500/20',
};

export function TemplatesPage() {
  const navigate = useNavigate();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  return (
    <div className="page-container space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Templates</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            Pre-built document templates to get you started fast.
          </p>
        </div>
        <Button
          variant="outline"
          icon={<LayoutTemplate size={15} />}
          onClick={() => navigate('/generate')}
        >
          Create Custom
        </Button>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[var(--text-muted)]">{templates?.length ?? 0} templates available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-[var(--text-muted)]">{templates?.filter(t => t.isCustom).length ?? 0} custom</span>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)] space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))
          : templates?.map((template, i) => {
              const config = TYPE_CONFIG[template.documentType] ?? DEFAULT_CONFIG;
              const Icon = config.icon;
              const isPopular = template.usageCount > 1000;

              return (
                <div
                  key={template._id}
                  className={cn(
                    'bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] flex flex-col overflow-hidden hover:shadow-[var(--shadow-md)] transition-all duration-200 group hover:border-[var(--border-strong)] hover:-translate-y-0.5',
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Card top gradient banner */}
                  <div className={cn('h-24 bg-gradient-to-br px-5 pt-5 flex items-start justify-between', config.gradient)}>
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', config.iconBg)}>
                      <Icon size={22} className={config.iconColor} />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {isPopular && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/25">
                          <Star size={9} fill="currentColor" /> Popular
                        </span>
                      )}
                      {template.isCustom && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full border border-[var(--color-primary)]/20">
                          Custom
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                        {template.name}
                      </h3>
                      <div className="mt-2">
                        <DocumentTypeBadge type={template.documentType} />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-3 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-[var(--border)] space-y-3">
                      <div className="flex items-center gap-1 text-xs text-[var(--text-xmuted)]">
                        <Users size={12} />
                        <span>{template.usageCount.toLocaleString()} uses</span>
                      </div>
                      <button
                        onClick={() => navigate('/generate')}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                          'bg-[var(--color-primary)]/8 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white group/btn'
                        )}
                      >
                        <Sparkles size={13} />
                        Use Template
                        <ArrowRight size={12} className="opacity-0 group-hover/btn:opacity-100 -ml-1 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Empty state */}
      {!isLoading && templates?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-el)] flex items-center justify-center mb-4">
            <LayoutTemplate size={28} className="text-[var(--text-xmuted)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">No templates yet</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xs">
            Templates you create from the Generate page will appear here.
          </p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/generate')}>
            Generate a Document
          </Button>
        </div>
      )}
    </div>
  );
}