import { useQuery } from '@tanstack/react-query';
import { fetchTemplates } from '@/api/document.api';
import { Button } from '@/components/ui/Button';
import { DocumentTypeBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { LayoutTemplate, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TemplatesPage() {
  const navigate = useNavigate();
  
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Templates</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your document templates and start generating.</p>
        </div>
        <Button variant="outline" icon={<LayoutTemplate size={16} />}>Create Custom Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ?
        Array.from({ length: 4 }).map((_, i) =>
        <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm space-y-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
        ) :

        templates?.map((template) =>
        <div key={template._id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm flex flex-col hover:border-[var(--color-primary)]/50 transition-colors group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <LayoutTemplate size={20} />
                </div>
                <div className="flex items-center gap-2">
                  {template.isCustom &&
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-info)] bg-[var(--color-info-bg)] px-2 py-0.5 rounded border border-[var(--color-info-border)]">
                      Custom
                    </span>
                  }
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)] leading-tight">{template.name}</h3>
                <div className="mt-2">
                  <DocumentTypeBadge type={template.documentType} />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-3">
                  {template.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Users size={14} />
                  <span>{template.usageCount.toLocaleString()} uses</span>
                </div>
                
                <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/generate`)}>
              
                  Use Template
                </Button>
              </div>
            </div>
        )
        }
      </div>
    </div>);

}