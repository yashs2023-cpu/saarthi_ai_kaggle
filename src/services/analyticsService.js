// Analytics Service - tracks agent usage, query categories, and user activity
const ANALYTICS_KEY = 'saarthi_analytics';
const MAX_EVENTS = 500;

const analyticsService = {
  /**
   * Track a user event
   * @param {string} userId  - User ID or 'guest'
   * @param {string} event   - Event name e.g. 'agent_selected', 'message_sent', 'scam_checked'
   * @param {object} data    - Additional event data
   */
  trackEvent(userId, event, data = {}) {
    try {
      const logs = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
      logs.push({
        userId: userId || 'guest',
        event,
        data,
        timestamp: new Date().toISOString(),
      });
      // Keep last MAX_EVENTS events
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(logs.slice(-MAX_EVENTS)));
    } catch (e) {
      console.error('Analytics track failed:', e);
    }
  },

  /**
   * Get aggregated stats for a user
   * @param {string} userId
   * @returns {object} stats object
   */
  getStats(userId) {
    try {
      const logs = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
      const userLogs = (userId ? logs.filter(l => l.userId === userId) : logs);

      const agentUsage = {};
      const queryCategories = {};

      userLogs.forEach(log => {
        if (log.event === 'agent_selected') {
          const agent = log.data?.agent;
          if (agent) agentUsage[agent] = (agentUsage[agent] || 0) + 1;
        }
        if (log.event === 'message_sent') {
          const agent = log.data?.agent;
          if (agent) queryCategories[agent] = (queryCategories[agent] || 0) + 1;
        }
      });

      const scamChecks = userLogs.filter(l => l.event === 'scam_checked').length;
      const messagesTotal = userLogs.filter(l => l.event === 'message_sent').length;
      const mostUsedAgentEntry = Object.entries(agentUsage).sort((a, b) => b[1] - a[1])[0];

      return {
        totalConversations: messagesTotal,
        agentUsage,
        queryCategories,
        scamChecks,
        mostUsedAgent: mostUsedAgentEntry?.[0] || null,
        lastActive: userLogs[userLogs.length - 1]?.timestamp || null,
      };
    } catch (e) {
      console.error('Analytics getStats failed:', e);
      return {
        totalConversations: 0,
        agentUsage: {},
        queryCategories: {},
        scamChecks: 0,
        mostUsedAgent: null,
        lastActive: null,
      };
    }
  },

  /**
   * Get all events for admin/debug
   */
  getAllEvents() {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Clear all analytics data
   */
  clearAll() {
    try {
      localStorage.removeItem(ANALYTICS_KEY);
    } catch {
      // ignore
    }
  },
};

export default analyticsService;
