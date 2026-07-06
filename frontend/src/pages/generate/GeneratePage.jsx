import { useEffect, useRef, useState } from 'react';
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

import {
  Sparkles, RotateCcw, FileText, AlertCircle,
  CheckCircle2, Loader2, Save, Download, ShieldCheck } from
'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function GeneratePage() {
  const store = useGenerateStore();
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

  const handleUserMessage = async (prompt) => {
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
      const result = await processUserPrompt(prompt, (stage) => {
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
    } catch {
      useGenerateStore.setState((s) => ({
        messages: s.messages.map((m, i) =>
        i === s.messages.length - 1 && m.isProcessing ?
        { ...m, isProcessing: false, content: 'Something went wrong. Please try again.' } :
        m
        )
      }));
      error('AI processing failed', 'Please try again or type a different prompt.');
      store.setProcessing(null);
    }
  };

  const handleFieldChange = (key, value) => {
    store.updateDocumentData({ [key]: value });
    // Remove AI-generated marker when user edits
    setAiGeneratedFields((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
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
    import('@/mocks/templates.mock').then(({ MOCK_TEMPLATES }) => {
      const template = MOCK_TEMPLATES.find((t) => t._id === templateId);
      if (template) {
        handleUserMessage(`Create a new ${template.documentType.replace('_', ' ')} using the "${template.name}" template.`);
      }
    });
  };

  if (isEmpty) {
    return (
      <GenerateEmptyState
        onPrompt={handleUserMessage}
        onTemplateSelect={handleTemplateSelect} />);


  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ===== MOBILE TABS ===== */}
      <div className="md:hidden flex flex-col w-full">
        <div className="flex border-b border-[var(--border)] bg-[var(--bg-surface)]">
          {['chat', 'fields', 'preview'].map((tab) =>
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
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatPanel onSend={handleUserMessage} onQuickAction={() => {}} />}
          {activeTab === 'fields' && store.detectedType &&
          <div className="h-full overflow-y-auto p-4">
              <DynamicFieldRenderer
              documentType={store.detectedType}
              documentData={store.documentData}
              validationResults={store.validationResults}
              aiGeneratedFields={aiGeneratedFields}
              onChange={handleFieldChange} />
            
            </div>
          }
          {activeTab === 'preview' &&
          <DocumentPreview html={store.previewHtml} isLoading={previewLoading} error={previewError} />
          }
        </div>
      </div>

      {/* ===== DESKTOP 3-PANEL ===== */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Panel 1: Chat (30%) */}
        <div className="w-[30%] min-w-[260px] max-w-[380px] flex flex-col border-r border-[var(--border)] overflow-hidden">
          <ChatPanel onSend={handleUserMessage} onQuickAction={() => {}} />
        </div>

        {/* Panel 2: Workspace (35%) */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-[var(--border)]">
          <WorkspacePanel
            errorCount={errorCount}
            warningCount={warningCount}
            activeSuggestions={activeSuggestions.length}
            onSaveDraft={handleSaveDraft}
            onGenerate={handleGeneratePdf}
            generating={generating}
            isDirty={store.isDirty}>
            
            {store.detectedType &&
            <DynamicFieldRenderer
              documentType={store.detectedType}
              documentData={store.documentData}
              validationResults={store.validationResults}
              aiGeneratedFields={aiGeneratedFields}
              onChange={handleFieldChange} />

            }
            {store.validationResults.length > 0 &&
            <ValidationSummary results={store.validationResults} />
            }
            {activeSuggestions.length > 0 &&
            <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={11} />
                  AI Suggestions
                </p>
                {activeSuggestions.map((s) =>
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onApply={store.applySuggestion}
                onDismiss={store.dismissSuggestion} />

              )}
              </div>
            }
          </WorkspacePanel>
        </div>

        {/* Panel 3: Preview (35%) */}
        <div className="w-[35%] min-w-[260px] flex flex-col overflow-hidden">
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
                } finally {
                  setPreviewLoading(false);
                }
              }
            }} />
          

          {/* Bottom actions */}
          <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 space-y-3">
            {/* Readiness indicator */}
            <ReadinessIndicator errorCount={errorCount} warningCount={warningCount} />

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Save size={13} />}
                onClick={handleSaveDraft}
                className="flex-1">
                
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={generating ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                onClick={handleGeneratePdf}
                loading={generating}
                disabled={errorCount > 0}
                className="flex-1">
                
                Generate PDF
              </Button>
            </div>
            <Button
              variant="ai"
              size="sm"
              icon={<ShieldCheck size={13} />}
              onClick={handleGeneratePdf}
              className="w-full"
              disabled={errorCount > 0}>
              
              Generate & Verify
            </Button>
          </div>
        </div>
      </div>

      <PostGenerationModal
        open={showSuccessModal}
        onClose={() => {setShowSuccessModal(false);store.resetWorkspace();}}
        documentId={generatedDocId}
        documentType={store.detectedType} />
      
    </div>);

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[var(--color-ai)]" />
            AI Assistant
          </h2>
          <p className="text-[10px] text-[var(--text-xmuted)] mt-0.5">Describe, refine, or update your document</p>
        </div>
        <button
          onClick={() => useGenerateStore.getState().resetWorkspace()}
          className="p-1.5 rounded-lg text-[var(--text-xmuted)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
          title="New conversation">
          
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.map((message) =>
        message.role === 'user' ?
        <UserMessage key={message.id} message={message} /> :
        <AIMessage key={message.id} message={message} onQuickAction={onQuickAction} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-[var(--border)] shrink-0">
        <PromptComposer
          onSend={onSend}
          isProcessing={isProcessing}
          placeholder="Ask to make changes, add fields, or describe what's missing..." />
        
        <p className="text-[10px] text-[var(--text-xmuted)] text-center mt-2">
          Enter â†µ to send, Shift+Enter for new line
        </p>
      </div>
    </div>);

}

