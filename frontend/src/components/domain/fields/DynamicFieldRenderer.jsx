import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';



import { getSchema } from '@/lib/documentSchemas';
import { EditableField } from './EditableField';
import { LineItemsEditor } from './LineItemsEditor';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';









export function DynamicFieldRenderer({
  documentType,
  documentData,
  validationResults,
  aiGeneratedFields,
  onChange
}) {
  const schema = getSchema(documentType);
  const [collapsedSections, setCollapsedSections] = useState(
    new Set(schema.sections.filter((s) => s.defaultCollapsed).map((s) => s.id))
  );

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');

  const schemaFields = new Set(
    schema.sections.flatMap(s => s.fields.map(f => f.key))
  );

  const customFieldKeys = Object.keys(documentData).filter(
    key => !schemaFields.has(key) && !key.startsWith('_') && key !== 'currency'
  );

  const handleAddCustomField = () => {
    if (newCustomFieldName.trim()) {
      onChange(newCustomFieldName.trim(), '');
      setNewCustomFieldName('');
      setIsAddingCustom(false);
    }
  };

  const toggleSection = (id) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getValidation = (key) => validationResults.find((v) => v.fieldKey === key);

  return (
    <div className="space-y-4">
      {schema.sections.map((section) => {
        const isCollapsed = collapsedSections.has(section.id);

        return (
          <div
            key={section.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            
            {/* Section header */}
            <button
              onClick={() => section.collapsible && toggleSection(section.id)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left',
                section.collapsible && 'hover:bg-[var(--bg-hover)] transition-colors cursor-pointer'
              )}>
              
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {section.label}
              </span>
              {section.collapsible &&
              <span className="text-[var(--text-xmuted)]">
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </span>
              }
            </button>

            {/* Section fields */}
            {!isCollapsed &&
            <div className="px-4 pb-4 space-y-4 border-t border-[var(--border)]">
                <div className="pt-4">
                  {section.fields.map((field) => {
                  if (field.type === 'lineItems') {
                    return (
                      <LineItemsEditor
                        key={field.key}
                        items={documentData[field.key] || []}
                        currency={String(documentData.currency || 'INR')}
                        onChange={(items) => onChange(field.key, items)} />);


                  }

                  if (field.type === 'financial_summary') {
                    const items = documentData.items || [];
                    const subtotal = items.reduce((s, i) => s + Number(i.amount || 0), 0);
                    const taxRate = Number(documentData.taxRate || 0);
                    const discount = Number(documentData.discount || 0);
                    const tax = subtotal * (taxRate / 100);
                    const discountAmt = subtotal * (discount / 100);
                    const total = subtotal + tax - discountAmt;
                    const currency = String(documentData.currency || 'INR');

                    return (
                      <div key={field.key} className="space-y-1.5 pt-1">
                          {[
                        { label: 'Subtotal', value: subtotal },
                        { label: `Tax (${taxRate}%)`, value: tax },
                        { label: `Discount (${discount}%)`, value: -discountAmt }].
                        map((row) =>
                        <div key={row.label} className="flex justify-between text-xs text-[var(--text-muted)]">
                              <span>{row.label}</span>
                              <span>{formatCurrency(Math.abs(row.value), currency)}</span>
                            </div>
                        )}
                          <div className="flex justify-between text-sm font-bold text-[var(--text-primary)] border-t border-[var(--border)] pt-1.5 mt-1">
                            <span>Total</span>
                            <span className="text-[var(--color-primary)]">{formatCurrency(total, currency)}</span>
                          </div>
                        </div>);

                  }

                  return (
                    <div key={field.key} className="mb-4">
                        <EditableField
                        field={field}
                        value={documentData[field.key]}
                        currency={documentData.currency || 'INR'}
                        onChange={onChange}
                        validation={getValidation(field.key)}
                        isAIGenerated={aiGeneratedFields.has(field.key)} />
                      
                      </div>);

                })}
                </div>
              </div>
            }
          </div>);

      })}

      {/* Custom Fields Section */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden mt-4">
        <div className="w-full flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Custom Fields
          </span>
        </div>
        <div className="px-4 pb-4 space-y-4 pt-4">
          {customFieldKeys.map((key) => (
            <div key={key} className="mb-4">
              <EditableField
                field={{ key, label: key, type: 'text' }}
                value={documentData[key]}
                currency={documentData.currency || 'INR'}
                onChange={onChange}
                validation={getValidation(key)}
                isAIGenerated={aiGeneratedFields.has(key)}
              />
            </div>
          ))}

          {isAddingCustom ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                autoFocus
                value={newCustomFieldName}
                onChange={(e) => setNewCustomFieldName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomField();
                  if (e.key === 'Escape') {
                    setIsAddingCustom(false);
                    setNewCustomFieldName('');
                  }
                }}
                placeholder="Field name..."
                className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
              <button 
                onClick={handleAddCustomField}
                className="px-3 py-1.5 bg-[var(--color-primary)] text-[#001a0b] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Add
              </button>
              <button 
                onClick={() => { setIsAddingCustom(false); setNewCustomFieldName(''); }}
                className="px-3 py-1.5 text-[var(--text-muted)] text-xs font-bold rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCustom(true)}
              className="flex items-center gap-2 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mt-2 font-medium"
            >
              <Plus size={13} />
              Add Custom Field
            </button>
          )}
        </div>
      </div>
    </div>);

}