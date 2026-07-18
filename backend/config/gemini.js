// AI helper using Groq (free tier - no credit card required)
// Sign up at: https://console.groq.com → Create API Key → starts with "gsk_"
// Free tier: 30 req/min, 14,400 req/day with Llama 3.3 70B

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models in order of preference (all free on Groq)
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'mixtral-8x7b-32768'
];

/**
 * Call Groq AI with a system prompt and user message.
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>} Raw text response
 */
export async function callGemini(systemPrompt, userMessage) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment. Get your free key at https://console.groq.com');
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message || response.statusText;
        throw new Error(`Groq API error ${response.status}: ${msg}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) throw new Error('Empty response from Groq');

      console.log(`AI response generated using model: ${model}`);
      return text;

    } catch (err) {
      console.warn(`Model ${model} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models failed.');
}

/**
 * Parse raw LLM output that should be JSON, stripping markdown fences.
 * @param {string} rawText
 * @returns {object}
 */
export function parseJsonResponse(rawText) {
  let cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}
