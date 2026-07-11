import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToast }    from '../../hooks/useToast';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth }     from '../../contexts/AuthContext';
import VoiceButton     from './VoiceButton';
import voiceService    from '../../services/voice';
import agentRouter     from '../../services/agentRouter';
import memoryService   from '../../services/memory';

// ── Per-agent greetings ──────────────────────────────────────────────────────
const GREETINGS = {
  en: {
    amma:     '🙏 Namaste! I am your Amma Saarthi. Ask me about government schemes, UPI, recipes, or scam protection — I am here to help!',
    student:  '📚 Hey! I\'m your Student Saarthi. Ask me about career paths, scholarships, study tips, internships, or exams — let\'s crush it together!',
    senior:   '🙏 Namaste ji! I am your Senior Saarthi. I am here to help you with pension, health, safety from scams, and smartphone help. Please tell me slowly what you need.',
    business: '💼 Good day! I\'m your Business Saarthi. Ask me about GST, business loans, marketing, customers, or growth strategies — let\'s build your business!',
  },
  hi: {
    amma:     '🙏 नमस्ते! मैं आपकी Amma Saarthi हूं। सरकारी योजनाएं, UPI, recipes, या scam protection — किसी भी चीज़ में मदद के लिए यहां हूं!',
    student:  '📚 नमस्ते! मैं आपका Student Saarthi हूं। Career, scholarship, study tips, internship, या exams — सब में मदद करूंगा!',
    senior:   '🙏 नमस्ते जी! मैं आपका Senior Saarthi हूं। Pension, health, scam से सुरक्षा, और smartphone help — धीरे-धीरे बताइए, मैं यहां हूं।',
    business: '💼 नमस्ते! मैं आपका Business Saarthi हूं। GST, loan, marketing, customers — business grow करने में मदद के लिए तैयार हूं!',
  },
  ta: {
    amma:     '🙏 வணக்கம்! நான் உங்கள் அம்மா சாரதி. அரசு திட்டங்கள், UPI, சமையல் குறிப்புகள் — எதையும் கேட்கலாம்!',
    student:  '📚 வணக்கம்! நான் உங்கள் மாணவர் சாரதி. Career, scholarship, படிப்பு tips — எல்லாவற்றிலும் உதவுவேன்!',
    senior:   '🙏 வணக்கம் ஐயா/அம்மா! நான் உங்கள் சாரதி. மெதுவாக சொல்லுங்கள், நான் கேட்கிறேன்.',
    business: '💼 வணக்கம்! நான் உங்கள் வணிக சாரதி. GST, கடன், marketing — வணிகம் வளர உதவுவேன்!',
  },
  te: {
    amma:     '🙏 నమస్తే! నేను మీ అమ్మ సారథిని. ప్రభుత్వ పథకాలు, UPI, వంటలు — ఏదైనా అడగండి!',
    student:  '📚 నమస్తే! నేను మీ విద్యార్థి సారథిని. Career, scholarship, చదువు tips — అన్నింటిలో సహాయం చేస్తాను!',
    senior:   '🙏 నమస్తే! నేను మీ సీనియర్ సారథిని. మెల్లగా చెప్పండి, నేను వింటున్నాను.',
    business: '💼 నమస్తే! నేను మీ వ్యాపార సారథిని. GST, రుణాలు, marketing — వ్యాపారం పెంచడానికి సహాయం చేస్తాను!',
  },
};

// ── Persona accent colors ────────────────────────────────────────────────────
const PERSONA_COLORS = {
  amma:     '#D4547A',
  student:  '#6C63FF',
  business: '#1B365D',
  senior:   '#0EA5E9',
};

const AI_TYPE_OPTIONS = {
  amma:     ['Family Assistant', 'Recipe Helper', 'Scheme Guide'],
  student:  ['Student Mentor', 'Exam Coach', 'Career Planner'],
  business: ['Business Advisor', 'GST Specialist', 'Marketing Strategist'],
  senior:   ['Senior Guide', 'Health Helper', 'Scam Protector'],
};

