import React, { useState, useEffect, useRef, useContext } from 'react';
import { useToast } from '../../../hooks/useToast';
import voiceService from '../../../services/voice';
import geminiService from '../../../services/gemini';
import { LanguageContext } from '../../../contexts/LanguageContext';

const EXAM_TYPES = ['📋 Board Exam', '🔬 JEE/NEET', '🏛️ UPSC', '🎓 College Exam', '📖 Self Study'];
const LEARNING_STYLES = ['💡 Conceptual', '🔢 Formula-focused', '📖 Story-based', '❓ MCQ-focused'];
const DETAIL_LEVELS = ['⚡ Quick (2 min)', '📝 Standard (10 min)', '🔬 Deep Dive (20 min)'];

// Simple markdown-to-HTML renderer
function renderNotes(text) {
  if (!text) return '';
  return text
    .replace(/^## (.*$)/gm, '<h4 style="color:var(--student-primary);margin:14px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">$1</h4>')
    .replace(/^# (.*$)/gm, '<h3 style="color:var(--navy-deep);margin:12px 0 6px;font-size:15px">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<div style="display:flex;gap:8px;margin:4px 0;font-size:13px;color:var(--gray-700)"><span style="color:var(--student-primary);flex-shrink:0">•</span>$1</div>')
    .replace(/^\d+\. (.*$)/gm, '<div style="margin:4px 0;font-size:13px;color:var(--gray-700)">$&</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function StudentStudy() {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);
  const { showToast } = useToast();

  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showNotesWizard, setShowNotesWizard] = useState(false);
  const [examType, setExamType] = useState('📋 Board Exam');
  const [learningStyle, setLearningStyle] = useState('💡 Conceptual');
  const [detailLevel, setDetailLevel] = useState('📝 Standard (10 min)');
  const [includeOptions, setIncludeOptions] = useState({ questions: true, mnemonics: true, examples: true });
  const { language } = useContext(LanguageContext);

  // Pomodoro timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s === 0) {
            setTimerMinutes(m => {
              if (m === 0) {
                clearInterval(intervalRef.current);
                setIsRunning(false);
                if (mode === 'work') { setSessions(p => p + 1); showToast('✅ Session done! Take a break 🎉', 'success'); setMode('break'); return 5; }
                else { showToast('⏰ Break over! Focus time 📚', 'info'); setMode('work'); return 25; }
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, showToast]);

  const resetTimer = () => { setIsRunning(false); setMode('work'); setTimerMinutes(25); setTimerSeconds(0); };
  const pad = n => String(n).padStart(2, '0');
  const progress = mode === 'work' ? ((25 * 60 - (timerMinutes * 60 + timerSeconds)) / (25 * 60)) * 100 : ((5 * 60 - (timerMinutes * 60 + timerSeconds)) / (5 * 60)) * 100;
  const accentColor = mode === 'work' ? 'var(--student-primary)' : 'var(--success)';

  const handleGenerateNotes = () => {
    if (!topic.trim()) { showToast('⚠️ Please enter a topic', 'error'); return; }
    if (!subject.trim()) { showToast('⚠️ Please enter a subject', 'error'); return; }
    setShowNotesWizard(true);
  };

  const handleGenerateWithContext = async () => {
    setShowNotesWizard(false);
    setIsGenerating(true);
    showToast('🤖 Generating AI notes with Gemini…', 'info');
    try {
      const extras = [
        includeOptions.mnemonics ? 'Include easy-to-remember mnemonics and memory tricks.' : '',
        includeOptions.examples ? 'Include real-world Indian examples and case studies.' : '',
        includeOptions.questions ? 'End with 5 practice questions with brief answers.' : '',
      ].filter(Boolean).join(' ');

      const prompt = `Create ${detailLevel.includes('Quick') ? 'brief' : detailLevel.includes('Deep') ? 'comprehensive' : 'standard'} study notes for Indian students.

Topic: "${topic}"
Subject: ${subject}
Level: ${classLevel}
Exam type: ${examType}
Learning style: ${learningStyle}
${extras}

Use ## for section headers. Keep it exam-focused and relevant to Indian curriculum.
Sections to include: ## Overview, ## Key Concepts, ## Important Points${includeOptions.mnemonics ? ', ## Memory Tricks' : ''}${includeOptions.examples ? ', ## Indian Examples' : ''}, ## Summary${includeOptions.questions ? ', ## Practice Questions' : ''}`;

      const response = await geminiService.chat(
        [{ role: 'user', text: prompt }],
        'You are an expert Indian educational content creator. You create clear, structured notes for CBSE/ICSE/JEE/NEET students. Always use ## for section headers.',
        language
      );

      if (response) {
        setGeneratedNotes({
          title: `${topic} — ${subject}`,
          rawText: response,
          estimatedReadTime: Math.ceil(response.split(' ').length / 200) + ' min read',
          difficulty: classLevel.includes('12') || classLevel.includes('JEE') ? 'Hard' : classLevel.includes('11') ? 'Medium' : 'Easy',
          isAI: true,
        });
        showToast('✨ AI Notes generated!', 'success');
      } else {
        fallbackNotes();
      }
    } catch (e) { console.error(e); fallbackNotes(); }
    finally { setIsGenerating(false); }
  };

  const fallbackNotes = () => {
    setGeneratedNotes({
      title: `${topic} — ${subject} Study Guide`,
      rawText: `## Overview\n${topic} is a key concept in ${subject} for ${classLevel}.\n\n## Key Concepts\n- **Definition**: ${topic} is the systematic study of fundamental principles\n- **Core ideas**: Focus on understanding rather than rote learning\n- **Applications**: Widely used in practical scenarios\n\n## Important Points\n- Always connect theory to real-world examples\n- Practice previous year questions regularly\n- Make flashcards for formulas and definitions\n\n## Summary\n${topic} forms the foundation for advanced topics in ${subject}. Regular revision is key.\n\n## Practice Questions\n1. Define ${topic} in your own words with an example.\n2. What is the most important formula or concept in ${topic}?\n3. How is ${topic} applied in real Indian scenarios?\n4. What are common mistakes students make with ${topic}?\n5. Compare ${topic} with one related concept.`,
      estimatedReadTime: '8 min read',
      difficulty: classLevel.includes('12') ? 'Hard' : 'Medium',
      isAI: false,
    });
    showToast('Using offline notes template', 'info');
  };

  const handleListen = async () => {
    if (!generatedNotes) return;
    setIsSpeaking(true);
    showToast('🔊 Reading notes aloud…', 'info');
    const plainText = generatedNotes.rawText.replace(/##\s+/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
    await voiceService.speak(plainText.slice(0, 800), language, 'student');
    setIsSpeaking(false);
    showToast('✅ Done reading!', 'success');
  };

  const handleDownload = () => {
    if (!generatedNotes) return;
    const blob = new Blob([`${generatedNotes.title}\n${'='.repeat(40)}\n\n${generatedNotes.rawText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${topic.replace(/\s+/g, '-')}-notes.txt`; a.click();
    URL.revokeObjectURL(url);
    showToast('✅ Notes downloaded!', 'success');
  };

  const toggleOption = (key) => setIncludeOptions(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>Study Planner 📚</h1>
        <p style={styles.subtitle}>Pomodoro timer + AI notes generator powered by Gemini</p>
      </div>

      {/* Pomodoro */}
      <div className="saarthi-card" style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto', width: '100%' }}>
        <div style={styles.modeSwitch}>
          <button style={{ ...styles.modeBtn, background: mode === 'work' ? 'var(--student-primary)' : 'transparent', color: mode === 'work' ? '#fff' : 'var(--gray-500)' }} onClick={() => { resetTimer(); setMode('work'); }}>📖 Focus</button>
          <button style={{ ...styles.modeBtn, background: mode === 'break' ? 'var(--success)' : 'transparent', color: mode === 'break' ? '#fff' : 'var(--gray-500)' }} onClick={() => { setIsRunning(false); setMode('break'); setTimerMinutes(5); setTimerSeconds(0); }}>☕ Break</button>
        </div>
        <div style={styles.timerCircle}>
          <svg width="200" height="200" style={styles.timerSVG}>
            <circle cx="100" cy="100" r="88" stroke="var(--gray-100)" strokeWidth="10" fill="none" />
            <circle cx="100" cy="100" r="88" stroke={accentColor} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 88}`} strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`} transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={styles.timerInner}>
            <div style={{ ...styles.timerDisplay, color: accentColor }}>{pad(timerMinutes)}:{pad(timerSeconds)}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>{mode === 'work' ? 'Focus Time' : 'Break Time'}</div>
          </div>
        </div>
        <div style={styles.timerControls}>
          <button className="btn" style={{ flex: 1, background: accentColor, color: '#fff', borderRadius: 'var(--r-full)' }} onClick={() => setIsRunning(!isRunning)}>{isRunning ? '⏸ Pause' : '▶ Start'}</button>
          <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={resetTimer}>🔄 Reset</button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 12 }}>Sessions today: <strong style={{ color: 'var(--student-primary)' }}>{sessions}</strong></p>
      </div>

      {/* Notes Generator */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>📝 AI Notes Generator</h3>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>Enter topic → customize preferences → get Gemini-powered notes</p>
        <div style={styles.form}>
          <div style={styles.twoCol}>
            <div style={styles.field}><label style={styles.label}>Topic / Chapter</label><input className="saarthi-input" placeholder="e.g., Photosynthesis" value={topic} onChange={e => setTopic(e.target.value)} disabled={isGenerating} /></div>
            <div style={styles.field}><label style={styles.label}>Subject</label><input className="saarthi-input" placeholder="e.g., Biology" value={subject} onChange={e => setSubject(e.target.value)} disabled={isGenerating} /></div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Class / Level</label>
            <select className="saarthi-input" value={classLevel} onChange={e => setClassLevel(e.target.value)} disabled={isGenerating}>
              {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE/NEET Prep', 'UPSC Prep', 'Undergraduate'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', opacity: isGenerating ? 0.6 : 1 }} onClick={handleGenerateNotes} disabled={isGenerating}>
            {isGenerating ? '⏳ Generating…' : '🤖 Customize & Generate'}
          </button>
        </div>

        {/* Notes Wizard */}
        {showNotesWizard && (
          <div style={styles.wizardBox} className="anim-up">
            <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 12, fontSize: 14 }}>🎯 Customize Your Notes</div>
            <div style={styles.wizardGrid}>
              <div><div style={styles.wizardLabel}>Exam Type</div><div style={styles.optionRow}>{EXAM_TYPES.map(e => (<button key={e} style={{ ...styles.optionBtn, background: examType === e ? 'var(--student-primary)' : '#fff', color: examType === e ? '#fff' : 'var(--gray-700)', borderColor: examType === e ? 'var(--student-primary)' : 'var(--gray-200)' }} onClick={() => setExamType(e)}>{e}</button>))}</div></div>
              <div><div style={styles.wizardLabel}>Learning Style</div><div style={styles.optionRow}>{LEARNING_STYLES.map(s => (<button key={s} style={{ ...styles.optionBtn, background: learningStyle === s ? '#10B981' : '#fff', color: learningStyle === s ? '#fff' : 'var(--gray-700)', borderColor: learningStyle === s ? '#10B981' : 'var(--gray-200)' }} onClick={() => setLearningStyle(s)}>{s}</button>))}</div></div>
              <div><div style={styles.wizardLabel}>Detail Level</div><div style={styles.optionRow}>{DETAIL_LEVELS.map(d => (<button key={d} style={{ ...styles.optionBtn, background: detailLevel === d ? '#F59E0B' : '#fff', color: detailLevel === d ? '#fff' : 'var(--gray-700)', borderColor: detailLevel === d ? '#F59E0B' : 'var(--gray-200)' }} onClick={() => setDetailLevel(d)}>{d}</button>))}</div></div>
              <div><div style={styles.wizardLabel}>Include</div><div style={styles.optionRow}>{[['questions','❓ Practice Questions'],['mnemonics','🧠 Mnemonics'],['examples','🇮🇳 Indian Examples']].map(([key,label]) => (<button key={key} style={{ ...styles.optionBtn, background: includeOptions[key] ? '#6C63FF' : '#fff', color: includeOptions[key] ? '#fff' : 'var(--gray-700)', borderColor: includeOptions[key] ? '#6C63FF' : 'var(--gray-200)' }} onClick={() => toggleOption(key)}>{includeOptions[key] ? '✓ ' : ''}{label}</button>))}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn btn-primary" style={{ borderRadius: 'var(--r-full)', flex: 1 }} onClick={handleGenerateWithContext}>✨ Generate Smart Notes</button>
              <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => setShowNotesWizard(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Notes Result */}
        {generatedNotes && !showNotesWizard && (
          <div style={styles.notesResult}>
            <div style={styles.notesHeader}>
              <h4 style={styles.notesTitle}>{generatedNotes.title}</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <span style={styles.badge}>⏱️ {generatedNotes.estimatedReadTime}</span>
                <span style={styles.badge}>{generatedNotes.difficulty === 'Hard' ? '🔴' : generatedNotes.difficulty === 'Medium' ? '🟡' : '🟢'} {generatedNotes.difficulty}</span>
                {generatedNotes.isAI && <span style={{ ...styles.badge, background: '#6C63FF' }}>✨ AI Generated</span>}
              </div>
            </div>
            <div style={styles.notesBody} dangerouslySetInnerHTML={{ __html: renderNotes(generatedNotes.rawText) }} />
            <div style={styles.notesActions}>
              <button className="btn" style={{ background: 'var(--student-primary)', color: '#fff', borderRadius: 'var(--r-md)', opacity: isSpeaking ? 0.6 : 1 }} onClick={handleListen} disabled={isSpeaking}>{isSpeaking ? '🎤 Reading…' : '🔊 Listen'}</button>
              <button className="btn" style={{ background: 'var(--success)', color: '#fff', borderRadius: 'var(--r-md)' }} onClick={handleDownload}>📥 Download</button>
              <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-md)' }} onClick={() => setGeneratedNotes(null)}>🔄 New Notes</button>
            </div>
          </div>
        )}
      </div>

      {/* Study Techniques */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' }}>
        <h3 style={styles.cardTitle}>⚡ Power Study Techniques</h3>
        <div style={styles.tipGrid}>
          {[
            { icon: '🔁', title: 'Spaced Repetition', desc: 'Review notes at 1 day, 3 days, 1 week intervals — 90% retention' },
            { icon: '🧠', title: 'Active Recall', desc: 'Close book and write what you remember — 3× more effective than re-reading' },
            { icon: '🗺️', title: 'Mind Mapping', desc: 'Draw connections between concepts to understand relationships visually' },
            { icon: '🏫', title: 'Feynman Technique', desc: 'Explain the concept as if teaching a 10-year-old — reveals gaps instantly' },
          ].map(tip => (
            <div key={tip.title} style={styles.tipCard}>
              <span style={{ fontSize: 24 }}>{tip.icon}</span>
              <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 3 }}>{tip.title}</div><div style={{ fontSize: 12.5, color: 'var(--gray-600)', lineHeight: 1.5 }}>{tip.desc}</div></div>
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
  cardTitle: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8 },
  modeSwitch: { display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--r-full)', padding: 4, margin: '0 auto 20px', width: 'fit-content' },
  modeBtn: { padding: '8px 20px', borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--t-fast)' },
  timerCircle: { position: 'relative', width: 200, height: 200, margin: '0 auto 20px' },
  timerSVG: { position: 'absolute', top: 0, left: 0 },
  timerInner: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  timerDisplay: { fontSize: 42, fontWeight: 800, lineHeight: 1 },
  timerControls: { display: 'flex', gap: 10, justifyContent: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' },
  wizardBox: { marginTop: 20, padding: 18, background: '#F5F3FF', borderRadius: 'var(--r-xl)', border: '1.5px solid rgba(108,99,255,0.2)' },
  wizardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 },
  wizardLabel: { fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  optionBtn: { padding: '5px 11px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--t-fast)' },
  notesResult: { marginTop: 20, padding: 18, background: '#fff', borderRadius: 'var(--r-xl)', border: '2px solid var(--student-primary)' },
  notesHeader: { marginBottom: 14, paddingBottom: 12, borderBottom: '2px solid var(--student-primary)' },
  notesTitle: { fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', margin: 0 },
  badge: { fontSize: 11, background: 'var(--student-primary)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--r-full)', fontWeight: 600 },
  notesBody: { fontSize: 13.5, lineHeight: 1.7, color: 'var(--gray-700)', maxHeight: 520, overflowY: 'auto', padding: '8px 0' },
  notesActions: { display: 'flex', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--gray-100)', flexWrap: 'wrap' },
  tipGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 },
  tipCard: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--r-md)' },
};
