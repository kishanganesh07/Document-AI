import { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, ArrowRight, Table, Settings2, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notification.store';
import { delay } from '@/lib/utils';

export function BatchPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success } = useNotificationStore();

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setTimeout(() => setStep(2), 600); // simulate upload parsing
    }
  };

  const startProcessing = async () => {
    setStep(3);
    setIsProcessing(true);
    await delay(3000); // simulate generation
    setIsProcessing(false);
    success('Batch generation complete!', `Successfully generated 24 documents from ${file?.name || 'batch'}.`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Batch Generate</h1>
        <p className="text-[var(--text-muted)] mt-1">Generate hundreds of documents instantly from a CSV data source.</p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[var(--border)] z-0" />
        
        <StepIndicator num={1} label="Upload Data" active={step >= 1} current={step === 1} />
        <StepIndicator num={2} label="Map Columns" active={step >= 2} current={step === 2} />
        <StepIndicator num={3} label="Process & Review" active={step >= 3} current={step === 3} />
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {/* STEP 1: Upload */}
        {step === 1 &&
        <div className="p-12 flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-[var(--border)] m-8 rounded-xl hover:border-[var(--color-primary)]/50 transition-colors bg-[var(--bg-surface-el)]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
              <UploadCloud size={32} />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Upload your CSV data</h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md">
              Download our template or upload your own CSV. The first row should contain your column headers.
            </p>
            
            <div className="flex gap-4 relative">
              <input
              type="file"
              accept=".csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload} />
            
              <Button variant="primary" className="pointer-events-none">Select CSV File</Button>
            </div>
            <p className="text-xs text-[var(--text-xmuted)] mt-4">Max file size: 10MB</p>
          </div>
        }

        {/* STEP 2: Map Columns */}
        {step === 2 &&
        <div className="p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Map Columns to Template</h2>
                <p className="text-sm text-[var(--text-muted)]">We've auto-detected some matches. Review and confirm.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" iconRight={<ArrowRight size={16} />} onClick={startProcessing}>Continue to Generate</Button>
              </div>
            </div>

            <div className="bg-[var(--bg-surface-el)] border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-surface)] text-[var(--text-secondary)] font-medium border-b border-[var(--border)]">
                  <tr>
                    <th className="px-6 py-3">CSV Column <span className="text-[10px] bg-[var(--border)] px-2 py-0.5 rounded ml-2 font-mono">Found in {file?.name || 'file.csv'}</span></th>
                    <th className="px-6 py-3 w-16 text-center"></th>
                    <th className="px-6 py-3">Document Field <span className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded ml-2 font-mono">Template: Invoice</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
                  {[
                { csv: 'Client Name', field: 'clientName' },
                { csv: 'Email Address', field: 'clientEmail' },
                { csv: 'Invoice Amount', field: 'totalAmount' },
                { csv: 'Due Date', field: 'dueDate' }].
                map((row, i) =>
                <tr key={i} className="hover:bg-[var(--bg-hover)]">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Table size={14} className="text-[var(--text-muted)]" />
                        <span className="font-mono">{row.csv}</span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)] text-center">
                        <ArrowRight size={14} className="mx-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <select className="w-full max-w-[200px] bg-transparent border border-[var(--border)] rounded px-2 py-1 text-sm focus:border-[var(--color-primary)] outline-none">
                          <option>{row.field}</option>
                          <option>invoiceNumber</option>
                          <option>notes</option>
                        </select>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }

        {/* STEP 3: Process */}
        {step === 3 &&
        <div className="p-12 flex flex-col items-center justify-center h-[400px] text-center">
            {isProcessing ?
          <>
                <Loader2 size={48} className="text-[var(--color-primary)] animate-spin mb-6" />
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Generating Batch...</h2>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                  DocuFlow AI is parsing 24 rows and generating standard invoices. Please do not close this window.
                </p>
                <div className="w-64 h-2 bg-[var(--bg-surface-el)] rounded-full mt-8 overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] w-2/3 animate-pulse rounded-full" />
                </div>
              </> :

          <>
                <div className="w-16 h-16 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center mx-auto border border-[var(--color-success-border)] mb-6">
                  <CheckCircle2 size={32} className="text-[var(--color-success)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Batch Complete!</h2>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-8">
                  Successfully generated 24 documents. They have been added to your Documents library and are ready for download.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Generate Another Batch</Button>
                  <Button variant="primary">View Documents</Button>
                </div>
              </>
          }
          </div>
        }
      </div>
    </div>);

}

function StepIndicator({ num, label, active, current }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300',
        active ?
        'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' :
        'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)]',
        current && 'ring-4 ring-[var(--color-primary)]/20'
      )}>
        {active && !current ? <CheckCircle2 size={20} /> : num}
      </div>
      <span className={cn(
        'text-xs font-semibold whitespace-nowrap px-3 py-1 rounded-full',
        active ? 'text-[var(--text-primary)] bg-[var(--bg-surface)]' : 'text-[var(--text-muted)] bg-[var(--bg-surface)]'
      )}>{label}</span>
    </div>);

}