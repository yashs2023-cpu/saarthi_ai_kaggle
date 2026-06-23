// ─── Agent Memory Service ─────────────────────────────────────────────────────
// Per-agent short-term and long-term memory using localStorage.
// Each agent has its own memory namespace so they never mix.

const MEMORY_VERSION = 'v1';
const MAX_SHORT_TERM = 20;   // Last 20 messages per agent
const MAX_LONG_TERM  = 50;   // Last 50 facts per agent

// ── Keys ────────────────────────────────────────────────────────────────────
const key = (userId, persona, type) =>
  `saarthi_memory_${MEMORY_VERSION}_${userId}_${persona}_${type}`;

// ─────────────────────────────────────────────────────────────────────────────
const memoryService = {

  // ── SHORT-TERM MEMORY (conversation history) ────────────────────────────

  /**
   * Save a message to short-term memory for an agent.
   * @param {string} userId
   * @param {string} persona  - 'amma' | 'student' | 'business' | 'senior'
   * @param {{ role: string, text: string, time: string }} message
   */
  saveMessage(userId, persona, message) {
    if (!userId || !persona) return;
    try {
      const k = key(userId, persona, 'short');
      const history = this.getHistory(userId, persona);
      history.push({ ...message, savedAt: new Date().toISOString() });

      // Keep only last N messages
      const trimmed = history.slice(-MAX_SHORT_TERM);
      localStorage.setItem(k, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Memory save failed:', e);
    }
  },

  /**
   * Get conversation history for an agent.
   * @returns {Array<{ role: string, text: string, time: string }>}
   */
  getHistory(userId, persona) {
    if (!userId || !persona) return [];
    try {
      const k = key(userId, persona, 'short');
      const stored = localStorage.getItem(k);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clear short-term memory for an agent (e.g. on logout or persona switch).
   */
  clearHistory(userId, persona) {
    if (!userId || !persona) return;
    try {
      localStorage.removeItem(key(userId, persona, 'short'));
    } catch {}
  },

  // ── LONG-TERM MEMORY (user profile & preferences per agent) ─────────────

  /**
   * Update long-term memory with a key-value fact.
   * @param {string} userId
   * @param {string} persona
   * @param {string} factKey   - e.g. 'goal', 'course', 'business_type'
   * @param {any}    value
   */
  saveFact(userId, persona, factKey, value) {
    if (!userId || !persona || !factKey) return;
    try {
      const profile = this.getProfile(userId, persona);
      profile[factKey] = { value, savedAt: new Date().toISOString() };
      localStorage.setItem(
        key(userId, persona, 'long'),
        JSON.stringify(profile)
      );
    } catch (e) {
      console.warn('Fact save failed:', e);
    }
  },

  /**
   * Get long-term memory profile for an agent.
   * @returns {Object} key → { value, savedAt }
   */
  getProfile(userId, persona) {
    if (!userId || !persona) return {};
    try {
      const stored = localStorage.getItem(key(userId, persona, 'long'));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  /**
   * Get a specific fact value.
   */
  getFact(userId, persona, factKey) {
    const profile = this.getProfile(userId, persona);
    return profile[factKey]?.value ?? null;
  },

  // ── CONTEXT BUILDER ────────────────────────────────────────────────────

  /**
   * Build a memory context string to inject into the agent prompt.
   * Includes user profile facts and recent conversation summary.
   */
  buildMemoryContext(userId, persona) {
    const profile = this.getProfile(userId, persona);
    const history = this.getHistory(userId, persona);

    const parts = [];

    // Profile facts
    const facts = Object.entries(profile);
    if (facts.length > 0) {
      const factLines = facts
        .map(([k, v]) => `• ${k}: ${v.value}`)
        .join('\n');
      parts.push(`USER PROFILE (remembered from past sessions):\n${factLines}`);
    }

    // Recent conversation summary (last 6 exchanges)
    if (history.length > 0) {
      const recent = history.slice(-6);
      const convLines = recent
        .map(m => `${m.role === 'user' ? 'User' : 'Agent'}: ${m.text.slice(0, 120)}${m.text.length > 120 ? '…' : ''}`)
        .join('\n');
      parts.push(`RECENT CONVERSATION CONTEXT:\n${convLines}`);
    }

    return parts.length > 0
      ? `\n--- MEMORY CONTEXT ---\n${parts.join('\n\n')}\n--- END MEMORY ---\n`
      : '';
  },

  // ── AUTO-EXTRACT FACTS FROM CONVERSATION ────────────────────────────────

  /**
   * Auto-extract interesting facts from user messages and save them.
   * Simple keyword-based extraction — no LLM needed.
   */
  autoExtractFacts(userId, persona, userMessage) {
    if (!userId || !persona || !userMessage) return;

    const msg = userMessage.toLowerCase();

    // Student agent facts
    if (persona === 'student') {
      if (msg.includes('bca') || msg.includes('b.ca')) {
        this.saveFact(userId, persona, 'course', 'BCA');
      } else if (msg.includes('btech') || msg.includes('b.tech') || msg.includes('engineering')) {
        this.saveFact(userId, persona, 'course', 'B.Tech Engineering');
      } else if (msg.includes('class 12') || msg.includes('12th') || msg.includes('hsc')) {
        this.saveFact(userId, persona, 'course', 'Class 12');
      } else if (msg.includes('class 10') || msg.includes('10th') || msg.includes('ssc')) {
        this.saveFact(userId, persona, 'course', 'Class 10');
      }

      if (msg.includes('ai') || msg.includes('artificial intelligence') || msg.includes('machine learning')) {
        this.saveFact(userId, persona, 'interest', 'Artificial Intelligence / ML');
      } else if (msg.includes('web') || msg.includes('frontend') || msg.includes('react')) {
        this.saveFact(userId, persona, 'interest', 'Web Development');
      } else if (msg.includes('upsc') || msg.includes('ias') || msg.includes('civil')) {
        this.saveFact(userId, persona, 'goal', 'UPSC Civil Services');
      } else if (msg.includes('data science') || msg.includes('data analyst')) {
        this.saveFact(userId, persona, 'interest', 'Data Science');
      }
    }

    // Business agent facts
    if (persona === 'business') {
      if (msg.includes('restaurant') || msg.includes('food') || msg.includes('dabba')) {
        this.saveFact(userId, persona, 'business_type', 'Food / Restaurant');
      } else if (msg.includes('retail') || msg.includes('shop') || msg.includes('store')) {
        this.saveFact(userId, persona, 'business_type', 'Retail Shop');
      } else if (msg.includes('manufacturing') || msg.includes('factory') || msg.includes('production')) {
        this.saveFact(userId, persona, 'business_type', 'Manufacturing');
      } else if (msg.includes('service') || msg.includes('consulting') || msg.includes('freelance')) {
        this.saveFact(userId, persona, 'business_type', 'Service Business');
      } else if (msg.includes('ecommerce') || msg.includes('online') || msg.includes('amazon')) {
        this.saveFact(userId, persona, 'business_type', 'E-commerce');
      }

      const revenueMatch = msg.match(/(\d+)\s*(lakh|cr|crore|k|thousand)/i);
      if (revenueMatch) {
        this.saveFact(userId, persona, 'monthly_revenue_mentioned', revenueMatch[0]);
      }
    }

    // Amma agent facts
    if (persona === 'amma') {
      if (msg.includes('family') || msg.includes('husband') || msg.includes('children')) {
        this.saveFact(userId, persona, 'context', 'Family-focused homemaker');
      }
      if (msg.includes('bpl') || msg.includes('below poverty')) {
        this.saveFact(userId, persona, 'economic_category', 'BPL');
      }
      if (msg.includes('farmer') || msg.includes('kheti') || msg.includes('agriculture')) {
        this.saveFact(userId, persona, 'occupation', 'Farmer household');
      }
    }

    // Senior agent facts
    if (persona === 'senior') {
      if (msg.includes('diabetes') || msg.includes('sugar')) {
        this.saveFact(userId, persona, 'health_condition', 'Diabetes');
      }
      if (msg.includes('blood pressure') || msg.includes('bp')) {
        this.saveFact(userId, persona, 'health_condition', 'Blood Pressure');
      }
      if (msg.includes('pension') || msg.includes('retired') || msg.includes('epf')) {
        this.saveFact(userId, persona, 'status', 'Retired / Pension recipient');
      }

      const ageMatch = msg.match(/(\d+)\s*year/i);
      if (ageMatch && parseInt(ageMatch[1]) >= 55 && parseInt(ageMatch[1]) <= 100) {
        this.saveFact(userId, persona, 'age', ageMatch[1] + ' years');
      }
    }
  },

  // ── UTILITY ─────────────────────────────────────────────────────────────

  /**
   * Clear all memory for a user (on logout).
   */
  clearAllMemory(userId) {
    if (!userId) return;
    ['amma', 'student', 'business', 'senior'].forEach(persona => {
      ['short', 'long'].forEach(type => {
        try {
          localStorage.removeItem(key(userId, persona, type));
        } catch {}
      });
    });
  },

  /**
   * Get memory stats for debugging/display.
   */
  getStats(userId, persona) {
    const history = this.getHistory(userId, persona);
    const profile = this.getProfile(userId, persona);
    return {
      messageCount: history.length,
      factCount: Object.keys(profile).length,
      facts: profile,
    };
  },
};

export default memoryService;
