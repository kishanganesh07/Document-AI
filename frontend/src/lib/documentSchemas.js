


























export const DOCUMENT_SCHEMA_REGISTRY = {
  invoice: {
    version: '1.0.0',
    documentType: 'invoice',
    sections: [
    {
      id: 'basic_info',
      label: 'Basic Information',
      fields: [
      { key: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
      { key: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
      { key: 'dueDate', label: 'Due Date', type: 'date' }]

    },
    {
      id: 'client_details',
      label: 'Client Details',
      fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true },
      { key: 'clientEmail', label: 'Client Email', type: 'email' },
      { key: 'clientAddress', label: 'Billing Address', type: 'textarea' }]

    },
    {
      id: 'items',
      label: 'Line Items',
      fields: [
      { key: 'items', label: 'Items', type: 'lineItems', required: true }]

    },
    {
      id: 'financials',
      label: 'Financial Summary',
      fields: [
      { key: 'currency', label: 'Currency', type: 'select', options: [{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }] },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number' },
      { key: 'discount', label: 'Discount (%)', type: 'number' },
      { key: 'summary', label: 'Summary', type: 'financial_summary' }]

    },
    {
      id: 'notes',
      label: 'Notes & Terms',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
      { key: 'notes', label: 'Additional Notes', type: 'textarea' }]

    }]

  },
  quotation: {
    version: '1.0.0',
    documentType: 'quotation',
    sections: [
    {
      id: 'basic_info',
      label: 'Quotation Information',
      fields: [
      { key: 'quotationNumber', label: 'Quotation Number', type: 'text', required: true },
      { key: 'quotationDate', label: 'Date', type: 'date', required: true },
      { key: 'validUntil', label: 'Valid Until', type: 'date' }]

    },
    {
      id: 'client_details',
      label: 'Client Details',
      fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true }]

    },
    {
      id: 'items',
      label: 'Items / Services',
      fields: [
      { key: 'items', label: 'Items', type: 'lineItems', required: true }]

    },
    {
      id: 'financials',
      label: 'Financials',
      fields: [
      { key: 'currency', label: 'Currency', type: 'select', options: [{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }] },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'number' },
      { key: 'summary', label: 'Summary', type: 'financial_summary' }]

    }]

  },
  offer_letter: {
    version: '1.0.0',
    documentType: 'offer_letter',
    sections: [
    {
      id: 'candidate',
      label: 'Candidate Information',
      fields: [
      { key: 'candidateName', label: 'Full Name', type: 'text', required: true },
      { key: 'candidateEmail', label: 'Email', type: 'email' },
      { key: 'candidateAddress', label: 'Address', type: 'textarea' }]

    },
    {
      id: 'job',
      label: 'Job Details',
      fields: [
      { key: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'managerName', label: 'Reporting To', type: 'text' },
      { key: 'joiningDate', label: 'Date of Joining', type: 'date', required: true },
      { key: 'location', label: 'Location', type: 'text' }]

    },
    {
      id: 'compensation',
      label: 'Compensation',
      fields: [
      { key: 'currency', label: 'Currency', type: 'select', options: [{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }] },
      { key: 'ctc', label: 'Annual CTC', type: 'currency', required: true },
      { key: 'bonus', label: 'Joining Bonus', type: 'currency' }]

    }]

  },
  certificate: {
    version: '1.0.0',
    documentType: 'certificate',
    sections: [
    {
      id: 'recipient',
      label: 'Recipient Details',
      fields: [
      { key: 'recipientName', label: 'Full Name', type: 'text', required: true }]

    },
    {
      id: 'achievement',
      label: 'Achievement Details',
      fields: [
      { key: 'courseName', label: 'Course/Event Name', type: 'text', required: true },
      { key: 'grade', label: 'Grade / Score', type: 'text' },
      { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { key: 'issuerName', label: 'Issuer Name', type: 'text' }]

    }]

  },
  report: {
    version: '1.0.0',
    documentType: 'report',
    sections: [
    {
      id: 'meta',
      label: 'Report Metadata',
      fields: [
      { key: 'reportTitle', label: 'Title', type: 'text', required: true },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' }]

    },
    {
      id: 'content',
      label: 'Content Summary',
      fields: [
      { key: 'executiveSummary', label: 'Executive Summary', type: 'textarea' }]

    }]

  },
  question_paper: {
    version: '1.0.0',
    documentType: 'question_paper',
    sections: [
    {
      id: 'exam',
      label: 'Exam Details',
      fields: [
      { key: 'subject', label: 'Subject', type: 'text', required: true },
      { key: 'examDate', label: 'Date', type: 'date' },
      { key: 'duration', label: 'Duration (Mins)', type: 'number' },
      { key: 'totalMarks', label: 'Total Marks', type: 'number' }]

    },
    {
      id: 'instructions',
      label: 'Instructions',
      fields: [
      { key: 'instructions', label: 'General Instructions', type: 'textarea' }]

    }]

  }
};

export function getSchema(type) {
  return DOCUMENT_SCHEMA_REGISTRY[type];
}