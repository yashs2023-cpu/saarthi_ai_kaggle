// ─── Simple RAG Engine ────────────────────────────────────────────────────────
// Retrieval Augmented Generation without any external DB.
// Uses keyword-based retrieval on local knowledge bases.

import ammaKnowledge     from '../knowledge/ammaKnowledge.js';
import studentKnowledge  from '../knowledge/studentKnowledge.js';
import businessKnowledge from '../knowledge/businessKnowledge.js';
import seniorKnowledge   from '../knowledge/seniorKnowledge.js';

// ── Knowledge base map by persona ──────────────────────────────────────────
const KNOWLEDGE_BASES = {
  amma:     ammaKnowledge,
  student:  studentKnowledge,
  business: businessKnowledge,
  senior:   seniorKnowledge,
};

// ── Stop words to ignore during matching ───────────────────────────────────
const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could','should',
  'may','might','shall','can','need','dare','ought','used',
  'i','me','my','we','us','our','you','your','he','him','his',
  'she','her','they','them','their','it','its',
  'this','that','these','those','what','which','who','whom',
  'and','but','or','nor','so','yet','both','either','neither',
  'not','no','nor','only','own','same','than','too','very',
  'just','because','as','until','while','of','at','by','for',
  'with','about','against','between','into','through','during',
  'before','after','above','below','to','from','up','down','in',
  'out','on','off','over','under','again','further','then',
  'how','when','where','why','please','tell','me','give','explain',
  'mujhe','batao','kya','hai','hain','kaise','karo','kare','aur',
  'ko','ka','ki','ke','se','main','mera','meri','mere','aap','apna',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Tokenize a query into meaningful keywords
// ─────────────────────────────────────────────────────────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s-]/g, ' ')  // keep Hindi chars too
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

