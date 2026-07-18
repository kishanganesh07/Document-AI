import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGenerateStore } from '@/stores/generate.store';
import { processUserPrompt, generateDocumentPreviewHtml } from '@/api/ai.api';
import { AIMessage, UserMessage } from '@/components/domain/ai/AIMessage';
import { AIProcessingIndicator } from '@/components/domain/ai/AIProcessingIndicator';
import { PromptComposer } from '@/components/domain/ai/PromptComposer';
import { SuggestionCard } from '@/components/domain/ai/SuggestionCard';
import { DynamicFieldRenderer } from '@/components/domain/fields/DynamicFieldRenderer';
import { ValidationSummary } from '@/components/domain/fields/ValidationMessage';
import { DocumentPreview } from '@/components/domain/document/DocumentPreview';
import { GenerateEmptyState } from './GenerateEmptyState';
import { PostGenerationModal } from './PostGenerationModal';
import { useNotificationStore } from '@/stores/notification.store';
import { DOCUMENT_TYPE_LABELS, generateId } from '@/lib/utils';
import { saveDocument } from '@/api/document.api';
import { downloadAsPdf } from '@/lib/pdf';
import { MOCK_TEMPLATES } from '@/mocks/templates.mock';
import {
  Wand2, RotateCcw, ScrollText, AlertCircle,
  CheckCircle2, Loader2, CloudUpload, FileDown, ShieldCheck } from
