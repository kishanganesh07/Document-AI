const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Run an agent workflow.
 * @param {string} agentType
 * @param {string} prompt
 * @param {string} documentContext - optional pasted text context
 * @param {File|null} file - optional uploaded file (PDF, TXT, etc.)
 */
export async function runAgentWorkflow(agentType, prompt, documentContext, file = null) {
  try {
    let requestInit;

    if (file) {
      // Use FormData when a file is attached
      const form = new FormData();
      form.append('agentType', agentType);
      form.append('prompt', prompt);
      if (documentContext) form.append('documentContext', documentContext);
      form.append('document', file);

      requestInit = { method: 'POST', body: form };
      // DO NOT set Content-Type header — browser sets it with boundary automatically
    } else {
      // JSON when no file
      requestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType, prompt, documentContext })
      };
    }

    const response = await fetch(`${API_BASE}/api/agents/run`, requestInit);

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to complete agent workflow.');
    }

    return await response.json();
  } catch (error) {
    console.error('Agent workflow fetch error:', error);
    throw error;
  }
}
