import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

/**
 * Helper: returns true if the Gemini API key is configured
 */
function hasApiKey() {
  return !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here');
}

/**
 * Helper: make a Gemini API call and extract the text response.
 * Throws on network or API errors.
 * @param {Array} contents - Gemini content array
 * @param {object} options - Extra request options
 * @param {boolean} usePro - If true, uses gemini-2.5-pro instead of flash
 */
async function callGemini(contents, options = {}, usePro = false) {
  if (!hasApiKey()) return null;

  const url = usePro ? GEMINI_PRO_URL : GEMINI_API_URL;
  const response = await axios.post(
    `${url}?key=${GEMINI_API_KEY}`,
    { contents, ...options }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || null;
}

/**
 * Helper: extract JSON from a Gemini text response
 */
function extractJson(text) {
  if (!text) return null;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

const geminiService = {
  /**
   * Check whether the Gemini API key is available
   */
  isAvailable() {
    return hasApiKey();
  },

  /**
   * Multi-turn chat — sends full conversation history to Gemini.
   * @param {Array} messageHistory - Array of { role: 'user'|'model', text: string }
   * @param {string} systemPrompt  - System context for the persona
   * @param {string} language      - Language code (en, hi, ta, te)
   * @returns {string|null} The assistant's response text
   */
  async chat(messageHistory, systemPrompt = '', language = 'en') {
    try {
      const contents = [];

      if (systemPrompt) {
        const langInstruction = `\n\nIMPORTANT: You MUST respond entirely in the language corresponding to this language code: "${language}". If the language is "hi", respond in Hindi. If "ta", respond in Tamil. If "te", respond in Telugu. If "en", respond in English.`;
        contents.push({
          role: 'user',
          parts: [{ text: systemPrompt + langInstruction + '\n\nAcknowledge this context and be ready to help.' }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I am ready to help as described.' }]
        });
      }

      for (const msg of messageHistory) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      }

      const text = await callGemini(contents);
      return text;
    } catch (error) {
      console.error('Gemini Chat Error:', error?.response?.data || error.message);
      return null;
    }
  },

  /**
   * Chat with injected user memory and RAG context for personalized responses.
   * @param {Array}  messageHistory - Array of { role, text }
   * @param {string} systemPrompt   - Persona system prompt
   * @param {object} userMemory     - User memory object { name, goals, interests, recentTopics, agentType }
   * @param {string} ragContext     - Optional RAG knowledge context string
   * @param {string} language       - BCP-47 language code
   * @returns {string|null}
   */
  async generateWithMemory(messageHistory, systemPrompt = '', userMemory = {}, ragContext = '', language = 'en') {
    try {
      const memoryBlock = [
        'USER MEMORY CONTEXT:',
        userMemory.name     ? `Name: ${userMemory.name}`              : null,
        userMemory.goals?.length    ? `Goals: ${userMemory.goals.join(', ')}`        : null,
        userMemory.interests?.length ? `Interests: ${userMemory.interests.join(', ')}` : null,
        userMemory.recentTopics?.length ? `Recent topics: ${userMemory.recentTopics.slice(0, 5).join(', ')}` : null,
        userMemory.agentType ? `Agent: ${userMemory.agentType}`        : null,
      ].filter(Boolean).join('\n');

      const ragBlock = ragContext ? `\nRAG KNOWLEDGE:\n${ragContext}` : '';

      const enhancedSystemPrompt = `${memoryBlock}${ragBlock}\n\n${systemPrompt}`;

      return await this.chat(messageHistory, enhancedSystemPrompt, language);
    } catch (error) {
      console.error('Gemini generateWithMemory Error:', error?.response?.data || error.message);
      return null;
    }
  },

  /**
   * Analyze a document image using Gemini Vision (multimodal).
   * @param {string} base64Image  - Base64-encoded image data
   * @param {string} mimeType     - MIME type e.g. 'image/jpeg', 'image/png', 'application/pdf'
   * @param {string} documentType - Human-readable document type e.g. 'Aadhaar', 'bank statement'
   * @param {string} language     - Language code
   * @returns {string|null}
   */
  async analyzeDocument(base64Image, mimeType, documentType = 'document', language = 'en') {
    try {
      const prompt = `Analyze this ${documentType} document. Extract key information, summarize the contents, highlight important details, and warn about any missing, unusual, or suspicious information. Be thorough and helpful. Respond in ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : 'English'}.`;
      const contents = [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Image } }
        ]
      }];
      return await callGemini(contents);
    } catch (error) {
      console.error('Gemini Document Analysis Error:', error?.response?.data || error.message);
      return null;
    }
  },

  /**
   * Analyze a message for scam/fraud indicators using Gemini AI.
   * Used by ScamShield.
   * @param {string} message  - The suspicious message to analyze
   * @param {string} type     - Message type: sms, whatsapp, upi, url, email
   * @param {string} language - Language code
   * @returns {object|null} Scam analysis result
   */
  async analyzeScam(message, type, language = 'en') {
    try {
      const prompt = `You are a cybersecurity expert specializing in scam and fraud detection in India.

Analyze this ${type.toUpperCase()} message for scam indicators:

"""
${message}
"""

Respond ONLY with a valid JSON object in this exact format:
{
  "riskScore": <number 0-100>,
  "riskLevel": "<SAFE|LOW|MEDIUM|HIGH|CRITICAL>",
  "detectedScams": [
    {
      "type": "<scam_type>",
      "risk": "<low|medium|high>",
      "description": "<brief explanation>"
    }
  ],
  "suspiciousIndicators": ["<indicator 1>", "<indicator 2>"],
  "recommendation": "<what the user should do>"
}

Be thorough. Look for: urgency tactics, fake links, OTP requests, lottery/prize claims, impersonation, too-good-to-be-true offers, phishing, UPI fraud patterns.
Language for recommendation field: ${language}`;

      const contents = [{ parts: [{ text: prompt }] }];
      const text = await callGemini(contents);
      const result = extractJson(text);

      if (result && typeof result.riskScore === 'number') {
        return result;
      }
      return null;
    } catch (error) {
      console.error('Gemini Scam Analysis Error:', error?.response?.data || error.message);
      return null;
    }
  },

  async generateRecipe(ingredients, cuisine, language = 'en') {
    try {
      const prompt = `Generate a delicious ${cuisine} recipe using these ingredients: ${ingredients}.

      Format as JSON with:
      {
        "name": "recipe name",
        "ingredients": ["list"],
        "steps": ["step 1", "step 2"],
        "cookingTime": "minutes",
        "difficulty": "Easy/Medium/Hard",
        "nutrition": {"calories": num, "protein": num, "fat": num, "carbs": num},
        "tips": "helpful tip",
        "servings": "number"
      }

      Language: ${language}`;

      const text = await callGemini([{ parts: [{ text: prompt }] }]);
      return extractJson(text);
    } catch (error) {
      console.error('Gemini Recipe Error:', error);
      return null;
    }
  },

  async generateStudyNotes(topic, subject, language = 'en') {
    try {
      const prompt = `Create comprehensive study notes for: ${topic} in ${subject}.

      Format as JSON with:
      {
        "topic": "topic name",
        "subject": "subject",
        "headings": ["Introduction", "Key Concepts", "Examples", "Summary"],
        "content": "detailed explanation",
        "keyPoints": ["point 1", "point 2", "point 3"],
        "practiceQuestions": 5,
        "tips": "study tip"
      }

      Language: ${language}`;

      const text = await callGemini([{ parts: [{ text: prompt }] }]);
      return extractJson(text);
    } catch (error) {
      console.error('Gemini Notes Error:', error);
      return null;
    }
  },

  async generateBusinessInsights(revenue, expenses, customers) {
    try {
      const prompt = `Analyze business metrics and provide insights.

      Data: Revenue: ${revenue}, Expenses: ${expenses}, Customers: ${customers}

      Format as JSON with:
      {
        "profitMargin": "percentage",
        "insights": ["insight 1", "insight 2"],
        "recommendations": ["action 1", "action 2"],
        "growthOpportunities": ["opportunity 1"],
        "risks": ["risk 1"]
      }`;

      const text = await callGemini([{ parts: [{ text: prompt }] }]);
      return extractJson(text);
    } catch (error) {
      console.error('Gemini Business Insights Error:', error);
      return null;
    }
  },

  async recommendCareer(interests, skills, qualifications) {
    try {
      const prompt = `Recommend career paths based on:
      Interests: ${interests}
      Skills: ${skills}
      Qualifications: ${qualifications}

      Format as JSON with:
      {
        "recommendedCareers": ["career 1", "career 2"],
        "requiredSkills": ["skill 1"],
        "companies": ["company 1"],
        "salaryRange": "range",
        "growthPotential": "high/medium/low"
      }`;

      const text = await callGemini([{ parts: [{ text: prompt }] }]);
      return extractJson(text);
    } catch (error) {
      console.error('Gemini Career Error:', error);
      return null;
    }
  },

  async generateMarketingCopy(product, audience, tone = 'professional') {
    try {
      const prompt = `Generate marketing copy for: ${product}
      Target audience: ${audience}
      Tone: ${tone}

      Format as JSON with:
      {
        "headline": "catchy headline",
        "body": "persuasive copy",
        "cta": "call to action",
        "hashtags": ["#tag1", "#tag2"],
        "variants": ["variant 1", "variant 2"]
      }`;

      const text = await callGemini([{ parts: [{ text: prompt }] }]);
      return extractJson(text);
    } catch (error) {
      console.error('Gemini Marketing Error:', error);
      return null;
    }
  }
};

export default geminiService;
