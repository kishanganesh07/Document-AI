import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, LayoutTemplate, Sparkles, X, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';
import { MOCK_DOCUMENTS } from '@/mocks/documents.mock';










export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const close = useUIStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open ? close() : useUIStore.getState().openCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  const quickActions = [
  { id: 'gen-invoice', label: 'Create Invoice', description: 'Start a new invoice', icon: <Sparkles size={15} />, action: () => {navigate('/generate');close();}, category: 'Quick Actions' },
  { id: 'gen-cert', label: 'Create Certificate', description: 'Issue a new certificate', icon: <Sparkles size={15} />, action: () => {navigate('/generate');close();}, category: 'Quick Actions' },
  { id: 'gen-offer', label: 'Create Offer Letter', description: 'Generate an offer letter', icon: <Sparkles size={15} />, action: () => {navigate('/generate');close();}, category: 'Quick Actions' },
  { id: 'go-docs', label: 'Open Documents', icon: <FileText size={15} />, action: () => {navigate('/documents');close();}, category: 'Navigation' },
  { id: 'go-templates', label: 'Open Templates', icon: <LayoutTemplate size={15} />, action: () => {navigate('/templates');close();}, category: 'Navigation' },
  { id: 'go-dashboard', label: 'Open Dashboard', icon: <FileText size={15} />, action: () => {navigate('/dashboard');close();}, category: 'Navigation' }];


  const docItems = MOCK_DOCUMENTS.
  filter((d) => !query || d.title.toLowerCase().includes(query.toLowerCase())).
  slice(0, 3).
  map((d) => ({
    id: d._id,
    label: d.title,
    description: d.documentType,
    icon: <FileText size={15} />,
    action: () => {navigate(`/documents/${d._id}`);close();},
    category: 'Documents'
  }));

  const allItems = query ?
  [...quickActions.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())), ...docItems] :
  [...quickActions, ...docItems];

  useEffect(() => setSelected(0), [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {e.preventDefault();setSelected((s) => Math.min(s + 1, allItems.length - 1));}
    if (e.key === 'ArrowUp') {e.preventDefault();setSelected((s) => Math.max(s - 1, 0));}
    if (e.key === 'Enter' && allItems[selected]) {allItems[selected].action();}
    if (e.key === 'Escape') close();
  };

  if (!open) return null;

  // Group items by category
  const groups = {};
  allItems.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  let itemIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden animate-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or type a command..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] outline-none" />
          
          {query &&
          <button onClick={() => setQuery('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={14} />
            </button>
          }
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1">
          {Object.entries(groups).map(([category, items]) =>
          <div key={category}>
              <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-xmuted)]">
                {category}
              </div>
              {items.map((item) => {
              const idx = itemIndex++;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelected(idx)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    idx === selected ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
                  )}>
                  
                    <span className="text-[var(--text-muted)] shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--text-primary)]">{item.label}</div>
                      {item.description && <div className="text-xs text-[var(--text-muted)] capitalize">{item.description}</div>}
                    </div>
                    {idx === selected && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
                  </button>);

            })}
            </div>
          )}
          {allItems.length === 0 &&
          <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No results for "{query}"
            </div>
          }
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-4 py-2 flex items-center gap-4 text-[10px] text-[var(--text-xmuted)]">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>);

}