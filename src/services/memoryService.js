// Memory Service - Stores and retrieves user memory for personalized AI responses
const MEMORY_KEY_PREFIX = 'saarthi_memory_';
const CONVERSATIONS_KEY = 'saarthi_conversations_';

const memoryService = {
  // Get user memory profile
  getMemory(userId) {
    try {
      const key = MEMORY_KEY_PREFIX + (userId || 'guest');
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      return this.getDefaultMemory();
    } catch {
      return this.getDefaultMemory();
    }
  },

  getDefaultMemory() {
    return {
      name: '',
      agentType: '',
      goals: [],
      interests: [],
      recentTopics: [],
      learningProgress: {},
      preferences: { language: 'en', fontSize: 'normal', voiceEnabled: false },
      conversationCount: 0,
      lastActive: null,
    };
  },

  // Save/update user memory
  saveMemory(userId, updates) {
    try {
      const existing = this.getMemory(userId);
      const updated = { ...existing, ...updates, lastActive: new Date().toISOString() };
      localStorage.setItem(MEMORY_KEY_PREFIX + (userId || 'guest'), JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Memory save failed:', e);
      return null;
    }
  },

  // Add a topic to recent topics (keeps last 10)
  addRecentTopic(userId, topic) {
    if (!topic || !topic.trim()) return;
    const memory = this.getMemory(userId);
    const trimmedTopic = topic.trim().slice(0, 60);
    const topics = [trimmedTopic, ...memory.recentTopics.filter(t => t !== trimmedTopic)].slice(0, 10);
    this.saveMemory(userId, { recentTopics: topics });
  },

  // Get conversation history for an agent
  getConversations(userId, agentType, limit = 20) {
    try {
      const key = CONVERSATIONS_KEY + (userId || 'guest') + '_' + agentType;
      const stored = localStorage.getItem(key);
      const all = stored ? JSON.parse(stored) : [];
      return all.slice(-limit);
    } catch {
      return [];
    }
  },

  // Save conversation message
  saveConversation(userId, agentType, role, text) {
    try {
      const key = CONVERSATIONS_KEY + (userId || 'guest') + '_' + agentType;
      const stored = localStorage.getItem(key);
      const all = stored ? JSON.parse(stored) : [];
      all.push({ role, text, timestamp: new Date().toISOString() });
      // Keep last 100 messages per agent
      const trimmed = all.slice(-100);
      localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Conversation save failed:', e);
    }
  },

  // Build memory context string for AI injection
  buildMemoryContext(userId, agentType) {
    const memory = this.getMemory(userId);

    let context = '';
    if (memory.name) context += `User's name: ${memory.name}\n`;
    if (memory.agentType) context += `Selected agent: ${memory.agentType}\n`;
    if (memory.goals?.length) context += `User goals: ${memory.goals.join(', ')}\n`;
    if (memory.interests?.length) context += `Interests: ${memory.interests.join(', ')}\n`;
    if (memory.recentTopics?.length) context += `Recent topics discussed: ${memory.recentTopics.slice(0, 5).join(', ')}\n`;
    if (memory.conversationCount) context += `Total conversations: ${memory.conversationCount}\n`;

    return context;
  },

  // Clear all memory for user
  clearMemory(userId) {
    try {
      localStorage.removeItem(MEMORY_KEY_PREFIX + (userId || 'guest'));
    } catch {
      // ignore
    }
  },

  // Clear conversation history for a specific agent
  clearConversations(userId, agentType) {
    try {
      const key = CONVERSATIONS_KEY + (userId || 'guest') + '_' + agentType;
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export default memoryService;
