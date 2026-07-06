import { delay } from '@/lib/utils';


import { MOCK_DOCUMENTS } from '@/mocks/documents.mock';
import { MOCK_TEMPLATES } from '@/mocks/templates.mock';

export async function fetchDocuments(filters) {
  await delay(800);

  let data = [...MOCK_DOCUMENTS];

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    data = data.filter((d) => d.title.toLowerCase().includes(s) || d.documentData?.clientName?.toLowerCase().includes(s));
  }

  if (filters?.documentType && filters.documentType !== 'all') {
    data = data.filter((d) => d.documentType === filters.documentType);
  }

  if (filters?.status && filters.status !== 'all') {
    data = data.filter((d) => d.status === filters.status);
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;

  return {
    data: data.slice((page - 1) * pageSize, page * pageSize),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize)
  };
}

export async function getDocument(id) {
  await delay(500);
  const doc = MOCK_DOCUMENTS.find((d) => d._id === id);
  if (!doc) throw new Error('Document not found');
  return doc;
}

export async function verifyDocument(verificationId) {
  await delay(1200);
  const doc = MOCK_DOCUMENTS.find((d) => d.verificationId === verificationId);
  if (!doc) throw new Error('Verification ID not found or invalid');
  return doc;
}

export async function saveDocument(type, data, status = 'draft') {
  await delay(1000);

  const newDoc = {
    _id: `doc_${Date.now()}`,
    ownerId: 'u_1',
    organizationId: 'org_1',
    documentType: type,
    title: data.clientName ? `${data.clientName} - ${type}` : `New ${type}`,
    status,
    schemaVersion: '1.0.0',
    documentData: data,
    currentVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  MOCK_DOCUMENTS.unshift(newDoc); // Mock insert
  return newDoc;
}

export async function fetchTemplates() {
  await delay(600);
  return [...MOCK_TEMPLATES];
}

export async function deleteTemplate(id) {
  await delay(600);
  const idx = MOCK_TEMPLATES.findIndex(t => t._id === id);
  if (idx !== -1) {
    MOCK_TEMPLATES.splice(idx, 1);
  }
  return true;
}








export async function fetchRecentStats() {
  await delay(700);

  // Generate some fake chart data
  const chartData = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      generated: Math.floor(Math.random() * 20) + 5
    };
  });

  return {
    totalDocuments: MOCK_DOCUMENTS.length + 142,
    drafts: MOCK_DOCUMENTS.filter((d) => d.status === 'draft').length + 12,
    templatesUsed: 4,
    chartData
  };
}