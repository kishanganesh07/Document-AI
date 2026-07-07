

export const MOCK_DOCUMENTS = [
{
  _id: 'doc_1',
  ownerId: 'u_1',
  organizationId: 'org_1',
  documentType: 'invoice',
  title: 'Stripe — Q2 Software License',
  status: 'generated',
  schemaVersion: '1.0.0',
  documentData: {
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-06-15',
    clientName: 'Stripe',
    currency: 'USD',
    items: [
    { id: 'i1', description: 'Enterprise License Q2', quantity: 1, rate: 15000, amount: 15000 }]

  },
  currentVersion: 1,
  recipientName: 'Stripe',
  pdfUrl: '/mock/inv-2024-001.pdf',
  verificationId: 'INV-ACME-449',
  verification: {
    issuedAt: '2024-06-15T10:00:00Z',
    documentHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    verificationCount: 12
  },
  createdAt: '2024-06-15T09:30:00Z',
  updatedAt: '2024-06-15T10:00:00Z'
},
{
  _id: 'doc_2',
  ownerId: 'u_1',
  organizationId: 'org_1',
  documentType: 'offer_letter',
  title: 'Offer Letter — Sarah Chen',
  status: 'draft',
  schemaVersion: '1.0.0',
  documentData: {
    candidateName: 'Sarah Chen',
    jobTitle: 'Senior Platform Engineer',
    ctc: 160000,
    currency: 'USD'
  },
  currentVersion: 1,
  recipientName: 'Sarah Chen',
  createdAt: '2024-06-16T14:20:00Z',
  updatedAt: '2024-06-16T15:10:00Z'
},
{
  _id: 'doc_3',
  ownerId: 'u_1',
  organizationId: 'org_1',
  documentType: 'certificate',
  title: 'Completion Certificate — Data Science',
  status: 'revoked',
  schemaVersion: '1.0.0',
  documentData: {
    recipientName: 'Marcus Johnson',
    courseName: 'Data Science Bootcamp'
  },
  currentVersion: 1,
  verificationId: 'CERT-DS-991',
  verification: {
    issuedAt: '2024-01-10T09:00:00Z',
    revokedAt: '2024-02-15T10:00:00Z',
    revocationReason: 'Issued with incorrect grade'
  },
  createdAt: '2024-01-10T08:30:00Z',
  updatedAt: '2024-02-15T10:00:00Z'
}];