// ── Simple markdown parser ───────────────────────────────────────────────────
function parseMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/^### (.*$)/gim,  '<strong style="font-size:14px">$1</strong>')
    .replace(/^## (.*$)/gim,   '<strong style="font-size:15px">$1</strong>')
    .replace(/^# (.*$)/gim,    '<strong style="font-size:16px">$1</strong>')
    .replace(/\n/g,            '<br/>')
    .replace(/<br\/>• /g,      '<br/>• ')
    .replace(/<br\/>- /g,      '<br/>• ')
    .replace(/<br\/>\* /g,     '<br/>• ');
}

// ─────────────────────────────────────────────────────────────────────────────
// AIChat Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AIChat({ persona, placeholder, suggestedPrompts = [], aiType = null }) {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [selectedAiType, setSelectedAiType] = useState(aiType || AI_TYPE_OPTIONS[persona]?.[0] || 'Assistant');
  const [loading, setLoading]       = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [memoryStats, setMemoryStats] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const { showToast } = useToast();
  const { language }  = useLanguage();
  const { user }      = useAuth();

  const accentColor = PERSONA_COLORS[persona] || '#FF9933';
  const userId = user?.id || user?.uid || user?.email || null;

  useEffect(() => {
    setSelectedAiType(aiType || AI_TYPE_OPTIONS[persona]?.[0] || 'Assistant');
  }, [persona, aiType]);

  // ── Welcome message ──────────────────────────────────────────────────────
  useEffect(() => {
    const langGreetings = GREETINGS[language] || GREETINGS.en;
    const greeting = langGreetings[persona] || langGreetings.amma;
    setMessages([{
      id: 1,
      role: 'assistant',
      text: greeting,
      time: new Date(),
      sources: [],
      isGreeting: true,
    }]);
  }, [persona, language]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Load memory stats ────────────────────────────────────────────────────
  useEffect(() => {
    if (userId && showMemory) {
      setMemoryStats(memoryService.getStats(userId, persona));
    }
  }, [userId, persona, showMemory, messages]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || loading) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      time: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history from messages (exclude greeting)
      const history = messages
        .filter(m => !m.isGreeting)
        .map(m => ({ role: m.role, text: m.text }));

      // Route through agent router (RAG + Memory + True Agent Prompt)
      const result = await agentRouter.route(
        trimmed,
        persona,
        history,
        language,
        userId,
        selectedAiType
      );

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: result.response,
        time: new Date(),
        sources: result.sources || [],
        usedRAG: result.usedRAG,
        usedMemory: result.usedMemory,
        agentName: result.agentName,
        toolsUsed: result.toolsUsed || [],
      };

      setMessages(prev => [...prev, assistantMsg]);

      // TTS
      if (ttsEnabled && result.response) {
        voiceService.speak(result.response, language, persona);
      }

    } catch (err) {
      console.error('Chat error:', err);
      showToast('Could not get a response. Please try again.', 'error');

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I apologize, something went wrong. Please try again.',
        time: new Date(),
        sources: [],
        isError: true,
      }]);
    } finally {
      setLoading(false);
      // Re-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, loading, persona, language, userId, ttsEnabled, showToast]);

  // ── Handle Enter key ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  // ── Clear chat ───────────────────────────────────────────────────────────
  const clearChat = useCallback(() => {
    const langGreetings = GREETINGS[language] || GREETINGS.en;
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      text: langGreetings[persona] || langGreetings.amma,
      time: new Date(),
      sources: [],
      isGreeting: true,
    }]);
    if (userId) memoryService.clearHistory(userId, persona);
    showToast('Chat cleared', 'info');
  }, [persona, language, userId, showToast]);

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-4px); }
        }
        .td { width:7px;height:7px;background:var(--gray-400);border-radius:50%;
              display:inline-block;animation:bounce 1.4s infinite ease-in-out both; }
        .td:nth-child(1){animation-delay:-0.32s}
        .td:nth-child(2){animation-delay:-0.16s}
        .td:nth-child(3){animation-delay:0s}
        .src-badge { display:inline-flex;align-items:center;gap:4px;
          padding:3px 8px;border-radius:99px;font-size:11px;font-weight:600;
          background:rgba(0,0,0,0.06);color:var(--gray-600);margin:2px; }
        .src-badge:hover { background:rgba(0,0,0,0.1); }
        .msg-bubble-user { animation: slideInRight 0.2s ease-out; }
        .msg-bubble-ai   { animation: slideInLeft  0.2s ease-out; }
        @keyframes slideInRight{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInLeft {from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
      `}</style>

      {/* ── Toolbar ── */}
      <div style={styles.toolbar}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          {/* Agent badge */}
          <div style={{ ...styles.agentBadge, background: accentColor + '18', color: accentColor, border:`1px solid ${accentColor}30` }}>
            {agentRouter.getAgent(persona).emoji} {agentRouter.getAgent(persona).name}
          </div>
          {selectedAiType && (
            <div style={{ ...styles.aiTypeBadge, border:`1px solid ${accentColor}30` }}>
              ⚡ {selectedAiType}
            </div>
          )}
          {/* Memory indicator */}
          {userId && (
            <button
              style={{ ...styles.toolbarBtn, color: showMemory ? accentColor : 'var(--gray-400)' }}
              onClick={() => setShowMemory(!showMemory)}
              title="View memory"
            >
              🧠
            </button>
          )}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <button
            style={{ ...styles.toolbarBtn, color: ttsEnabled ? accentColor : 'var(--gray-400)' }}
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? 'Voice On' : 'Voice Off'}
          >
            {ttsEnabled ? '🔊' : '🔇'}
          </button>
          <button
            style={{ ...styles.toolbarBtn, color:'var(--gray-400)' }}
            onClick={clearChat}
            title="Clear chat"
          >
            🗑️
          </button>
        </div>
      </div>

      {AI_TYPE_OPTIONS[persona]?.length > 1 && (
        <div style={styles.typeSelectorRow}>
          <span style={styles.typeSelectorLabel}>Choose AI focus:</span>
          {AI_TYPE_OPTIONS[persona].map((type) => (
            <button
              key={type}
              style={{
                ...styles.typeChip,
                borderColor: selectedAiType === type ? accentColor : 'var(--gray-200)',
                background: selectedAiType === type ? accentColor + '15' : '#fff',
                color: selectedAiType === type ? accentColor : 'var(--gray-700)',
              }}
              onClick={() => setSelectedAiType(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* ── Memory Panel (collapsible) ── */}
      {showMemory && memoryStats && (
        <div style={styles.memoryPanel}>
          <div style={styles.memoryTitle}>🧠 Agent Memory ({memoryStats.messageCount} messages, {memoryStats.factCount} facts)</div>
          {Object.entries(memoryStats.facts).map(([k, v]) => (
            <div key={k} style={styles.memoryFact}>
              <span style={styles.memoryKey}>{k}:</span>
              <span style={styles.memoryVal}>{String(v.value)}</span>
            </div>
          ))}
          {memoryStats.factCount === 0 && (
            <div style={{ fontSize:12, color:'var(--gray-400)' }}>No facts saved yet — chat more to build memory!</div>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div style={styles.messages} aria-live="polite" aria-label="Chat messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={msg.role === 'user' ? 'msg-bubble-user' : 'msg-bubble-ai'}
            style={{ ...styles.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            {msg.role === 'assistant' && (
              <div style={{ ...styles.avatar, background: accentColor + '18', color: accentColor }}>
                {agentRouter.getAgent(persona).emoji}
              </div>
            )}
            <div style={{
              ...styles.bubble,
              ...(msg.role === 'user'
                ? { ...styles.userBubble, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }
                : styles.aiBubble),
              ...(msg.isError ? { borderColor:'var(--danger)', background:'#FEF2F2' } : {}),
            }}>
              {/* Message text */}
              {msg.role === 'user' ? (
                <p style={styles.bubbleText}>{msg.text}</p>
              ) : (
                <p
                  style={styles.bubbleText}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
              )}

              {/* RAG Sources */}
              {msg.sources?.length > 0 && (
                <div style={styles.sourcesRow}>
                  <span style={styles.sourcesLabel}>📚 Sources:</span>
                  {msg.sources.map((src, i) => (
                    <span key={i} className="src-badge">{src.label}</span>
                  ))}
                </div>
              )}

              {/* Metadata badges */}
              <div style={styles.msgMeta}>
                <span style={styles.msgTime}>
                  {msg.time.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                </span>
                {msg.usedRAG && (
                  <span style={{ ...styles.metaBadge, color:'#10B981' }}>⚡ RAG</span>
                )}
                {msg.usedMemory && (
                  <span style={{ ...styles.metaBadge, color:'#6C63FF' }}>🧠 Memory</span>
                )}
                {msg.toolsUsed?.length > 0 && msg.toolsUsed.map(tool => (
                  <span key={tool} style={{ ...styles.metaBadge, color:'#F59E0B' }}>{tool.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent:'flex-start' }}>
            <div style={{ ...styles.avatar, background: accentColor + '18', color: accentColor }}>
              {agentRouter.getAgent(persona).emoji}
            </div>
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              <div style={{ display:'flex', gap:4, alignItems:'center', height:20 }}>
                <span className="td" /><span className="td" /><span className="td" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggested prompts (only when chat is fresh) ── */}
      {suggestedPrompts.length > 0 && messages.length <= 1 && (
        <div style={styles.suggestions}>
          {suggestedPrompts.slice(0, 4).map(p => (
            <button
              key={p}
              style={{ ...styles.suggestionChip, borderColor: accentColor + '30', color: accentColor }}
              onClick={() => sendMessage(p)}
              disabled={loading}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Input area ── */}
      <div style={styles.inputArea}>
        <VoiceButton
          size={44}
          persona={persona}
          onTranscript={text => {
            setInput(text);
            // Auto-send after voice input (small delay for UX)
            setTimeout(() => sendMessage(text), 300);
          }}
        />
        <input
          ref={inputRef}
          style={{ ...styles.chatInput, '--focus-color': accentColor }}
          className="saarthi-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder || 'Type or speak your message…'}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="Chat message input"
        />
        <button
          style={{
            ...styles.sendBtn,
            background: input.trim() && !loading
              ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
              : 'var(--gray-200)',
            color: input.trim() && !loading ? '#fff' : 'var(--gray-400)',
          }}
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '72vh',
    minHeight: 420,
    maxHeight: 720,
    background: '#fff',
    borderRadius: 'var(--r-xl)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--gray-100)',
    overflow: 'hidden',
  },

  // Toolbar
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderBottom: '1px solid var(--gray-100)',
    background: 'var(--gray-50)',
    flexShrink: 0,
  },
  agentBadge: {
    padding: '4px 10px',
    borderRadius: 'var(--r-full)',
    fontSize: 12,
    fontWeight: 700,
  },
  toolbarBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: '4px 6px',
    borderRadius: 6,
    transition: 'background 0.15s',
  },

  // Memory panel
  memoryPanel: {
    padding: '10px 14px',
    background: '#F5F3FF',
    borderBottom: '1px solid #EDE9FE',
    flexShrink: 0,
    maxHeight: 120,
    overflowY: 'auto',
  },
  memoryTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#6C63FF',
    marginBottom: 6,
  },
  memoryFact: {
    display: 'flex',
    gap: 8,
    fontSize: 11.5,
    marginBottom: 3,
  },
  memoryKey: { fontWeight: 700, color: '#4F46E5', minWidth: 120 },
  memoryVal: { color: 'var(--gray-600)' },

  // Messages
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 14px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    scrollBehavior: 'smooth',
  },
  msgRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 'var(--r-xl)',
    padding: '10px 14px',
  },
  userBubble: {
    color: '#fff',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    background: 'var(--gray-50)',
    color: 'var(--gray-800)',
    border: '1px solid var(--gray-200)',
    borderBottomLeftRadius: 4,
  },
  typeSelectorRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid var(--gray-100)',
    background: '#fff',
  },
  typeSelectorLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--gray-500)',
  },
  typeChip: {
    border: '1.5px solid var(--gray-200)',
    borderRadius: '999px',
    padding: '6px 12px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.15s ease',
  },
  bubbleText: {
    fontSize: 13.5,
    lineHeight: 1.65,
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },

  // Sources
  sourcesRow: {
    marginTop: 8,
    paddingTop: 6,
    borderTop: '1px solid var(--gray-200)',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  sourcesLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--gray-400)',
    textTransform: 'uppercase',
    marginRight: 2,
  },

  // Metadata
  msgMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  msgTime: {
    fontSize: 10,
    opacity: 0.5,
  },
  metaBadge: {
    fontSize: 10,
    fontWeight: 700,
    opacity: 0.8,
    padding: '2px 6px',
    borderRadius: 999,
    background: 'rgba(0,0,0,0.05)',
  },
  aiTypeBadge: {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
  },

  // Suggestions
  suggestions: {
    display: 'flex',
    gap: 6,
    padding: '8px 14px',
    overflowX: 'auto',
    borderTop: '1px solid var(--gray-100)',
    background: 'var(--gray-50)',
    flexShrink: 0,
    scrollbarWidth: 'none',
  },
  suggestionChip: {
    background: '#fff',
    border: '1.5px solid',
    borderRadius: 'var(--r-full)',
    padding: '5px 12px',
    fontSize: 12,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'var(--t-fast)',
    flexShrink: 0,
  },

  // Input
  inputArea: {
    display: 'flex',
    gap: 8,
    padding: '10px 12px',
    borderTop: '1px solid var(--gray-100)',
    background: '#fff',
    alignItems: 'center',
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    borderRadius: 'var(--r-md)',
    padding: '10px 14px',
    fontSize: 13.5,
    border: '2px solid var(--gray-200)',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  sendBtn: {
    width: 44, height: 44,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
};
