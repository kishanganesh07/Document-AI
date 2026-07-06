import { delay, generateId } from '@/lib/utils';
import { DOCUMENT_SCHEMA_REGISTRY } from '@/lib/documentSchemas';

// Real AI backend call
export async function processUserPrompt(prompt, onProgress) {
  onProgress('classifying');
  
  try {
    const response = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('AI quota limit reached. Please wait a moment and try again.');
      }
      throw new Error('Failed to generate document from AI');
    }

    onProgress('extracting');
    const result = await response.json();
    
    onProgress('validating');
    const validationResults = result.validationResults || [];
    const missingFields = result.missingFields || [];
    const suggestions = result.suggestions || [];

    onProgress('preparing_preview');
    await delay(300);

    let docType = (result.documentType || 'invoice').toLowerCase();
    
    // Validate that the document type exists in our schema registry, fallback if not
    if (!['invoice', 'offer_letter', 'certificate', 'quotation', 'report', 'question_paper'].includes(docType)) {
      docType = 'invoice';
    }

    return {
      isDocumentRequest: result.isDocumentRequest,
      chatResponse: result.chatResponse,
      documentType: docType,
      confidence: result.confidence || 0.9,
      documentData: result.documentData || {},
      validationResults,
      missingFields,
      suggestions
    };
  } catch (err) {
    console.error('AI generation error:', err);
    throw err;
  }
}

export async function generateDocumentPreviewHtml(type, data) {
  await delay(500);

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  if (type === 'invoice') {
    const items = data.items || [];
    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return `
      <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #1a1a1a; padding: 40px; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px;">
          <div>
            <h1 style="font-size: 36px; font-weight: 700; color: #111827; margin: 0 0 8px 0; letter-spacing: -0.02em;">INVOICE</h1>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">#${data.invoiceNumber || 'INV-001'} | ${data.issueDate || 'N/A'}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">DocuFlow Inc.</h3>
            <p style="color: #6B7280; font-size: 14px; margin: 0; line-height: 1.5;">123 Innovation Drive<br>Tech City, TC 90210<br>billing@docuflow.io</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid #E5E7EB;">
          <div>
            <p style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Bill To</p>
            <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${data.clientName || 'Client Name'}</h4>
            <p style="color: #4B5563; font-size: 14px; margin: 0;">${data.clientEmail || 'email@example.com'}</p>
          </div>
          <div style="text-align: right;">
            <p style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Amount Due</p>
            <h2 style="font-size: 32px; font-weight: 700; color: #4F46E5; margin: 0;">${formatter.format(total || Number(data.totalAmount) || 0)}</h2>
            <p style="color: #4B5563; font-size: 14px; margin: 4px 0 0 0;">Due by ${data.dueDate || 'N/A'}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <thead>
            <tr style="border-bottom: 2px solid #E5E7EB;">
              <th style="text-align: left; padding: 12px 8px; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Description</th>
              <th style="text-align: right; padding: 12px 8px; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Qty</th>
              <th style="text-align: right; padding: 12px 8px; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Rate</th>
              <th style="text-align: right; padding: 12px 8px; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => `
              <tr style="border-bottom: 1px solid #F3F4F6;">
                <td style="padding: 16px 8px; font-size: 14px; color: #111827;">${item.description || 'Item'}</td>
                <td style="text-align: right; padding: 16px 8px; font-size: 14px; color: #4B5563;">${item.quantity || 1}</td>
                <td style="text-align: right; padding: 16px 8px; font-size: 14px; color: #4B5563;">${formatter.format(Number(item.rate) || 0)}</td>
                <td style="text-align: right; padding: 16px 8px; font-size: 14px; font-weight: 500; color: #111827;">${formatter.format(Number(item.amount) || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end; margin-bottom: 48px;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; font-size: 14px; color: #4B5563;">
              <span>Subtotal</span>
              <span>${formatter.format(total || Number(data.totalAmount) || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; font-size: 14px; color: #4B5563; border-bottom: 1px solid #E5E7EB;">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 16px 8px; font-size: 18px; font-weight: 700; color: #111827;">
              <span>Total</span>
              <span>${formatter.format(total || Number(data.totalAmount) || 0)}</span>
            </div>
          </div>
        </div>
        
        ${data.notes ? `
          <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
            <p style="color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Notes</p>
            <p style="font-size: 14px; color: #4B5563; margin: 0; line-height: 1.5;">${data.notes}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; border-top: 1px solid #E5E7EB; padding-top: 32px; color: #9CA3AF; font-size: 12px;">
          <p>Thank you for your business.</p>
        </div>
      </div>
    `;
  }

  if (type === 'certificate') {
    return `
      <div style="font-family: 'Outfit', sans-serif; text-align: center; max-width: 800px; margin: 0 auto; color: #1e293b; padding: 60px; background: white; border: 12px solid #F1F5F9; border-radius: 4px;">
        <div style="margin-bottom: 40px;">
          <h2 style="color: #64748b; text-transform: uppercase; letter-spacing: 4px; font-size: 14px; font-weight: 600;">DocuFlow Academy</h2>
        </div>
        <h1 style="font-size: 48px; font-weight: 700; color: #0f172a; margin-bottom: 16px; font-family: 'Playfair Display', serif;">Certificate of Achievement</h1>
        <p style="font-size: 18px; color: #64748b; margin-bottom: 40px; font-style: italic;">This is to certify that</p>
        <h2 style="font-size: 36px; font-weight: 600; color: #4f46e5; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 8px; min-width: 300px;">
          ${data.recipientName || 'Recipient Name'}
        </h2>
        <p style="font-size: 18px; color: #475569; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          has successfully completed the course requirements and is hereby awarded this certificate for
        </p>
        <h3 style="font-size: 24px; font-weight: 600; color: #0f172a; margin-bottom: 60px;">
          ${data.courseName || 'Course Name'}
        </h3>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 80px; max-width: 600px; margin-left: auto; margin-right: auto;">
          <div style="text-align: center; width: 200px;">
            <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #0f172a;">${data.issueDate || new Date().toLocaleDateString()}</p>
            <div style="border-top: 1px solid #cbd5e1; padding-top: 8px;">
              <p style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Date</p>
            </div>
          </div>
          
          <div style="width: 80px; height: 80px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg);">
            <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Official<br>Seal</span>
          </div>
          
          <div style="text-align: center; width: 200px;">
            <p style="font-size: 18px; font-family: 'Caveat', cursive; color: #0f172a; margin-bottom: 8px;">John Doe</p>
            <div style="border-top: 1px solid #cbd5e1; padding-top: 8px;">
              <p style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Director</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Generic Fallback
  return `
    <div style="font-family: sans-serif; color: #333; padding: 40px; background: white; max-width: 800px; margin: 0 auto; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h1 style="color: #4F46E5; margin-bottom: 32px; font-size: 28px; border-bottom: 2px solid #EEF2FF; padding-bottom: 16px;">${type.replace('_', ' ').toUpperCase()}</h1>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        ${Object.entries(data).filter(([k]) => k !== 'items').map(([k, v]) => `
          <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #F3F4F6;">
            <strong style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">${k.replace(/([A-Z])/g, ' $1').trim()}</strong>
            <div style="font-size: 15px; color: #111827; font-weight: 500;">${String(v)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}