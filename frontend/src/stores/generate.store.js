import { create } from 'zustand';
import { generateId } from '@/lib/utils';

































const initialState = {
  sessionId: generateId(),
  messages: [],
  isProcessing: false,
  currentStage: null,
  detectedType: null,
  confidence: 0,
  documentData: {},
  validationResults: [],
  suggestions: [],
  previewHtml: null,
  savedDocumentId: null,
  isDirty: false
};

export const useGenerateStore = create((set) => ({
  ...initialState,

  addMessage: (message) => set((state) => ({
    messages: [
    ...state.messages,
    { ...message, id: generateId(), timestamp: new Date().toISOString() }]

  })),

  setProcessing: (stage) => set({
    isProcessing: stage !== null,
    currentStage: stage
  }),

  setDetectedType: (type, confidence) => set({
    detectedType: type,
    confidence
  }),

  setDocumentData: (data) => set({
    documentData: data,
    isDirty: true
  }),

  updateDocumentData: (partial) => set((state) => ({
    documentData: { ...state.documentData, ...partial },
    isDirty: true
  })),

  setValidationResults: (results) => set({ validationResults: results }),

  setSuggestions: (suggestions) => set({ suggestions }),

  applySuggestion: (id) => set((state) => {
    const suggestion = state.suggestions.find((s) => s.id === id);
    if (!suggestion) return state;

    let newData = { ...state.documentData };
    if (suggestion.fieldKey && suggestion.value !== undefined) {
      if (suggestion.action === 'update' || suggestion.action === 'add') {
        newData[suggestion.fieldKey] = suggestion.value;
      } else if (suggestion.action === 'remove') {
        delete newData[suggestion.fieldKey];
      }
    }

    return {
      documentData: newData,
      isDirty: true,
      suggestions: state.suggestions.map((s) =>
      s.id === id ? { ...s, applied: true } : s
      )
    };
  }),

  dismissSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.map((s) =>
    s.id === id ? { ...s, dismissed: true } : s
    )
  })),

  setPreviewHtml: (html) => set({ previewHtml: html }),

  setSavedDocumentId: (id) => set({ savedDocumentId: id }),

  markClean: () => set({ isDirty: false }),

  resetWorkspace: () => set({ ...initialState, sessionId: generateId() })
}));