// ─── Agent Router ─────────────────────────────────────────────────────────────
// Routes user queries to the correct specialized agent.
// Each agent has: unique system prompt, tools list, reasoning style, memory namespace.

import ragService    from './rag.js';
import memoryService from './memory.js';
import geminiService from './gemini.js';
import apiService from './api.js';

// ─────────────────────────────────────────────────────────────────────────────
// AGENT DEFINITIONS — true differentiation per agent
// ─────────────────────────────────────────────────────────────────────────────

const AGENTS = {

  // ── AMMA AGENT ─────────────────────────────────────────────────────────
  amma: {
    name: 'Amma Saarthi',
    emoji: '🏡',
    color: '#D4547A',

    systemPrompt: `You are Amma Saarthi — a warm, caring digital companion for Indian homemakers, mothers, and women managing households.

PERSONALITY & TONE:
- Speak like a caring elder sister or knowledgeable neighbor — warm, patient, understanding
- Use simple Hindi-English mix naturally (e.g., "Bilkul aap kar sakti hain!" or "Don't worry!")  
- Never use technical jargon — always explain in plain simple language
- Show genuine care: "Aapki chinta bilkul sahi hai", "Main samajh sakti hoon"
- Celebrate small wins: "Aapne bahut achha kiya!"
- Be patient — explain the same thing multiple ways if needed

EXPERTISE (in order of priority):
1. Government welfare schemes (PM-Kisan, Ujjwala, Ayushman Bharat, MGNREGA, Awas Yojana)
2. Digital banking, UPI, Jan Dhan accounts, safe online transactions
3. Scam detection — protect family from OTP fraud, fake calls, lottery scams
4. Aadhaar, ration card, and document management
5. Family health, nutrition, and wellness for women
6. Grocery budgeting and cooking tips
7. Self Help Groups (SHGs) and community connections
8. Online form filling and government portal navigation

RESPONSE STYLE:
- Keep responses concise but complete — 3 to 6 sentences for simple questions
- For step-by-step tasks: use numbered steps (1. 2. 3.)
- Always end with an encouraging line or an offer to help further
- If uncertain: "Main sure nahi hoon, lekin aap [X] se check kar sakti hain"
- Never assume technical knowledge — explain every acronym

TOOLS AVAILABLE:
- Government scheme database (PM-Kisan, Ujjwala, Ayushman, etc.)
- Scam detection patterns for Indian context
- Recipe knowledge base
- Banking and UPI guidance`,

    tools: ['government_schemes', 'scam_detection', 'banking_guide', 'recipe_generator', 'document_guide'],
    
    reasoningStyle: 'empathetic-practical',
    
    responseFormat: {
      maxLength: 'medium',
      useEmoji: true,
      useHindiPhrases: true,
      alwaysOffer: 'further_help',
    },
  },

  // ── STUDENT AGENT ──────────────────────────────────────────────────────
  student: {
    name: 'Student Saarthi',
    emoji: '🎓',
    color: '#6C63FF',

    systemPrompt: `You are Student Saarthi — an encouraging mentor, career guide, and study companion for Indian students from Class 8 to fresh graduates.

PERSONALITY & TONE:
- Act as a cool senior or mentor who genuinely wants you to succeed
- Be motivating but realistic — don't give false hope, give actionable advice
- Use current student language naturally ("solid", "grind", "let's go", "nailed it")
- Acknowledge struggles: "Exam stress is real, and your feelings are valid"
- Be specific — don't say "study hard", say "solve 20 problems daily"

EXPERTISE (in order of priority):
1. Career roadmaps — software dev, data science, UPSC, CA, medicine, arts
2. Exam preparation — NEET, JEE, UPSC, Board exams, competitive exams  
3. Scholarships — NSP, Tata Trusts, state scholarships, PM scholarship
4. Internships — Internshala, LinkedIn, campus placements, cold outreach
5. Resume building — ATS-friendly, action verbs, quantified achievements
6. Study techniques — Pomodoro, Active Recall, Spaced Repetition, Feynman
7. Free certifications — Google, Coursera, AWS, GitHub Student Pack
8. Mental health — exam stress, gap year support, motivation

RESPONSE STYLE:
- Give specific, actionable advice — not generic tips
- Include real numbers: "60-70% marks in Mock + 10 previous year papers"
- Reference real platforms: Internshala, NSP scholarships.gov.in, Coursera
- For career paths: mention salary range, growth, required skills
- Always personalize to what the student has mentioned (course, goal, interest)
- End with: a specific next action the student can take TODAY

TOOLS AVAILABLE:
- Career path database with salary and skill requirements
- Scholarship database with application portals
- Exam pattern and preparation guides  
- Study planner and technique guides
- Resume and interview preparation`,

    tools: ['career_guide', 'scholarship_finder', 'study_planner', 'resume_builder', 'exam_guide'],
    
    reasoningStyle: 'mentoring-actionable',
    
    responseFormat: {
      maxLength: 'medium',
      useEmoji: true,
      useMotivation: true,
      alwaysInclude: 'next_action',
    },
  },

  // ── BUSINESS AGENT ────────────────────────────────────────────────────
  business: {
    name: 'Business Saarthi',
    emoji: '💼',
    color: '#1B365D',

    systemPrompt: `You are Business Saarthi — a sharp, no-nonsense business consultant and advisor for Indian MSMEs, shop owners, and entrepreneurs.

PERSONALITY & TONE:
- Speak like a seasoned business consultant who gets to the point
- Data-driven: back recommendations with numbers, percentages, benchmarks
- Practical over theoretical — "here's exactly what to do" not "you should consider"
- Acknowledge business reality: "Cash flow is king", "First get customers, then scale"
- Respect time: keep responses crisp, organized, actionable
- Mix English with occasional Hindi business terms naturally

EXPERTISE (in order of priority):
1. GST — registration, filing GSTR-1/3B/9, ITC claims, compliance
2. Business loans — Mudra, CGTMSE, MSME schemes, loan eligibility
3. Marketing — digital marketing, WhatsApp Business, Google My Business, social media
4. Business analytics — revenue, margins, cost optimization
5. Customer management — CRM, retention strategies, NPS
6. Operations — inventory, cash flow, pricing strategy
7. Udyam / MSME registration and government schemes
8. E-commerce — Amazon, Flipkart, Meesho, GeM portal
9. Export/Import — DGFT, IEC, export promotion councils

RESPONSE STYLE:
- Lead with the answer, then explain — busy entrepreneurs don't have time to read preamble
- Use bullet points for lists of steps or options
- Include specific numbers: deadlines, penalty amounts, interest rates, platform fees
- Compare options when relevant: "Option A: ₹X cost, Option B: ₹Y cost"
- Call out risks clearly: "Warning: Late filing penalty is ₹50/day"
- End with: the single most important action to take now

TOOLS AVAILABLE:
- GST compliance database with deadlines and rates
- Business loan schemes directory
- Market analysis and pricing calculator
- Customer retention playbook  
- Digital marketing channel comparison`,

    tools: ['gst_guide', 'loan_finder', 'marketing_advisor', 'financial_analyzer', 'crm_guide'],
    
    reasoningStyle: 'analytical-actionable',
    
    responseFormat: {
      maxLength: 'medium',
      useEmoji: false,
      useNumbers: true,
      alwaysInclude: 'priority_action',
    },
  },

  // ── SENIOR AGENT ──────────────────────────────────────────────────────
  senior: {
    name: 'Senior Saarthi',
    emoji: '🌟',
    color: '#0EA5E9',

    systemPrompt: `You are Senior Saarthi — a patient, caring, and trustworthy digital companion dedicated to helping elderly citizens (60+) in India navigate digital life safely and comfortably.

PERSONALITY & TONE:
- Speak slowly and clearly — imagine you are talking to a beloved grandparent
- Use VERY simple words — no jargon, no abbreviations without explanation
- Be EXTREMELY patient — never show frustration if they ask the same question again
- Show deep respect: "Aap bilkul sahi pooch rahe hain", "Ji, main samjhata/ti hoon"
- Be reassuring and calm: "Aap bilkul safe hain", "Koi baat nahi, main hoon na"
- Celebrate every small achievement: "Bahut badhiya! Aapne achha kiya!"

EXPERTISE (in order of priority):  
1. Scam protection — OTP fraud, fake bank calls, lottery scams, grandchild scams
2. Health — medicine reminders, doctor visits, common conditions (BP, diabetes, arthritis)
3. Pension and benefits — EPF/EPS pension, IGNOAPS, Ayushman Bharat 70+
4. Smartphone and WhatsApp basics — step-by-step simple instructions
5. Government benefits — senior citizen concessions (railway, bus, bank)
6. Legal rights — Maintenance Act, property rights, elder abuse
7. Financial safety — SCSS savings scheme, FD rates, income tax exemption
8. Emergency preparedness — 108 ambulance, doctor contacts, family alerts

RESPONSE STYLE:
- Use LARGE clear formatting: numbered steps with spaces between them
- NEVER give more than 3-4 steps at once — it is overwhelming
- Repeat key safety warnings clearly and prominently
- Use simple analogies: "UPI PIN is like ATM PIN — never share with anyone"
- Always offer to repeat or explain differently: "Kya main dobara samjhaun?"
- Reference familiar things: "Jaise aap bank mein counter pe jaate hain..."
- End with a safety reminder or warm closing

CRITICAL SAFETY RULES TO ALWAYS REINFORCE:
- Bank/government NEVER asks for OTP on phone → HANG UP
- Police NEVER demand money on phone → HANG UP  
- Lottery you never entered cannot be won → IGNORE
- When in doubt, call family member FIRST before doing anything

TOOLS AVAILABLE:
- Scam pattern detection for elderly-targeted fraud
- Government senior benefits database
- Health and medicine information
- Emergency contacts and helplines`,

    tools: ['scam_protection', 'pension_guide', 'health_info', 'smartphone_guide', 'legal_rights'],
    
    reasoningStyle: 'patient-safety-focused',
    
    responseFormat: {
      maxLength: 'short-clear',
      useEmoji: true,
      useLargeSteps: true,
      alwaysInclude: 'safety_reminder',
      fontSize: 'large',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA TOOL REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_REGISTRY = {
  student: {
    search_scholarships: {
      description: 'Search scholarship opportunities from the scholarship database.',
      execute: async (userMessage) => {
        const match = userMessage.match(/(engineering|medical|law|arts|mba|upsc|bca|msc|phd|diploma|undergraduate|postgraduate|college|school)/i);
        const category = match ? match[1] : null;
        const scholarships = await apiService.getScholarships(category);
        const list = Array.isArray(scholarships) ? scholarships.slice(0, 3) : [];

        if (!list.length) {
          return {
            toolName: 'search_scholarships',
            success: true,
            summary: 'I could not fetch a live scholarship list right now, but I can still help you shortlist the right options by field and eligibility.',
            data: [],
            formatted: 'No live scholarship data available right now.',
          };
        }

        const formatted = list.map((item, index) => `${index + 1}. ${item.name || 'Scholarship'}${item.provider ? ` — ${item.provider}` : ''}${item.deadline ? ` • Deadline: ${item.deadline}` : ''}`).join('\n');

        return {
          toolName: 'search_scholarships',
          success: true,
          summary: `I found ${list.length} scholarship option(s) that look relevant.`,
          data: list,
          formatted,
        };
      },
    },
    generate_study_plan: {
      description: 'Create a structured study plan based on subject, days, and hours per day.',
      execute: (userMessage) => {
        const subjectMatch = userMessage.match(/for\s+([a-zA-Z0-9\s-]+)/i) || userMessage.match(/subject\s+([a-zA-Z0-9\s-]+)/i);
        const daysMatch = userMessage.match(/(\d+)\s*(day|days|week|weeks)/i);
        const hoursMatch = userMessage.match(/(\d+)\s*(hour|hours|hr|hrs)/i);

        const subject = subjectMatch ? subjectMatch[1].trim() : 'core subjects';
        const days = Math.max(1, Math.min(7, Number(daysMatch?.[1]) || 7));
        const hoursPerDay = Math.max(1, Math.min(6, Number(hoursMatch?.[1]) || 2));

        const plan = Array.from({ length: days }, (_, index) => {
          const topic = index === 0 ? 'Foundation and weak areas' : index === 1 ? 'Practice and revision' : 'Mixed practice and review';
          return `${index + 1}. ${topic}: spend ${hoursPerDay} hours on ${subject} and review the key points.`;
        }).join('\n');

        return {
          toolName: 'generate_study_plan',
          success: true,
          summary: `Here is a ${days}-day study plan for ${subject} at ${hoursPerDay} hours per day.`,
          data: { subject, days, hoursPerDay },
          formatted: plan,
        };
      },
    },
  },

  senior: {
    check_scam_message: {
      description: 'Analyze a suspicious message or call script for scam indicators.',
      execute: async (userMessage, language) => {
        const analysis = await geminiService.analyzeScam(userMessage, 'whatsapp', language);
        if (analysis && typeof analysis.riskScore === 'number') {
          return {
            toolName: 'check_scam_message',
            success: true,
            summary: `This looks ${analysis.riskLevel?.toLowerCase() || 'suspicious'} with a risk score of ${analysis.riskScore}/100.`,
            data: analysis,
            formatted: `${analysis.recommendation || 'Stay cautious.'}\n${(analysis.detectedScams || []).map(item => `• ${item.type}: ${item.description}`).join('\n')}`,
          };
        }

        const lower = userMessage.toLowerCase();
        const redFlags = [];
        if (/(otp|one time password|verify|bank|upi|kyc)/i.test(lower)) redFlags.push('urgent verification request');
        if (/(lottery|prize|won|claim|refund)/i.test(lower)) redFlags.push('too-good-to-be-true reward');
        if (/(click|link|whatsapp|call|telegram)/i.test(lower)) redFlags.push('suspicious link or urgency');

        return {
          toolName: 'check_scam_message',
          success: true,
          summary: redFlags.length ? `I found signs of ${redFlags.join(' and ')}.` : 'The message does not show obvious scam markers, but caution is still wise.',
          data: { redFlags },
          formatted: redFlags.length ? `Possible warning signs: ${redFlags.join(', ')}` : 'No obvious scam markers found.',
        };
      },
    },
    set_reminder: {
      description: 'Create a reminder for medicine, appointments, or general tasks.',
      execute: async (userMessage) => {
        const lower = userMessage.toLowerCase();
        const type = /medicine|pill|tablet|dose/i.test(lower) ? 'medicine' : /appointment|doctor|clinic|visit/i.test(lower) ? 'appointment' : 'task';
        const description = userMessage.replace(/remind|reminder|please|set/i, '').trim() || `${type} reminder`;
        const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const reminder = await apiService.createReminder(type, description, dueDate);

        return {
          toolName: 'set_reminder',
          success: true,
          summary: `I have saved a ${type} reminder for you.`,
          data: reminder,
          formatted: `Reminder saved: ${description}`,
        };
      },
    },
  },

  business: {
    calculate_gst: {
      description: 'Calculate GST for an amount using either exclusive or inclusive pricing.',
      execute: (userMessage) => {
        const amountMatch = userMessage.match(/₹?\s?(\d+(?:,\d{3})*(?:\.\d+)?)/);
        const rateMatch = userMessage.match(/(\d+(?:\.\d+)?)\s*%/);
        const amount = Number((amountMatch?.[1] || '1000').replace(/,/g, ''));
        const rate = Number(rateMatch?.[1] || '18');
        const inclusive = /inclusive/i.test(userMessage);

        const tax = inclusive ? amount - (amount / (1 + rate / 100)) : amount * (rate / 100);
        const total = inclusive ? amount : amount + tax;
        const net = inclusive ? amount / (1 + rate / 100) : amount;

        return {
          toolName: 'calculate_gst',
          success: true,
          summary: `GST at ${rate}% for ₹${amount.toLocaleString()} is calculated using ${inclusive ? 'inclusive' : 'exclusive'} pricing.`,
          data: { amount, rate, inclusive, tax, total, net },
          formatted: `Amount: ₹${amount.toLocaleString()}\nGST Rate: ${rate}%\nGST Amount: ₹${tax.toFixed(2)}\nTotal: ₹${total.toFixed(2)}`,
        };
      },
    },
    lookup_customer: {
      description: 'Look up customer purchase history and total spending.',
      execute: async (userMessage) => {
        const customers = await apiService.getCustomers();
        const list = Array.isArray(customers) ? customers : [];
        const keyword = userMessage.match(/customer\s+([a-zA-Z0-9\s-]+)/i)?.[1] || userMessage.match(/for\s+([a-zA-Z0-9\s-]+)/i)?.[1];

        const filtered = keyword
          ? list.filter((customer) => `${customer.name || ''} ${customer.phone || ''} ${customer.email || ''}`.toLowerCase().includes(keyword.toLowerCase()))
          : list;

        const selected = filtered.slice(0, 3);
        const totalSpending = selected.reduce((sum, item) => sum + Number(item.totalSpent || item.total_spent || 0), 0);
        const formatted = selected.length
          ? selected.map((item) => `${item.name || 'Customer'} — ₹${Number(item.totalSpent || item.total_spent || 0).toLocaleString()}${item.lastPurchase ? ` • Last purchase: ${item.lastPurchase}` : ''}`).join('\n')
          : 'No customer records were found.';

        return {
          toolName: 'lookup_customer',
          success: true,
          summary: selected.length ? `I found ${selected.length} matching customer record(s) with total spending of ₹${totalSpending.toLocaleString()}.` : 'No matching customer records were found.',
          data: selected,
          formatted,
        };
      },
    },
  },
};

function getRelevantToolNames(persona, userMessage) {
  const lower = userMessage.toLowerCase();

  switch (persona) {
    case 'student': {
      const tools = [];
      if (/(scholarship|scholarships|financial aid|fellowship|fee waiver)/i.test(lower)) tools.push('search_scholarships');
      if (/(study plan|study schedule|timetable|revision plan|daily plan|exam plan|study for|prepare for)/i.test(lower)) tools.push('generate_study_plan');
      return tools;
    }
    case 'senior': {
      const tools = [];
      if (/(scam|fraud|otp|lottery|fake|suspicious|message|call|whatsapp|sms)/i.test(lower)) tools.push('check_scam_message');
      if (/(remind|reminder|medicine|appointment|doctor|clinic|task|pill|checkup)/i.test(lower)) tools.push('set_reminder');
      return tools;
    }
    case 'business': {
      const tools = [];
      if (/(gst|tax|calculate|invoice|vat)/i.test(lower)) tools.push('calculate_gst');
      if (/(customer|client|purchase history|spending|buyer|sales|consumer)/i.test(lower)) tools.push('lookup_customer');
      return tools;
    }
    default:
      return [];
  }
}

async function executePersonaTools(persona, userMessage, language) {
  const toolNames = getRelevantToolNames(persona, userMessage);
  const results = [];

  for (const toolName of toolNames) {
    const toolDef = TOOL_REGISTRY[persona]?.[toolName];
    if (!toolDef) continue;

    try {
      const result = await toolDef.execute(userMessage, language);
      results.push(result);
    } catch (error) {
      console.error(`Tool execution failed for ${persona}.${toolName}:`, error);
      results.push({
        toolName,
        success: false,
        summary: 'The tool could not run right now, but I can still help from general guidance.',
        data: null,
        formatted: '',
      });
    }
  }

  return results;
}

function buildToolContext(toolResults) {
  if (!toolResults?.length) return '';

  const sections = toolResults.map((result) => {
    const summary = result.success ? result.summary : result.summary;
    const formatted = result.formatted ? `\n${result.formatted}` : '';
    return `- ${result.toolName}: ${summary}${formatted}`;
  });

  return `PERSONA TOOL RESULTS:\n${sections.join('\n')}`;
}

function buildToolFallbackResponse(persona, toolResults, language) {
  const toolText = toolResults
    .filter((result) => result.success)
    .map((result) => result.formatted || result.summary)
    .join('\n\n');

  if (!toolText) return null;

  const lang = language === 'hi' ? 'hi' : language === 'ta' ? 'ta' : language === 'te' ? 'te' : 'en';
  if (lang === 'hi') {
    return `${toolText}\n\nमुझे उम्मीद है कि यह मददगार रहा। यदि आप चाहें, तो मैं इसे और सरल तरीके से समझा सकता हूं।`;
  }
  if (lang === 'ta') {
    return `${toolText}\n\nஇது உங்களுக்கு உதவியாக இருந்தால் நான் இன்னும் விரிவாக விளக்க முடியும்.`;
  }
  if (lang === 'te') {
    return `${toolText}\n\nఇది మీకు ఉపయోగకరంగా ఉంటే, నేను ఇంకా సులభంగా వివరించగలను.`;
  }
  return `${toolText}\n\nI can break this down further if you want a simpler explanation.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT ROUTER — main function
// ─────────────────────────────────────────────────────────────────────────────

const agentRouter = {

  /**
   * Route a user message through the correct agent with RAG + Memory context.
   *
   * @param {string} userMessage         - The user's current message
   * @param {string} persona             - 'amma' | 'student' | 'business' | 'senior'
   * @param {Array}  conversationHistory - Previous messages [{role, text}]
   * @param {string} language            - Language code 'en' | 'hi' | 'ta' | 'te'
   * @param {string} userId              - User ID for memory
   *
   * @returns {Promise<{
   *   response: string,
   *   sources: Array,
   *   agentName: string,
   *   usedRAG: boolean,
   *   usedMemory: boolean
   * }>}
   */
  async route(userMessage, persona, conversationHistory = [], language = 'en', userId = null) {
    const agent = AGENTS[persona] || AGENTS.amma;

    // ── Step 1: Auto-extract facts for long-term memory ──────────────────
    if (userId) {
      memoryService.autoExtractFacts(userId, persona, userMessage);

      // Save this user message to short-term memory
      memoryService.saveMessage(userId, persona, {
        role: 'user',
        text: userMessage,
        time: new Date().toISOString(),
      });
    }

    // ── Step 2: RAG — retrieve relevant knowledge ────────────────────────
    const { context: ragContext, sources } = ragService.retrieve(userMessage, persona, 3);
    const usedRAG = sources.length > 0;

    // ── Step 3: Memory context ───────────────────────────────────────────
    const memoryContext = userId
      ? memoryService.buildMemoryContext(userId, persona)
      : '';
    const usedMemory = memoryContext.length > 0;

    // ── Step 4: Execute persona-specific tools if relevant ─────────────
    const toolResults = await executePersonaTools(persona, userMessage, language);
    const toolContext = buildToolContext(toolResults);

    // ── Step 5: Build full system prompt ─────────────────────────────────
    const langInstruction = buildLanguageInstruction(language);

    const fullSystemPrompt = [
      agent.systemPrompt,
      langInstruction,
      memoryContext,
      usedRAG ? ragService.buildContextPrompt(ragContext) : '',
      toolContext,
    ]
      .filter(Boolean)
      .join('\n');

    // ── Step 6: Build conversation for Gemini ───────────────────────────
    // Use last 10 messages for context (save tokens)
    const recentHistory = conversationHistory.slice(-10);

    // ── Step 6: Call Gemini through geminiService ────────────────────────
    let response = null;

    if (geminiService.isAvailable()) {
      response = await geminiService.chat(
        recentHistory,
        fullSystemPrompt,
        language
      );
    }

    // ── Step 7: Fallback if Gemini unavailable or tools should lead ─────
    if (!response) {
      response = toolResults.length > 0
        ? buildToolFallbackResponse(persona, toolResults, language)
        : getFallbackResponse(persona, userMessage, language);
    }

    // ── Step 8: Save assistant response to memory ────────────────────────
    if (userId && response) {
      memoryService.saveMessage(userId, persona, {
        role: 'assistant',
        text: response,
        time: new Date().toISOString(),
      });
    }

    return {
      response,
      sources,
      agentName: agent.name,
      agentEmoji: agent.emoji,
      agentColor: agent.color,
      usedRAG,
      usedMemory,
      toolsUsed: toolResults.map((item) => item.toolName),
    };
  },

  /**
   * Get agent info without routing.
   */
  getAgent(persona) {
    return AGENTS[persona] || AGENTS.amma;
  },

  /**
   * List all agents.
   */
  getAllAgents() {
    return Object.entries(AGENTS).map(([key, agent]) => ({
      persona: key,
      name: agent.name,
      emoji: agent.emoji,
      color: agent.color,
      tools: agent.tools,
    }));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function buildLanguageInstruction(language) {
  const langNames = {
    en: 'English',
    hi: 'Hindi (हिन्दी)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    bn: 'Bengali (বাংলা)',
    mr: 'Marathi (मराठी)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
  };

  const langName = langNames[language] || 'English';

  return `\nLANGUAGE INSTRUCTION: You MUST respond entirely in ${langName}. All your text, explanations, and advice must be in ${langName}. Do not switch languages mid-response unless the user specifically uses Hindi words in an English context.\n`;
}

function getFallbackResponse(persona, userMessage, language) {
  const fallbacks = {
    en: {
      amma: `Namaste! 🙏 I understand your question. For government schemes like PM-Kisan, Ujjwala, and Ayushman Bharat, you can visit the official portals or your nearest Common Service Centre (CSC). Would you like me to explain any specific scheme in detail?`,
      student: `Hey! 👋 Great question. For career guidance and scholarships, check out scholarships.gov.in for government scholarships and Internshala for internships. What specific area would you like to know more about — career path, exams, or scholarships?`,
      business: `Good day! For GST and business queries, the key portals are gst.gov.in for filing and udyamregistration.gov.in for MSME registration. What specific business challenge can I help you solve today?`,
      senior: `Namaste ji! 🙏 I am here to help you. For any government benefits or pension queries, you can call the helpline 1800-180-1253 (free, HelpAge India). Please tell me slowly what you need help with — I am listening carefully.`,
    },
    hi: {
      amma: `नमस्ते! 🙏 आपका सवाल समझ में आया। PM-Kisan, Ujjwala जैसी सरकारी योजनाओं के लिए आप नजदीकी CSC केंद्र या आधिकारिक वेबसाइट पर जा सकती हैं। क्या मैं कोई खास योजना के बारे में विस्तार से बताऊं?`,
      student: `हैलो! 👋 बहुत अच्छा सवाल है। Scholarships के लिए scholarships.gov.in और internships के लिए Internshala देखें। Career, exam, या scholarship — किस बारे में जानना है?`,
      business: `नमस्ते! GST और business के लिए gst.gov.in और udyamregistration.gov.in मुख्य portal हैं। आज किस business समस्या में मदद चाहिए?`,
      senior: `नमस्ते जी! 🙏 मैं आपकी मदद के लिए यहां हूं। किसी भी सरकारी लाभ के लिए 1800-180-1253 (HelpAge India, मुफ्त) पर call करें। धीरे-धीरे बताइए — मैं ध्यान से सुन रहा/रही हूं।`,
    },
  };

  const langFallbacks = fallbacks[language] || fallbacks.en;
  return langFallbacks[persona] || langFallbacks.amma;
}

export default agentRouter;
export { AGENTS };
