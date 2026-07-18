import { createRequire } from 'module';
import { callGemini, parseJsonResponse } from '../config/gemini.js';
import Tesseract from 'tesseract.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Base system prompt instruction building
const buildSystemPrompt = (agentMode) => {
  let instructions = 'You are a Universal AI Document Analyzer.';
  
  if (agentMode === 'finance') {
    instructions = 'You are a highly specialized Financial Document Analyzer. Your primary focus is extracting financial data such as line items, invoices, amounts, tax rates, transaction dates, and account details.';
  } else if (agentMode === 'medical') {
    instructions = 'You are a highly specialized Medical Document Analyzer. Your primary focus is extracting patient details, diagnoses, medical codes, medications, dosages, and treatment dates.';
  } else if (agentMode === 'legal') {
    instructions = 'You are a highly specialized Legal Document Analyzer. Your primary focus is extracting contract clauses, legal parties, signatures, effective dates, liabilities, and jurisdictions. You MUST extract these exact fields into the "fields" array: "Summary", "Risk Score" (a number 0-100 evaluating liability risk), "Missing Clauses" (comma separated), "Termination Analysis", and "Payment Terms". For the "analysis" array, provide 3-5 specific AI suggestions and actionable legal insights based on the document risks.';
  } else if (agentMode === 'resume') {
    instructions = 'You are a highly specialized Resume & Job Fit Analyzer. Your primary focus is extracting candidate skills, experience, education, and providing a comprehensive rating and gap analysis for job recruiters. Be sure to provide ratings out of 10 and list specific skills to upgrade in the analysis section.';
  }

  return `${instructions}
You will receive raw extracted text from a document.

Your tasks:
1. Identify the TYPE of document.
2. Extract all important METADATA into a "fields" array. Each field should have a "key", "value", and a "type" (e.g. "financial", "personal", "metadata", "identity", etc.).
3. If there is tabular data (like line items on an invoice), extract it into a "table" array. Each row should have "item" (description), "qty" (number/string), "rate" (price/string), and "total" (string). If no table exists, return an empty array.
4. Perform an ANALYSIS on the document. For resumes, suggest where to upgrade skill ratings or missing skills for job recruiters. For legal documents, highlight key risks, liabilities, or clauses for lawyers. For financial/medical, provide relevant flags or insights. Extract this into an "analysis" array of strings.

Return ONLY a valid JSON object matching this schema EXACTLY:
{
  "documentType": "string (e.g. Invoice, Passport, Resume, Note)",
  "fields": [
    { "key": "string", "value": "string", "type": "string" }
  ],
  "table": [
    { "item": "string", "qty": "string", "rate": "string", "total": "string" }
  ],
  "analysis": [
    "Insight 1 (e.g. Missing skills: React, Node.js)",
    "Insight 2 (e.g. High liability clause in Section 4)"
  ]
}`;
};

export const runOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const agentMode = req.body.agentMode || 'universal';
    const contextPrompt = req.body.contextPrompt || '';
    let extractedText = '';

    console.log(`Starting OCR process for: ${originalname} (${mimetype}) using Agent: ${agentMode}`);

    // Extract text based on file type
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (mimetype.startsWith('image/')) {
      // Use Tesseract.js for Images
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      extractedText = text;
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type. Use PDF, PNG, or JPG.' });
    }

    if (!extractedText || extractedText.trim() === '') {
      return res.status(422).json({ success: false, message: 'Could not extract any readable text from the document.' });
    }

    // Pass the raw text to the AI for structuring
    let prompt = `Here is the raw text extracted from the document:\n\n${extractedText}\n\n`;
    
    if (contextPrompt) {
      prompt += `ADDITIONAL CONTEXT / TARGET JOB DESCRIPTION:\n${contextPrompt}\n\n`;
      prompt += `Analyze this document against the provided context. Specifically generate an ATS Match Score and evaluate the skill gap in the analysis array.\n`;
    } else {
      prompt += `Analyze this and return the structured JSON data.\n`;
    }
    
    const ocrSystemPrompt = buildSystemPrompt(agentMode);
    const rawAiResponse = await callGemini(ocrSystemPrompt, prompt);
    const parsedData = parseJsonResponse(rawAiResponse);

    // Return the response structured exactly like the frontend expects
    res.json({
      success: true,
      data: {
        text: extractedText,
        fields: parsedData.fields || [],
        table: parsedData.table || [],
        analysis: parsedData.analysis || [],
        documentType: parsedData.documentType || 'Unknown Document'
      }
    });

  } catch (error) {
    console.error('OCR Processing Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process document', error: error.message });
  }
};
