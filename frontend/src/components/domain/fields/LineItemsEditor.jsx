import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { generateId, formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/Input';







export function LineItemsEditor({ items, currency = 'INR', onChange }) {
  const updateItem = (id, field, value) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      const newItem = { ...item, [field]: value };
      // Recalculate amount
      if (field === 'quantity' || field === 'rate') {
        newItem.amount = Number(newItem.quantity) * Number(newItem.rate);
      }
      return newItem;
    });
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (id) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-[1fr_60px_80px_80px_32px] gap-2 px-1">
        {['Description', 'Qty', 'Rate', 'Amount', ''].map((h) =>
        <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-xmuted)]">{h}</span>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) =>
        <div key={item.id || index} className="grid grid-cols-[1fr_60px_80px_80px_32px] gap-2 items-start">
            <input
            value={item.description}
            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            placeholder="Item description"
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-xmuted)] focus:outline-none focus:border-[var(--color-primary)]" />
          
            <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--color-primary)]"
            min={1} />
          
            <input
            type="number"
            value={item.rate}
            onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] text-right focus:outline-none focus:border-[var(--color-primary)]"
            min={0} />
          
            <div className="px-2 py-1.5 text-sm font-medium text-[var(--text-primary)] text-right">
              {formatCurrency(item.amount, currency)}
            </div>
            <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-[var(--text-xmuted)] hover:text-[var(--color-error)] transition-colors rounded-lg hover:bg-[var(--color-error-bg)]">
            
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Add row */}
      <button
        onClick={addItem}
        className="flex items-center gap-2 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
        
        <Plus size={13} />
        Add line item
      </button>

      {/* Subtotal */}
      {items.length > 0 &&
      <div className="border-t border-[var(--border)] pt-2 flex justify-end">
          <div className="text-xs text-[var(--text-muted)]">
            Subtotal: <span className="font-semibold text-[var(--text-primary)] ml-1">{formatCurrency(subtotal, currency)}</span>
          </div>
        </div>
      }
    </div>);

}