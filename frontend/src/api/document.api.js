const API_BASE = import.meta.env.VITE_API_URL || '';
import { MOCK_TEMPLATES } from '@/mocks/templates.mock'; // Still mock templates for now
import { useAuthStore } from '@/stores/auth.store';

const getAuthHeaders = (isJson = false) => {
  const token = useAuthStore.getState().token;
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export async function fetchDocuments(filters) {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.documentType) params.append('documentType', filters.documentType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page);
    if (filters?.pageSize) params.append('pageSize', filters.pageSize);

    const response = await fetch(`${API_BASE}/api/documents?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDocument(id) {
  try {
    const response = await fetch(`${API_BASE}/api/documents/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Document not found');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function verifyDocument(verificationId) {
  // Verification is specific, not fully CRUD implemented yet. Fallback to mock behavior or reject.
  throw new Error('Verification API not connected yet');
}

export async function saveDocument(type, data, status = 'draft', title = '') {
  try {
    const payload = {
      documentType: type,
      documentData: data,
      status,
      title
    };

    const response = await fetch(`${API_BASE}/api/documents`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to save document');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteDocument(id) {
  try {
    const response = await fetch(`${API_BASE}/api/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete document');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchTemplates() {
  return [...MOCK_TEMPLATES];
}

export async function deleteTemplate(id) {
  const idx = MOCK_TEMPLATES.findIndex(t => t._id === id);
  if (idx !== -1) {
    MOCK_TEMPLATES.splice(idx, 1);
  }
  return true;
}

export async function fetchRecentStats() {
  try {
    const response = await fetch(`${API_BASE}/api/documents/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
  } catch (error) {
    console.error(error);
    // fallback
    return {
      totalDocuments: 0,
      drafts: 0,
      templatesUsed: 0,
      chartData: []
    };
  }
}