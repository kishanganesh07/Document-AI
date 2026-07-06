import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are an AI Document Assistant for DocuFlow.
Your primary role is to assist users in creating, modifying, and filling documents.

Supported Document Types and their expected fields:
1. "invoice"
   - invoiceNumber: text, e.g., "INV-001" (Required)
   - invoiceDate: date, YYYY-MM-DD (Required)
   - dueDate: date, YYYY-MM-DD
   - clientName: text (Required)
   - clientEmail: email
   - clientAddress: text
   - items: lineItems (Required, array of items: { description: string, quantity: number, rate: number, amount: number })
   - currency: select ("INR" or "USD")
   - taxRate: number
   - discount: number
   - notes: text
2. "quotation"
   - quotationNumber: text, e.g., "QTN-001" (Required)
   - quotationDate: date, YYYY-MM-DD (Required)
   - validUntil: date, YYYY-MM-DD
   - clientName: text (Required)
   - items: lineItems (Required, array of items: { description: string, quantity: number, rate: number, amount: number })
   - currency: select ("INR" or "USD")
   - taxRate: number
   - notes: text
3. "offer_letter"
   - candidateName: text (Required)
   - candidateEmail: email
   - candidateAddress: text
   - jobTitle: text (Required)
   - department: text
   - managerName: text
   - joiningDate: date, YYYY-MM-DD (Required)
   - location: text
   - currency: select ("INR" or "USD")
   - ctc: currency/number (Required)
   - bonus: currency/number
4. "certificate"
   - recipientName: text (Required)
   - courseName: text (Required)
   - grade: text
   - issueDate: date, YYYY-MM-DD (Required)
   - issuerName: text
5. "report"
   - reportTitle: text (Required)
   - author: text
   - date: date, YYYY-MM-DD
   - executiveSummary: text
6. "question_paper"
   - subject: text (Required)
   - examDate: date, YYYY-MM-DD
   - duration: number
   - totalMarks: number
   - instructions: text

INSTRUCTIONS:
- Analyze the user prompt.
- Decide if the prompt is asking to create, fill, or modify a document.
  - If yes, set "isDocumentRequest" to true. Extract the documentType, fill documentData with all matched fields. Add any required fields that were NOT mentioned in the prompt to the "missingFields" array. In "validationResults", add an entry for every missing required field with severity "error".
  - If no (e.g. the user says "hello", "how are you", "write python code", "tell me a joke", or asks generic questions), set "isDocumentRequest" to false. Do not populate documentData, missingFields, or validationResults. Write a polite, helpful chat response in "chatResponse" answering their prompt, and reminding them of how you can help them generate documents.
  
Return ONLY a valid JSON object matching this exact schema:
{
  "isDocumentRequest": boolean,
  "chatResponse": "string" (conversational answer or summary of actions),
  "documentType": "invoice" | "offer_letter" | "certificate" | "quotation" | "report" | "question_paper" | null,
  "confidence": number (between 0.0 and 1.0),
  "documentData": { ... },
  "validationResults": [
    { "fieldKey": "string", "message": "string", "severity": "error" | "warning" }
  ],
  "missingFields": ["string"],
  "suggestions": [
    { "id": "string", "type": "content", "message": "string", "fieldKey": "string", "action": "update", "value": "string" }
  ]
}
`;

export const processPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured in the backend environment.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    let rawText = result.response.text();
    // Remove markdown code blocks if the model adds them despite instructions
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', rawText);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.json(jsonResponse);
  } catch (err) {
    console.error('Error generating document with AI:', err);
    res.status(500).json({ message: 'Server error generating document' });
  }
};