'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function GeneratePage() {
  const store = useGenerateStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error } = useNotificationStore();
  const messagesEndRef = useRef(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState();
  const [generating, setGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');

  // Track which fields were AI-generated (not yet manually modified)
  const [aiGeneratedFields, setAiGeneratedFields] = useState(new Set());

  const isEmpty = store.messages.length === 0;

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [store.messages]);

  // Regenerate preview when document data changes
  useEffect(() => {
    if (!store.detectedType || Object.keys(store.documentData).length === 0) return;
    const timeout = setTimeout(async () => {
      setPreviewLoading(true);
      setPreviewError(undefined);
      try {
        const newDoc = await saveDocument(store.detectedType, store.documentData, 'generated');
        store.setSavedDocumentId(newDoc._id);
        const html = await generateDocumentPreviewHtml(store.detectedType, store.documentData);
        store.setPreviewHtml(html);
      } catch {
        setPreviewError('Could not generate preview.');
      } finally {
        setPreviewLoading(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [store.documentData, store.detectedType]);

  const handleUserMessage = async (prompt, attachedFile = null) => {
    // Add user message
    store.addMessage({ role: 'user', content: prompt });

    // Add AI processing message
    const processingId = store.sessionId + '_proc';
    store.addMessage({
      role: 'assistant',
      content: '',
      isProcessing: true,
      processingStage: 'understanding'
    });

    store.setProcessing('understanding');

    try {
      const currentType = useGenerateStore.getState().detectedType;
      const currentData = useGenerateStore.getState().documentData;
      
      const result = await processUserPrompt(prompt, attachedFile, currentType, currentData, (stage) => {
        store.setProcessing(stage);
        // Update the last message's processing stage
        useGenerateStore.setState((s) => ({
          messages: s.messages.map((m, i) =>
          i === s.messages.length - 1 && m.isProcessing ?
          { ...m, processingStage: stage } :
          m
          )
        }));
      });

      const isDocReq = result.isDocumentRequest !== false;

      if (isDocReq) {
        store.setDetectedType(result.documentType, result.confidence);
        store.setDocumentData(result.documentData);
        store.setValidationResults(result.validationResults);
        store.setSuggestions(result.suggestions);

        // Mark AI-extracted fields
        const schemaFields = new Set(Object.keys(result.documentData).filter((k) => !k.startsWith('_')));
        setAiGeneratedFields(schemaFields);
      }

      // Build AI response message
      let responseText = '';
      if (result.chatResponse) {
        responseText = result.chatResponse;
      } else if (isDocReq) {
        const hasErrors = result.validationResults.some((v) => v.severity === 'error');
        const hasWarnings = result.validationResults.some((v) => v.severity === 'warning');
        const missingCount = result.missingFields.length;

        if (missingCount > 0) {
          responseText = `I identified this as a ${DOCUMENT_TYPE_LABELS[result.documentType]} with ${Math.round(result.confidence * 100)}% confidence. I extracted several fields but need a bit more information to finalize the document.`;
        } else if (hasErrors) {
          responseText = `I've structured this as a ${DOCUMENT_TYPE_LABELS[result.documentType]}. There are ${result.validationResults.filter((v) => v.severity === 'error').length} issue(s) that should be resolved before generating.`;
        } else if (hasWarnings) {
          responseText = `I've prepared a ${DOCUMENT_TYPE_LABELS[result.documentType]} with all required information. There are a few optional improvements.`;
        } else {
          responseText = `Your ${DOCUMENT_TYPE_LABELS[result.documentType]} is ready for review. All fields have been extracted and validated. Click "Generate PDF" when you're satisfied with the details.`;
        }
      } else {
        responseText = "I'm sorry, I didn't understand how that request relates to document generation. Can you please specify which document you would like to generate or update?";
      }

      // Replace processing message with result
      useGenerateStore.setState((s) => ({
        messages: s.messages.map((m, i) =>
        i === s.messages.length - 1 && m.isProcessing ?
        {
          ...m,
          isProcessing: false,
          content: responseText,
          detectedType: isDocReq ? result.documentType : null,
          confidence: isDocReq ? result.confidence : 0,
          missingFields: isDocReq ? result.missingFields : [],
          validationResults: isDocReq ? result.validationResults : []
        } :
        m
        )
      }));

      store.setProcessing(null);
      if (isDocReq) {
        setActiveTab('fields');
      }
    } catch (err) {
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      useGenerateStore.setState((s) => ({
        messages: s.messages.map((m, i) =>
        i === s.messages.length - 1 && m.isProcessing ?
        { ...m, isProcessing: false, content: errorMessage } :
        m
        )
      }));
      error('AI processing failed', errorMessage);
      store.setProcessing(null);
    }
  };

  useEffect(() => {
    if (location.state?.template) {
      const template = location.state.template;
      // Clear location state to prevent re-triggering
      navigate('.', { replace: true, state: {} });
      
      // Reset workspace to clear any previous chat/document data
      store.resetWorkspace();
      
      const prompt = `Generate a new ${template.name}`;
      
      // Add a small delay so state resets before processing the new prompt
      setTimeout(() => {
        handleUserMessage(prompt);
      }, 50);
    }
  }, [location.state, navigate]);

  const handleFieldChange = (key, value) => {
    store.updateDocumentData({ [key]: value });
    // Remove AI-generated marker when user edits
    setAiGeneratedFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  const handleSaveDraft = async () => {
    if (!store.detectedType) return;
    try {
      const doc = await saveDocument(store.detectedType, store.documentData, 'draft');
      store.setSavedDocumentId(doc._id);
      store.markClean();
      success('Draft saved', 'Your document draft has been saved.');
    } catch {
      error('Save failed', 'Could not save draft. Try again.');
    }
  };

  const handleGeneratePdf = async () => {
    const errors = store.validationResults.filter((v) => v.severity === 'error');
    if (errors.length > 0) {
      error('Cannot generate', `Fix ${errors.length} error(s) before generating.`);
      return;
    }
    if (!store.detectedType) return;

    setGenerating(true);
    try {
      const doc = await saveDocument(store.detectedType, store.documentData, 'generated');
      setGeneratedDocId(doc._id);
      store.markClean();
      setShowSuccessModal(true);
    } catch {
      error('Generation failed', 'Could not generate document. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const errorCount = store.validationResults.filter((v) => v.severity === 'error').length;
  const warningCount = store.validationResults.filter((v) => v.severity === 'warning').length;
  const activeSuggestions = store.suggestions.filter((s) => !s.applied && !s.dismissed);

  const handleTemplateSelect = (templateId) => {
    const template = MOCK_TEMPLATES.find((t) => t._id === templateId);
    if (template) {
      handleUserMessage(`Create a new ${template.documentType.replace('_', ' ')} using the "${template.name}" template.`);
    }
  };

  const handleManualSelect = (documentType) => {
    store.resetWorkspace();
    store.addMessage({
      role: 'assistant',
      content: `Manual generation started for ${DOCUMENT_TYPE_LABELS[documentType] || documentType}. Please fill out the required fields.`
    });
    store.setDetectedType(documentType, 1.0);
    store.setDocumentData({});
    store.setValidationResults([]);
    store.setSuggestions([]);
    setAiGeneratedFields(new Set());
    setActiveTab('fields');
  };

  if (isEmpty) {
    return (
      <GenerateEmptyState
        onPrompt={handleUserMessage}
        onTemplateSelect={handleTemplateSelect}
        onManualSelect={handleManualSelect} />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* ── Top status bar ── */}
      {store.detectedType && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)', flexShrink: 0,
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: 'var(--color-primary-subtle)', color: 'var(--color-primary)',
              border: '1px solid rgba(0,228,118,0.25)',
            }}>
              {DOCUMENT_TYPE_LABELS[store.detectedType] || store.detectedType}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 56, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--color-primary)', width: `${store.confidence * 100}%`, transition: 'width 0.4s ease', borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{Math.round(store.confidence * 100)}% confidence</span>
            </div>
            {errorCount > 0 && (
              <span style={{ fontSize: 11, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={11} /> {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <span style={{ fontSize: 11, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={11} /> All fields valid
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {store.isDirty && <span style={{ fontSize: 10, color: 'var(--color-warning)' }}>⚠ Unsaved changes</span>}
            <button
              onClick={handleSaveDraft}
              style={{
                padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', cursor: 'pointer',
              }}>
              Save Draft
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={errorCount > 0 || generating}
              style={{
                padding: '5px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                background: errorCount > 0 ? 'var(--bg-hover)' : 'var(--color-primary)',
                color: errorCount > 0 ? 'var(--text-muted)' : '#001a0b',
                border: 'none', cursor: errorCount > 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              {generating ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
              Generate PDF
            </button>
          </div>
        </div>
      )}

      {/* ── 3-column body ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Column 1: AI Chat (narrow, fixed width) */}
        <div style={{
          width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)', background: 'var(--bg-base)',
          overflow: 'hidden',
        }}>
          <ChatPanel onSend={handleUserMessage} onQuickAction={() => {}} />
        </div>

        {/* Column 2: Document Form (scrollable) */}
        <div style={{
          flex: '1.2', minWidth: '400px', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)', overflow: 'hidden',
          background: 'var(--bg-surface)',
        }}>
          {/* Panel header */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ScrollText size={12} style={{ color: 'var(--text-muted)' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Document Fields</span>
            {store.detectedType && (
              <span style={{ fontSize: 10, color: 'var(--text-xmuted)', marginLeft: 'auto' }}>
                {Object.keys(store.documentData).length} fields
              </span>
            )}
          </div>

          {/* Scrollable form area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* AI Suggestions */}
            {activeSuggestions.length > 0 && (
              <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Wand2 size={12} style={{ color: 'var(--color-ai)' }} /> AI Suggestions
                </p>
                {activeSuggestions.map((s) => (
                  <SuggestionCard key={s.id} suggestion={s} onApply={store.applySuggestion} onDismiss={store.dismissSuggestion} />
                ))}
              </div>
            )}

            {/* Dynamic Fields */}
            {store.detectedType ? (
              <DynamicFieldRenderer
                documentType={store.detectedType}
                documentData={store.documentData}
                validationResults={store.validationResults}
                aiGeneratedFields={aiGeneratedFields}
                onChange={handleFieldChange}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-xmuted)', fontSize: 13 }}>
                <ScrollText size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>Start a conversation in the chat to detect a document type.</p>
              </div>
            )}

            {/* Validation Summary */}
            {store.validationResults.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <ValidationSummary results={store.validationResults} />
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Live Preview */}
        <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface-el)' }}>
          <DocumentPreview
            html={store.previewHtml}
            isLoading={previewLoading}
            error={previewError}
            onRefresh={async () => {
              if (store.detectedType) {
                setPreviewLoading(true);
                try {
                  const html = await generateDocumentPreviewHtml(store.detectedType, store.documentData);
                  store.setPreviewHtml(html);
                } finally { setPreviewLoading(false); }
              }
            }}
            onDownload={async () => {
              if (store.previewHtml) {
                success('Download started', 'Generating PDF...');
                try {
                  await downloadAsPdf(store.previewHtml, `Generated_${store.detectedType || 'document'}`);
                  success('Download complete', 'Your PDF has been saved.');
                } catch (err) {
                  error('Download failed', 'Could not generate PDF. Please try again.');
                }
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex flex-col w-full flex-1 overflow-hidden">
        <div className="flex border-b border-[var(--border)] bg-[var(--bg-surface)] flex-shrink-0">
          {['chat', 'fields'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 text-xs font-medium capitalize transition-colors',
                activeTab === tab ?
                'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' :
                'text-[var(--text-muted)]'
              )}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && <ChatPanel onSend={handleUserMessage} onQuickAction={() => {}} />}
          {activeTab === 'fields' && store.detectedType && (
            <div className="h-full overflow-y-auto p-4">
              <DynamicFieldRenderer
                documentType={store.detectedType}
                documentData={store.documentData}
                validationResults={store.validationResults}
                aiGeneratedFields={aiGeneratedFields}
                onChange={handleFieldChange}
              />
            </div>
          )}
        </div>
      </div>

      <PostGenerationModal
        open={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); store.resetWorkspace(); }}
        documentId={generatedDocId}
        documentType={store.detectedType} />
    </div>
  );

}

// ============================================================
// Sub-components
// ============================================================

function ChatPanel({ onSend, onQuickAction }) {
  const { messages, isProcessing, currentStage } = useGenerateStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '10px', flexShrink: 0,
            background: 'var(--color-primary-subtle)',
            border: '1px solid rgba(139,92,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wand2 size={13} style={{ color: 'var(--color-ai)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>AI Assistant</h2>
            <p style={{ fontSize: '10px', color: 'var(--text-xmuted)', marginTop: '1px' }}>Describe, refine, or update your document</p>
          </div>
        </div>
        <button
          onClick={() => useGenerateStore.getState().resetWorkspace()}
          style={{
            padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            color: 'var(--text-xmuted)', background: 'transparent', display: 'flex',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-xmuted)'; }}
          title="New conversation">
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((message) =>
          message.role === 'user' ?
          <UserMessage key={message.id} message={message} /> :
          <AIMessage key={message.id} message={message} onQuickAction={onQuickAction} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)', flexShrink: 0,
      }}>
        <PromptComposer
          onSend={onSend}
          isProcessing={isProcessing}
          placeholder="Ask to make changes, add fields, or describe what's missing..." />
        <p style={{ fontSize: '10px', color: 'var(--text-xmuted)', textAlign: 'center', marginTop: '8px' }}>
          Enter ↵ to send &nbsp;·&nbsp; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function WorkspacePanel({
  children, errorCount, warningCount, activeSuggestions,
  onSaveDraft, onGenerate, generating, isDirty
}) {
  const { detectedType, confidence } = useGenerateStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '7px',
              background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ScrollText size={11} style={{ color: 'var(--text-muted)' }} />
            </div>
            Document Details
          </h2>
          {isDirty && <span style={{ fontSize: '10px', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ Unsaved changes</span>}
        </div>

        {detectedType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
              background: 'rgba(91,106,240,0.1)', color: 'var(--color-primary)',
              border: '1px solid rgba(91,106,240,0.2)',
            }}>
              {DOCUMENT_TYPE_LABELS[detectedType]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '60px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--color-ai)', borderRadius: '2px', width: `${confidence * 100}%`, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-ai)' }}>{Math.round(confidence * 100)}%</span>
            </div>
            {errorCount > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
            )}
            {warningCount > 0 && !errorCount && (
              <span style={{ fontSize: '11px', color: 'var(--color-warning)' }}>{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <span style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={11} /> Valid
              </span>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  );
}


function ReadinessIndicator({ errorCount, warningCount }) {
  if (errorCount > 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 12px', borderRadius: '10px',
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
      }}>
        <AlertCircle size={13} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--color-error)', fontWeight: '500' }}>
          {errorCount} issue{errorCount !== 1 ? 's' : ''} must be resolved
        </span>
      </div>
    );
  }
  if (warningCount > 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 12px', borderRadius: '10px',
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <CheckCircle2 size={13} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: '500' }}>
          Ready to generate ({warningCount} optional warning{warningCount !== 1 ? 's' : ''})
        </span>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', borderRadius: '10px',
      background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
    }}>
      <CheckCircle2 size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
      <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: '500' }}>Ready to generate</span>
    </div>
  );
}