function WorkspacePanel({
  children, errorCount, warningCount, activeSuggestions,
  onSaveDraft, onGenerate, generating, isDirty









}) {
  const { detectedType, confidence } = useGenerateStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <FileText size={12} className="text-[var(--text-muted)]" />
            Document Details
          </h2>
          {isDirty && <span className="text-[10px] text-[var(--color-warning)]">ÃƒÂ¢Ã¢â‚¬â€Ã‚Â Unsaved changes</span>}
        </div>

        {detectedType &&
        <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[var(--text-muted)]">Type:</span>
              <span className="font-medium text-[var(--text-primary)]">{DOCUMENT_TYPE_LABELS[detectedType]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[var(--text-muted)]">Confidence:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                  className="h-full bg-[var(--color-ai)] rounded-full transition-all"
                  style={{ width: `${confidence * 100}%` }} />
                
                </div>
                <span className="font-medium text-[var(--color-ai)]">{Math.round(confidence * 100)}%</span>
              </div>
            </div>
            {errorCount > 0 &&
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-error)]">
                <AlertCircle size={11} /> {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
          }
            {warningCount > 0 && !errorCount &&
          <span className="text-[11px] text-[var(--color-warning)]">{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
          }
            {errorCount === 0 && warningCount === 0 &&
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-success)]">
                <CheckCircle2 size={11} /> Valid
              </span>
          }
          </div>
        }
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {children}
      </div>
    </div>);

}

function ReadinessIndicator({ errorCount, warningCount }) {
  if (errorCount > 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--color-error)]">
        <AlertCircle size={13} />
        <span>{errorCount} issue{errorCount !== 1 ? 's' : ''} must be resolved</span>
      </div>);

  }
  if (warningCount > 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--color-warning)]">
        <CheckCircle2 size={13} />
        <span>Ready to generate ({warningCount} optional warning{warningCount !== 1 ? 's' : ''})</span>
      </div>);

  }
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--color-success)]">
      <CheckCircle2 size={13} />
      <span>Ready to generate</span>
    </div>);

}