import { delay, generateId } from '@/lib/utils';
import { DOCUMENT_SCHEMA_REGISTRY } from '@/lib/documentSchemas';

// Real AI backend call
export async function processUserPrompt(prompt, file, onProgress) {
  onProgress('classifying');
  
  try {
    let body;
    let headers = {};

    if (file) {
      body = new FormData();
      body.append('prompt', prompt);
      body.append('document', file);
      // FormData handles its own Content-Type boundary
    } else {
      body = JSON.stringify({ prompt });
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers,
      body
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
    if (!['invoice', 'offer_letter', 'certificate', 'quotation', 'report', 'question_paper', 'resume'].includes(docType)) {
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

  if (type === 'offer_letter') {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, sans-serif; max-width: 800px; margin: 0 auto; color: #333; background: white; min-height: 1000px; position: relative; padding: 0 0 100px 0;">
        
        <!-- Top geometric header -->
        <div style="height: 20px; background: #001f3f; width: 100%; margin-bottom: 4px;"></div>
        <div style="height: 60px; background: #001f3f; width: 60%; clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%); display: flex; align-items: center; padding-left: 50px;">
          <div style="height: 100%; width: 40px; background: #00c3ff; margin-right: 20px; transform: skewX(-20deg);"></div>
        </div>
        
        <div style="padding: 40px 50px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px;">
            <div>
              <p style="font-size: 12px; color: #666; margin: 0 0 4px 0;">To</p>
              <h2 style="font-size: 18px; font-weight: bold; color: #00c3ff; margin: 0 0 4px 0; text-transform: uppercase;">${data.candidateName || 'MARK HENRY'}</h2>
              <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Candidate</p>
              
              <div style="font-size: 11px; color: #444; line-height: 1.6;">
                <p style="margin: 0;"><strong>P:</strong> ${data.candidatePhone || '+1-973-538-2197'}</p>
                <p style="margin: 0;"><strong>E:</strong> ${data.candidateEmail || 'candidate@example.com'}</p>
              </div>
            </div>
            
            <div style="text-align: right; display: flex; align-items: center;">
              <div style="text-align: right;">
                <h1 style="font-size: 24px; font-weight: bold; color: #00c3ff; margin: 0;">${data.companyName || 'COMPANY NAME'}</h1>
                <p style="font-size: 12px; color: #888; margin: 0; text-transform: uppercase;">${data.companyTagline || 'YOUR TAGLINE HERE'}</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: right; margin-bottom: 40px;">
            <p style="font-size: 12px; font-weight: bold; color: #00c3ff;">DATE: <span style="color: #444; font-weight: normal;">${data.issueDate || '23 April, 2026'}</span></p>
          </div>
          
          <div style="margin-bottom: 40px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 20px 0; text-transform: uppercase;">DEAR ${data.candidateName?.split(' ')[0] || 'CANDIDATE'},</h3>
            
            <div style="font-size: 13px; color: #555; line-height: 1.8; text-align: justify;">
              <p style="margin-bottom: 16px;">We are thrilled to offer you the position of <strong>${data.jobTitle || 'Software Engineer'}</strong> at ${data.companyName || 'our company'}. Your skills and experience will be an ideal fit for our team.</p>
              <p style="margin-bottom: 16px;">As discussed, your starting salary will be <strong>${data.salary || '$100,000 per year'}</strong>, and your anticipated start date is <strong>${data.startDate || 'next month'}</strong>.</p>
              <p style="margin-bottom: 16px;">${data.additionalTerms || 'You will be eligible for our comprehensive benefits package, including health insurance, paid time off, and stock options, subject to the terms of the company plans.'}</p>
              <p style="margin-bottom: 16px;">Please review the attached terms and conditions. If you accept this offer, kindly sign and return this letter by ${data.expiryDate || 'next week'}.</p>
            </div>
          </div>
          
          <div style="margin-top: 60px;">
            <p style="font-size: 12px; color: #666; margin: 0 0 4px 0;">From</p>
            <h3 style="font-size: 16px; font-weight: bold; color: #00c3ff; margin: 0 0 4px 0; text-transform: uppercase;">${data.hrName || 'JONATHAN RINE'}</h3>
            <p style="font-size: 12px; color: #666; margin: 0 0 24px 0;">${data.hrTitle || 'Human Resources'}</p>
            
            <div style="width: 200px; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 8px;">
              <span style="font-family: 'Caveat', cursive; font-size: 24px; color: #333;">${data.hrName || 'Jonathan'}</span>
            </div>
            <p style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Signature</p>
          </div>
        </div>
        
        <!-- Bottom geometric footer -->
        <div style="position: absolute; bottom: 0; width: 100%; height: 80px; display: flex;">
          <div style="width: 70%; background: #001f3f; height: 100%; display: flex; align-items: center; justify-content: space-around; color: white; font-size: 11px; padding: 0 20px;">
            <span>${data.companyPhone || '+1-718-310-5588'}</span>
            <span>${data.companyWebsite || 'www.yourwebsite.com'}</span>
            <span>${data.companyAddress || '789 Prudence Street'}</span>
          </div>
          <div style="width: 30%; background: #00c3ff; height: 100%; clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);">
            <div style="width: 100%; height: 100%; background: #001f3f; clip-path: polygon(25% 0, 100% 0, 100% 100%, 5% 100%); margin-left: 20px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'certificate') {
    return `
      <div style="font-family: 'Helvetica Neue', sans-serif; display: flex; max-width: 900px; margin: 0 auto; min-height: 600px; background: white; border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Left Side (White area) -->
        <div style="flex: 7; padding: 60px 50px; position: relative; background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, #f9f9f9 20px); background-size: 100% 20px;">
          <div style="text-align: center;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 50px;">
              <div style="width: 24px; height: 24px; background: #C89F5C; transform: rotate(45deg);"></div>
              <h3 style="font-size: 16px; font-weight: bold; color: #111; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">${data.companyName || 'COMPANY NAME'}</h3>
            </div>
            
            <h1 style="font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #111; margin: 0; letter-spacing: 0.1em;">CERTIFICATE</h1>
            <p style="font-size: 14px; font-weight: 600; color: #555; letter-spacing: 0.2em; text-transform: uppercase; margin: 8px 0 60px 0;">Of Appreciation</p>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 24px;">This certificate is proudly presented to</p>
            
            <div style="border-bottom: 1px solid #111; margin: 0 auto 16px auto; width: 80%; padding-bottom: 16px;">
              <h2 style="font-family: 'Great Vibes', 'Caveat', cursive; font-size: 56px; font-weight: 400; color: #111; margin: 0;">${data.recipientName || 'Name Surname'}</h2>
            </div>
            <p style="font-size: 11px; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 40px;">THE COMPANY NAME</p>
            
            <p style="font-size: 11px; color: #666; line-height: 1.6; max-width: 85%; margin: 0 auto 60px auto;">
              ${data.reason || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non auctor purus. Sed euismod dui aliquet arcu porttitor, sed mattis ipsum accumsan.'}
            </p>
            
            <div style="display: flex; justify-content: center;">
              <div style="width: 200px;">
                <div style="border-bottom: 1px solid #111; margin-bottom: 8px; height: 40px; display: flex; align-items: flex-end; justify-content: center;">
                  <span style="font-family: 'Caveat', cursive; font-size: 24px;">${data.issuerName || 'Director'}</span>
                </div>
                <p style="font-size: 10px; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">SIGNATURE</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Side (Dark Blue) -->
        <div style="flex: 3; background: #0a0b26; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 60px 40px;">
          
          <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; height: 200px;">
            <div style="width: 12px; height: 100%; background: #C89F5C;"></div>
            <div style="width: 24px; height: 100%; background: #C89F5C;"></div>
            <div style="width: 12px; height: 100%; background: #C89F5C;"></div>
          </div>
          
          <div style="position: absolute; top: 180px; left: 50%; transform: translateX(-50%);">
            <div style="width: 100px; height: 100px; background: #C89F5C; border-radius: 50%; border: 4px dashed #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              <div style="text-align: center;">
                <p style="font-size: 14px; font-weight: bold; color: #0a0b26; margin: 0; line-height: 1;">BRAND<br>AWARD</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 320px; color: white;">
            <h4 style="font-size: 12px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Brand Award</h4>
            <p style="font-size: 9px; color: rgba(255,255,255,0.6); line-height: 1.5; margin: 0;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          
          <div>
            <div style="border-bottom: 1px solid rgba(255,255,255,0.3); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 4px;">
              <span style="font-size: 10px; color: rgba(255,255,255,0.8); text-transform: uppercase;">Date</span>
              <span style="font-size: 12px; color: white;">${data.issueDate || '23 April 2026'}</span>
            </div>
          </div>
          
        </div>
      </div>
    `;
  }

  if (type === 'report') {
    return `
      <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #333; background: white; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <div style="background: #4f46e5; color: white; padding: 48px; text-align: left;">
          <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
            ${data.reportType || 'Monthly Report'}
          </div>
          <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.2;">${data.title || 'Performance & Analytics Overview'}</h1>
          <p style="font-size: 16px; color: rgba(255,255,255,0.8); margin: 0;">Date: ${data.date || new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="padding: 48px;">
          ${data.summary ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 16px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Executive Summary</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0;">${data.summary}</p>
            </div>
          ` : ''}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
            ${Object.entries(data.metrics || {}).map(([key, value]) => `
              <div style="background: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #f3f4f6;">
                <p style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin: 0 0 8px 0;">${key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p style="font-size: 28px; font-weight: 700; color: #111; margin: 0;">${value}</p>
              </div>
            `).join('')}
          </div>
          
          ${data.details ? `
            <div>
              <h2 style="font-size: 18px; font-weight: 700; color: #111; margin: 0 0 16px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Detailed Analysis</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0;">${data.details}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  if (type === 'resume') {
    return `
      <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 850px; margin: 0 auto; color: #1f2937; padding: 60px; background: white;">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #111827; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 style="font-size: 42px; font-weight: 800; color: #111827; margin: 0 0 8px 0; letter-spacing: -0.02em; line-height: 1;">${data.name || 'Your Name'}</h1>
            <p style="font-size: 18px; font-weight: 500; color: #4f46e5; margin: 0;">${data.professionalTitle || 'Professional Title'}</p>
          </div>
          <div style="text-align: right; font-size: 13px; color: #4b5563; line-height: 1.6;">
            ${data.contactInfo?.email ? `<div>${data.contactInfo.email}</div>` : ''}
            ${data.contactInfo?.phone ? `<div>${data.contactInfo.phone}</div>` : ''}
            ${data.contactInfo?.linkedin ? `<div>${data.contactInfo.linkedin}</div>` : ''}
            ${data.contactInfo?.github ? `<div>${data.contactInfo.github}</div>` : ''}
          </div>
        </div>

        ${data.professionalSummary ? `
        <div style="margin-bottom: 32px;">
          <p style="font-size: 15px; line-height: 1.7; color: #374151; margin: 0;">${data.professionalSummary}</p>
        </div>` : ''}

        ${Array.isArray(data.experience) && data.experience.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 20px;">Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <h3 style="font-size: 16px; font-weight: 700; color: #111827; margin: 0;">${exp.role || ''}</h3>
                <span style="font-size: 13px; font-weight: 500; color: #6b7280;">${exp.duration || ''}</span>
              </div>
              <div style="font-size: 14px; font-weight: 500; color: #4f46e5; margin-bottom: 12px;">
                ${exp.company || ''} ${exp.location ? `<span style="color: #9ca3af; font-weight: 400;">| ${exp.location}</span>` : ''}
              </div>
              <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; color: #374151;">
                ${Array.isArray(exp.achievements) ? exp.achievements.map(ach => `<li style="margin-bottom: 6px; padding-left: 4px;">${ach}</li>`).join('') : ''}
              </ul>
            </div>
          `).join('')}
        </div>` : ''}

        ${Array.isArray(data.projects) && data.projects.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 20px;">Projects</h2>
          ${data.projects.map(proj => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0;">${proj.name || ''}</h3>
                <span style="font-size: 13px; font-weight: 500; color: #6b7280;">${proj.duration || ''}</span>
              </div>
              ${proj.technologies ? `<div style="font-size: 13px; font-weight: 500; color: #4f46e5; margin-bottom: 8px;">${proj.technologies}</div>` : ''}
              <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; color: #374151;">
                ${proj.problem ? `<li style="margin-bottom: 4px; padding-left: 4px;"><strong>Challenge:</strong> ${proj.problem}</li>` : ''}
                ${proj.solution ? `<li style="margin-bottom: 4px; padding-left: 4px;"><strong>Solution:</strong> ${proj.solution}</li>` : ''}
                ${proj.impact ? `<li style="margin-bottom: 4px; padding-left: 4px;"><strong>Impact:</strong> ${proj.impact}</li>` : ''}
              </ul>
            </div>
          `).join('')}
        </div>` : ''}

        ${data.technicalSkills && Object.keys(data.technicalSkills).length > 0 ? `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px;">Skills</h2>
          <div style="font-size: 14px; line-height: 1.8; color: #374151;">
            ${Object.entries(data.technicalSkills).filter(([_, v]) => v && v.length > 0).map(([k, v]) => `
              <div style="margin-bottom: 4px;">
                <span style="font-weight: 600; color: #111827; display: inline-block; width: 140px;">${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> 
                ${v.join(', ')}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${Array.isArray(data.education) && data.education.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 20px;">Education</h2>
          ${data.education.map(edu => `
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0;">${edu.degree || ''}</h3>
              <span style="font-size: 13px; font-weight: 500; color: #6b7280;">${edu.graduationYear || ''}</span>
            </div>
            <div style="font-size: 14px; color: #4b5563;">
              ${[edu.college, edu.university].filter(Boolean).join(', ')} ${edu.cgpa ? `<span style="font-weight: 500; color: #4f46e5;">| CGPA: ${edu.cgpa}</span>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
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