// ─────────────────────────────────────────────────────────────────────────────
// Score a knowledge chunk against query tokens
// ─────────────────────────────────────────────────────────────────────────────
function scoreChunk(chunk, queryTokens) {
  let score = 0;

  for (const token of queryTokens) {
    // Exact tag match: high weight
    if (chunk.tags.some(tag => tag === token || tag.includes(token) || token.includes(tag))) {
      score += 3;
    }
    // Content match: medium weight
    if (chunk.content.toLowerCase().includes(token)) {
      score += 1;
    }
  }

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main RAG retrieval function
// Returns top-k relevant chunks with source info
// ─────────────────────────────────────────────────────────────────────────────
const ragService = {

  /**
   * Retrieve relevant knowledge for a query from a specific agent's knowledge base.
   * @param {string} query    - The user's message
   * @param {string} persona  - 'amma' | 'student' | 'business' | 'senior'
   * @param {number} topK     - Number of chunks to return (default: 3)
   * @returns {{ chunks: Array, context: string, sources: Array }}
   */
  retrieve(query, persona, topK = 3) {
    const kb = KNOWLEDGE_BASES[persona];
    if (!kb || !query?.trim()) {
      return { chunks: [], context: '', sources: [] };
    }

    const queryTokens = tokenize(query);

    if (queryTokens.length === 0) {
      return { chunks: [], context: '', sources: [] };
    }

    // Score all chunks
    const scored = kb.map(chunk => ({
      ...chunk,
      score: scoreChunk(chunk, queryTokens),
    }));

    // Sort by score descending, take topK with score > 0
    const topChunks = scored
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (topChunks.length === 0) {
      return { chunks: [], context: '', sources: [] };
    }

    // Build context string to inject into prompt
    const context = topChunks
      .map((c, i) => `[Source ${i + 1}]: ${c.content}`)
      .join('\n\n');

    // Build sources array for UI display
    const sources = topChunks.map(c => ({
      id: c.id,
      label: extractLabel(c),
      score: c.score,
    }));

    return { chunks: topChunks, context, sources };
  },

  /**
   * Build the RAG-augmented prompt prefix to inject before the user query.
   * @param {string} context  - Retrieved context string
   * @returns {string}
   */
  buildContextPrompt(context) {
    if (!context) return '';
    return `\n\n--- RELEVANT KNOWLEDGE BASE CONTEXT ---\nUse the following verified information to answer accurately:\n\n${context}\n\n--- END OF CONTEXT ---\n\nNow answer the user's question using the above context where relevant. If the context is not relevant to the question, use your general knowledge.\n`;
  },

  /**
   * Get a summary description of retrieved sources for UI display.
   */
  getSourceLabels(sources) {
    return sources.map(s => s.label);
  },

  /**
   * Check if RAG found relevant content for this query.
   */
  hasRelevantContext(sources) {
    return sources.length > 0;
  },
};

// ─── Helper: extract human-readable label from chunk ID ─────────────────────
function extractLabel(chunk) {
  const labelMap = {
    // Amma
    amma_001: 'PM-Kisan Scheme',
    amma_002: 'PM Ujjwala Yojana',
    amma_003: 'Ayushman Bharat',
    amma_004: 'MGNREGA Employment',
    amma_005: 'Maternity Benefits',
    amma_006: 'PM Awas Yojana',
    amma_007: 'Sukanya Samriddhi',
    amma_008: 'UPI Guide',
    amma_009: 'Banking Guide',
    amma_010: 'Jan Dhan Account',
    amma_011: 'Smartphone Basics',
    amma_012: 'Aadhaar Guide',
    amma_013: 'Ration Card',
    amma_014: 'Scam Protection',
    amma_015: 'Cyber Crime Helpline',
    amma_016: 'Women Health Tips',
    amma_017: 'Grocery Budget Tips',
    amma_018: 'Self Help Groups',
    amma_019: 'Quick Recipes',
    amma_020: 'Online Form Filling',
    // Student
    stu_001: 'Software Dev Career',
    stu_002: 'Data Science & AI',
    stu_003: 'UPSC Guide',
    stu_004: 'CA Career Path',
    stu_005: 'NEET Preparation',
    stu_006: 'NSP Scholarships',
    stu_007: 'Private Scholarships',
    stu_008: 'Internship Guide',
    stu_009: 'Resume Building',
    stu_010: 'Study Techniques',
    stu_011: 'Board Exams',
    stu_012: 'JEE Preparation',
    stu_013: 'Hackathons',
    stu_014: 'Free Certifications',
    stu_015: 'Mental Health',
    stu_016: 'Gap Year Advice',
    stu_017: 'LinkedIn Guide',
    // Business
    biz_001: 'GST Registration',
    biz_002: 'GST Filing',
    biz_003: 'Input Tax Credit',
    biz_004: 'Business Loans',
    biz_005: 'Business Structure',
    biz_006: 'Digital Marketing',
    biz_007: 'Invoice & Billing',
    biz_008: 'Pricing Strategy',
    biz_009: 'Customer Retention',
    biz_010: 'Inventory Management',
    biz_011: 'Udyam Registration',
    biz_012: 'Export Business',
    biz_013: 'E-commerce Guide',
    biz_014: 'Cash Flow',
    biz_015: 'Growth Strategy',
    // Senior
    sen_001: 'EPF Pension',
    sen_002: 'Old Age Pension',
    sen_003: 'SCSS Investment',
    sen_004: 'Ayushman 70+',
    sen_005: 'Travel Concessions',
    sen_006: 'Senior Health Guide',
    sen_007: 'Medical Emergency',
    sen_008: 'Exercise & Wellness',
    sen_009: 'Scam Protection',
    sen_010: 'Smartphone Guide',
    sen_011: 'Social Connection',
    sen_012: 'Legal Rights',
    sen_013: 'Important Documents',
    sen_014: 'Income Tax Guide',
  };

  return labelMap[chunk.id] || chunk.id;
}

export default ragService;
