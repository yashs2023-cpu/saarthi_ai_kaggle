import React, { useState, useEffect, useRef, useContext } from 'react';
import { useToast } from '../../../hooks/useToast';
import voiceService from '../../../services/voice';
import { LanguageContext } from '../../../contexts/LanguageContext';


export default function StudentStudy() {
  // ==================== POMODORO TIMER ====================
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work | break
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);
  const { showToast } = useToast();

  // ==================== NOTES GENERATOR ====================
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('Class 9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language } = useContext(LanguageContext);

  // ==================== POMODORO TIMER LOGIC ====================
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s === 0) {
            setMinutes(m => {
              if (m === 0) {
                clearInterval(intervalRef.current);
                setIsRunning(false);
                if (mode === 'work') {
                  setSessions(prev => prev + 1);
                  showToast('✅ Pomodoro complete! Take a 5-min break 🎉', 'success');
                  setMode('break');
                  return 5;
                } else {
                  showToast('⏰ Break over! Time to focus 📚', 'info');
                  setMode('work');
                  return 25;
                }
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, showToast]);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
  };

  // ==================== NOTES GENERATOR LOGIC ====================
  const handleGenerateNotes = async () => {
    // Validation
    if (!topic.trim()) {
      showToast('⚠️ Please enter a topic', 'error');
      return;
    }
    if (!subject.trim()) {
      showToast('⚠️ Please select a subject', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      showToast('🔄 Generating notes...', 'info');

      // Try to find notes in database first (fast)
      
      // If not in database, simulate API call to Gemini
      await generateNotesWithGemini(topic, subject, classLevel);
      
    } catch (error) {
      console.error('Error generating notes:', error);
      showToast('❌ Error: ' + error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  

  const generateNotesWithGemini = async (topic, subject, level) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock notes response
    const notes = {
      topic,
      subject,
      level: classLevel,
      title: `${topic} - Complete Study Guide`,
      overview: `${topic} is a fundamental concept in ${subject}. This comprehensive guide covers all essential aspects.`,
      keyPoints: [
        `Definition: ${topic} refers to...`,
        `Historical Context: First discovered in...`,
        `Core Concepts: Understanding the basic principles...`,
        `Real-world Applications: How it's used in practice...`,
        `Common Misconceptions: What students often get wrong...`
      ],
      summary: `${topic} is important because it forms the foundation for advanced topics in ${subject}.`,
      practiceQuestions: [
        `What is the main definition of ${topic}?`,
        `How does ${topic} relate to other concepts?`,
        `Can you explain ${topic} with a real-world example?`,
        `What are the limitations of ${topic}?`,
        `How would you apply ${topic} to solve a problem?`
      ],
      tips: [
        '💡 Focus on understanding concepts rather than memorizing',
        '📝 Take notes in your own words',
        '🔄 Practice similar problems multiple times',
        '💬 Discuss with peers to clarify doubts',
        '📚 Review notes regularly'
      ],
      estimatedReadTime: '15 minutes',
      difficulty: classLevel.includes('12') ? 'Hard' : classLevel.includes('11') ? 'Medium' : 'Easy'
    };

    showToast('✅ Notes generated!', 'success');
    setGeneratedNotes(notes);
  };

  const handleListenNotes = async () => {
    if (!generatedNotes) return;

    try {
      setIsSpeaking(true);
      showToast('🔊 Speaking notes...', 'info');

      const noteText = `
        ${generatedNotes.title}.
        
        Overview: ${generatedNotes.overview}
        
        Key Points:
        ${generatedNotes.keyPoints.map((point, i) => `${i + 1}. ${point}`).join(' ')}
        
        Summary: ${generatedNotes.summary}
        
        Difficulty Level: ${generatedNotes.difficulty}
        Estimated Reading Time: ${generatedNotes.estimatedReadTime}
      `;

      await voiceService.speak(noteText, language, 'student');
      showToast('✅ Notes narration complete!', 'success');
    } catch (error) {
      console.error('Speech error:', error);
      showToast('❌ Error: ' + error.message, 'error');
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleDownloadNotes = () => {
    if (!generatedNotes) return;

    const notesText = `
${generatedNotes.title}
Subject: ${generatedNotes.subject}
Class/Level: ${classLevel}

OVERVIEW:
${generatedNotes.overview}

KEY POINTS:
${generatedNotes.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

SUMMARY:
${generatedNotes.summary}

PRACTICE QUESTIONS:
${generatedNotes.practiceQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

STUDY TIPS:
${generatedNotes.tips.join('\n')}

Difficulty: ${generatedNotes.difficulty}
Reading Time: ${generatedNotes.estimatedReadTime}
    `.trim();

    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedNotes.topic}-notes.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('✅ Notes downloaded!', 'success');
  };

  // ==================== UI HELPERS ====================
  const pad = n => String(n).padStart(2, '0');
  const progress = mode === 'work'
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  const accentColor = mode === 'work' ? 'var(--student-primary)' : 'var(--success)';

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>
          {language === 'en' ? 'Study Planner 📚' : language === 'hi' ? 'अध्ययन योजना 📚' : 'ஆய்வு திட்டம் 📚'}
        </h1>
        <p style={styles.subtitle}>
          {language === 'en' ? 'Pomodoro timer + AI notes generator to maximize your focus' : language === 'hi' ? 'आपकी ध्यान केंद्रित करने को अधिकतम करने के लिए पोमोडोरो टाइमर + एआई नोट्स जनरेटर' : 'உங்கள் கவனத்தை அதிकபட்சம் செய்ய Pomodoro டைमர் + AI குறிப்புகள் ஜெனரேட்டர்'}
        </p>
      </div>

      {/* ==================== POMODORO TIMER ==================== */}
      <div className="saarthi-card" style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto', width: '100%' }}>
        <div style={styles.modeSwitch}>
          <button
            style={{ ...styles.modeBtn, background: mode === 'work' ? 'var(--student-primary)' : 'transparent', color: mode === 'work' ? '#fff' : 'var(--gray-500)' }}
            onClick={() => { resetTimer(); setMode('work'); }}
          >
            📖 {language === 'en' ? 'Focus' : language === 'hi' ? 'ध्यान' : 'கவனம்'}
          </button>
          <button
            style={{ ...styles.modeBtn, background: mode === 'break' ? 'var(--success)' : 'transparent', color: mode === 'break' ? '#fff' : 'var(--gray-500)' }}
            onClick={() => { setIsRunning(false); setMode('break'); setMinutes(5); setSeconds(0); }}
          >
            ☕ {language === 'en' ? 'Break' : language === 'hi' ? 'ब्रेक' : 'இடைவேளை'}
          </button>
        </div>

        {/* Circular progress */}
        <div style={styles.timerCircle}>
          <svg width="200" height="200" style={styles.timerSVG}>
            <circle cx="100" cy="100" r="88" stroke="var(--gray-100)" strokeWidth="10" fill="none" />
            <circle
              cx="100" cy="100" r="88"
              stroke={accentColor}
              strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={styles.timerInner}>
            <div style={{ ...styles.timerDisplay, color: accentColor }}>
              {pad(minutes)}:{pad(seconds)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>
              {mode === 'work' ? (language === 'en' ? 'Focus Time' : 'ध्यान समय') : (language === 'en' ? 'Break Time' : 'ब्रेक समय')}
            </div>
          </div>
        </div>

        <div style={styles.timerControls}>
          <button
            className="btn"
            style={{ flex: 1, background: accentColor, color: '#fff', borderRadius: 'var(--r-full)' }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={resetTimer}>
            🔄 Reset
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 12 }}>
          {language === 'en' ? 'Sessions completed today:' : 'आज सत्र पूर्ण:'} <strong style={{ color: 'var(--student-primary)' }}>{sessions}</strong>
        </p>
      </div>

      {/* ==================== NOTES GENERATOR ==================== */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>📝 {language === 'en' ? 'AI Notes Generator' : language === 'hi' ? 'एआई नोट्स जनरेटर' : 'AI குறிப்புகள் ஜெனரேட்டர்'}</h3>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
          {language === 'en' ? 'Enter a topic and get structured study notes instantly' : language === 'hi' ? 'एक विषय दर्ज करें और तुरंत संरचित अध्ययन नोट्स प्राप्त करें' : 'ஒரு தலைப்பை உள்ளிட்டு உடனே கட்டமைக்கப்பட்ட ஆய்வு குறிப்புகளைப் பெறுங்கள்'}
        </p>
        
        <div style={styles.form}>
          <div style={styles.twoCol}>
            <div style={styles.field}>
              <label style={styles.label}>{language === 'en' ? 'Topic / Chapter' : 'विषय / अध्याय'}</label>
              <input 
                className="saarthi-input" 
                placeholder={language === 'en' ? 'e.g., Photosynthesis' : 'उदा. फोटोसिंथेसिस'}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{language === 'en' ? 'Subject' : 'विषय'}</label>
              <input 
                className="saarthi-input" 
                placeholder={language === 'en' ? 'e.g., Biology' : 'उदा. जीव विज्ञान'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>{language === 'en' ? 'Class / Level' : 'कक्षा / स्तर'}</label>
            <select 
              className="saarthi-input"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              disabled={isGenerating}
            >
              {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'Competitive Exam'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ 
              alignSelf: 'flex-start',
              opacity: isGenerating ? 0.6 : 1,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
            onClick={handleGenerateNotes}
            disabled={isGenerating}
          >
            🤖 {isGenerating ? '⏳ Generating...' : language === 'en' ? 'Generate Notes' : 'नोट्स बनाएं'}
          </button>
        </div>

        {/* Generated Notes Display */}
        {generatedNotes && (
          <div style={styles.notesResult}>
            <div style={styles.notesHeader}>
              <h4 style={styles.notesTitle}>{generatedNotes.title}</h4>
              <div style={styles.notesMetadata}>
                <span style={styles.badge}>⏱️ {generatedNotes.estimatedReadTime}</span>
                <span style={styles.badge}>
                  {generatedNotes.difficulty === 'Easy' ? '🟢' : generatedNotes.difficulty === 'Medium' ? '🟡' : '🔴'} {generatedNotes.difficulty}
                </span>
              </div>
            </div>

            <div style={styles.notesOverview}>
              <p><strong>{language === 'en' ? 'Overview:' : 'अवलोकन:'}</strong> {generatedNotes.overview}</p>
            </div>

            <div style={styles.notesSection}>
              <h5 style={styles.sectionTitle}>🔑 {language === 'en' ? 'Key Points' : 'मुख्य बिंदु'}</h5>
              <ul style={styles.pointsList}>
                {generatedNotes.keyPoints.map((point, i) => (
                  <li key={i} style={styles.listItem}>{point}</li>
                ))}
              </ul>
            </div>

            <div style={styles.notesSection}>
              <h5 style={styles.sectionTitle}>❓ {language === 'en' ? 'Practice Questions' : 'अभ्यास प्रश्न'}</h5>
              <ol style={styles.questionList}>
                {generatedNotes.practiceQuestions.map((q, i) => (
                  <li key={i} style={styles.listItem}>{q}</li>
                ))}
              </ol>
            </div>

            <div style={styles.notesSection}>
              <h5 style={styles.sectionTitle}>💡 {language === 'en' ? 'Study Tips' : 'अध्ययन सुझाव'}</h5>
              <ul style={styles.tipsList}>
                {generatedNotes.tips.map((tip, i) => (
                  <li key={i} style={styles.listItem}>{tip}</li>
                ))}
              </ul>
            </div>

            <div style={styles.notesSection}>
              <p><strong>{language === 'en' ? 'Summary:' : 'सारांश:'}</strong> {generatedNotes.summary}</p>
            </div>

            {/* Action Buttons */}
            <div style={styles.notesActions}>
              <button
                className="btn"
                style={{
                  background: 'var(--student-primary)',
                  color: '#fff',
                  borderRadius: 'var(--r-md)',
                  opacity: isSpeaking ? 0.6 : 1,
                  cursor: isSpeaking ? 'not-allowed' : 'pointer'
                }}
                onClick={handleListenNotes}
                disabled={isSpeaking}
              >
                🔊 {isSpeaking ? '🎤...' : language === 'en' ? 'Listen to Notes' : 'नोट्स सुनें'}
              </button>
              <button
                className="btn"
                style={{
                  background: 'var(--success)',
                  color: '#fff',
                  borderRadius: 'var(--r-md)'
                }}
                onClick={handleDownloadNotes}
              >
                📥 {language === 'en' ? 'Download' : 'डाउनलोड'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== STUDY TECHNIQUES ==================== */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' }}>
        <h3 style={styles.cardTitle}>⚡ {language === 'en' ? 'Power Study Techniques' : 'शक्तिशाली अध्ययन तकनीकें'}</h3>
        <div style={styles.tipGrid}>
          {[
            { icon: '🔁', title: language === 'en' ? 'Spaced Repetition' : 'दूरी दोहराव', desc: language === 'en' ? 'Review notes at increasing intervals (1 day, 3 days, 1 week)' : 'बढ़ती हुई अवधि में नोट्स की समीक्षा करें' },
            { icon: '🧠', title: language === 'en' ? 'Active Recall' : 'सक्रिय स्मरण', desc: language === 'en' ? 'Test yourself instead of re-reading — 3× more effective' : 'फिर से पढ़ने के बजाय स्वयं को परीक्षण करें' },
            { icon: '🗺️', title: language === 'en' ? 'Mind Mapping' : 'दिमाग नक्शा', desc: language === 'en' ? 'Connect concepts visually to understand relationships' : 'संबंधों को समझने के लिए अवधारणाओं को दृश्य रूप से जोड़ें' },
            { icon: '🏫', title: language === 'en' ? 'Feynman Technique' : 'फाइनमैन तकनीक', desc: language === 'en' ? 'Explain concepts simply as if teaching a 10-year-old' : '10 साल के बच्चे को पढ़ाते हुए सरलता से समझाएं' },
          ].map(t => (
            <div key={t.title} style={styles.tipCard}>
              <span style={{ fontSize: 24 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--gray-600)', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)' },
  cardTitle: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 4 },
  modeSwitch: {
    display: 'flex', gap: 0,
    background: 'var(--gray-100)', borderRadius: 'var(--r-full)',
    padding: 4, margin: '0 auto 20px', width: 'fit-content',
  },
  modeBtn: {
    padding: '8px 20px', borderRadius: 'var(--r-full)',
    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    transition: 'var(--t-fast)',
  },
  timerCircle: { position: 'relative', width: 200, height: 200, margin: '0 auto 20px' },
  timerSVG: { position: 'absolute', top: 0, left: 0 },
  timerInner: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  timerDisplay: { fontSize: 42, fontWeight: 800, lineHeight: 1 },
  timerControls: { display: 'flex', gap: 10, justifyContent: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' },

  // Notes result styles
  notesResult: {
    marginTop: 20,
    padding: 16,
    background: '#f9f9f9',
    borderRadius: 'var(--r-md)',
    border: '2px solid var(--student-primary)',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  notesHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '2px solid var(--student-primary)'
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--navy-deep)',
    margin: '0 0 8px 0'
  },
  notesMetadata: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  badge: {
    fontSize: 12,
    background: 'var(--student-primary)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 'var(--r-full)',
    fontWeight: 600
  },
  notesOverview: {
    marginBottom: 16,
    padding: 12,
    background: '#fff',
    borderRadius: 'var(--r-md)',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--gray-700)'
  },
  notesSection: {
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--navy-deep)',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  pointsList: {
    margin: 0,
    paddingLeft: 20,
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--gray-700)'
  },
  questionList: {
    margin: 0,
    paddingLeft: 20,
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--gray-700)'
  },
  tipsList: {
    margin: 0,
    paddingLeft: 20,
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--gray-700)'
  },
  listItem: {
    marginBottom: 8
  },
  notesActions: {
    display: 'flex',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #ddd'
  },

  tipGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 },
  tipCard: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    padding: 14, background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--r-md)',
  },
};
