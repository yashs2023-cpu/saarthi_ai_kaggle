import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import geminiService from '../../../services/gemini';

const CAREER_PATHS = [
  { title: 'Software Development', icon: '💻', skills: ['Python', 'JavaScript', 'React', 'Node.js'], salary: '₹5–40 LPA', growth: 'Very High', color: '#6C63FF' },
  { title: 'Data Science & AI',    icon: '📊', skills: ['Python', 'ML', 'SQL', 'Statistics'],       salary: '₹6–45 LPA', growth: 'Very High', color: '#0EA5E9' },
  { title: 'Civil Services (UPSC)',icon: '🏛️', skills: ['Current Affairs', 'Essay', 'GS Papers'],   salary: '₹56K–2.5L/mo', growth: 'High',    color: '#10B981' },
  { title: 'Digital Marketing',   icon: '📱', skills: ['SEO', 'Google Ads', 'Content', 'Analytics'],salary: '₹3–20 LPA',   growth: 'High',      color: '#F59E0B' },
  { title: 'Chartered Accountancy',icon:'📋', skills: ['Taxation', 'Audit', 'GST', 'Company Law'], salary: '₹6–50 LPA',   growth: 'High',      color: '#FF9933' },
  { title: 'Medicine (MBBS)',      icon: '🏥', skills: ['NEET Prep', 'Biology', 'Chemistry'],        salary: '₹50K–5L/mo', growth: 'Very High', color: '#EF4444' },
];

const DEGREE_OPTIONS = ['10th Pass', '12th Science', '12th Commerce', '12th Arts', 'B.Tech/BE', 'BCA/BSc IT', 'BCom/BBA', 'BA/Other Graduate', 'Postgraduate'];
const INTEREST_OPTIONS = ['Technology & Coding', 'Medicine & Healthcare', 'Business & Finance', 'Arts & Design', 'Government & Law', 'Science & Research', 'Teaching & Education', 'Sports & Fitness'];
const GOAL_OPTIONS = ['High Salary', 'Job Security', 'Entrepreneurship', 'Social Impact', 'Work-Life Balance', 'Creative Work', 'International Career'];

export default function StudentCareer() {
  const [showWizard, setShowWizard] = useState(false);
  const [degree, setDegree] = useState('12th Science');
  const [interests, setInterests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const toggleArr = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const handleFindCareer = () => setShowWizard(true);

  const handleGetRecommendation = async () => {
    if (interests.length === 0) { showToast('Please select at least one interest', 'warning'); return; }
    setShowWizard(false);
    setLoading(true);
    showToast('🤖 Finding your perfect career path…', 'info');
    try {
      const prompt = `I am an Indian student with the following profile:
Qualification: ${degree}
Interests: ${interests.join(', ')}
Career Goals: ${goals.join(', ') || 'Not specified'}
Additional info: ${extraInfo || 'None'}

Give me a personalized career recommendation for the Indian job market including:
1. Top 3 career paths that suit my profile (with reasons)
2. Specific steps to start for each path
3. Timeline to first job/income
4. Salary range in India
5. One actionable thing I can do TODAY

Be specific to Indian context — mention Indian companies, exams, platforms.`;

      const response = await geminiService.chat(
        [{ role: 'user', text: prompt }],
        'You are a career counselor specializing in the Indian job market. Give specific, actionable, encouraging advice to Indian students.',
        'en'
      );
      setRecommendation(response || getFallbackRec());
      showToast('✅ Career roadmap ready!', 'success');
    } catch { setRecommendation(getFallbackRec()); showToast('Using offline recommendations', 'info'); }
    finally { setLoading(false); }
  };

  const getFallbackRec = () => {
    const matched = CAREER_PATHS.find(c => interests.some(i => c.skills.some(s => s.toLowerCase().includes(i.toLowerCase().split(' ')[0])))) || CAREER_PATHS[0];
    return `**${matched.title} — Recommended for You**\n\nBased on your profile, ${matched.title} is an excellent match.\n\n**Salary Range:** ${matched.salary}\n**Growth:** ${matched.growth}\n\n**Steps to Start:**\n1. Learn ${matched.skills[0]} first — free on YouTube/Coursera\n2. Build 2-3 projects and put them on GitHub\n3. Apply for internships on Internshala.com\n4. Get certified — Google/Microsoft offer free certifications\n\n**Today's Action:** Open Internshala.com and apply for 3 internships in ${matched.title} right now.`;
  };

  return (
    <div style={styles.page}>
      <div><h1 style={styles.title}>Career Guide 🚀</h1><p style={styles.subtitle}>AI-powered career roadmap based on your interests and goals</p></div>

      {/* Personalized finder */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '1.5px solid rgba(108,99,255,0.15)' }}>
        <h3 style={styles.cardTitle}>🎯 Find Your Perfect Career Path</h3>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>Answer a few questions and get a personalized AI career roadmap</p>
        <button className="btn btn-primary" style={{ borderRadius: 'var(--r-full)', opacity: loading ? 0.6 : 1 }} onClick={handleFindCareer} disabled={loading}>
          {loading ? '⏳ Generating roadmap…' : '🤖 Get My Career Roadmap'}
        </button>
      </div>

      {/* Wizard */}
      {showWizard && (
        <div className="saarthi-card anim-up" style={{ border: '2px solid var(--student-primary)' }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: 15, marginBottom: 16 }}>🎯 Tell me about yourself</div>
          <div style={styles.wizardGrid}>
            <div>
              <div style={styles.wizardLabel}>Current Qualification</div>
              <div style={styles.optionRow}>{DEGREE_OPTIONS.map(d => (<button key={d} style={{ ...styles.optionBtn, background: degree === d ? 'var(--student-primary)' : '#fff', color: degree === d ? '#fff' : 'var(--gray-700)', borderColor: degree === d ? 'var(--student-primary)' : 'var(--gray-200)' }} onClick={() => setDegree(d)}>{d}</button>))}</div>
            </div>
            <div>
              <div style={styles.wizardLabel}>Your Interests (select all that apply)</div>
              <div style={styles.optionRow}>{INTEREST_OPTIONS.map(i => (<button key={i} style={{ ...styles.optionBtn, background: interests.includes(i) ? '#10B981' : '#fff', color: interests.includes(i) ? '#fff' : 'var(--gray-700)', borderColor: interests.includes(i) ? '#10B981' : 'var(--gray-200)' }} onClick={() => toggleArr(interests, setInterests, i)}>{interests.includes(i) ? '✓ ' : ''}{i}</button>))}</div>
            </div>
            <div>
              <div style={styles.wizardLabel}>Career Goals</div>
              <div style={styles.optionRow}>{GOAL_OPTIONS.map(g => (<button key={g} style={{ ...styles.optionBtn, background: goals.includes(g) ? '#F59E0B' : '#fff', color: goals.includes(g) ? '#fff' : 'var(--gray-700)', borderColor: goals.includes(g) ? '#F59E0B' : 'var(--gray-200)' }} onClick={() => toggleArr(goals, setGoals, g)}>{goals.includes(g) ? '✓ ' : ''}{g}</button>))}</div>
            </div>
            <div>
              <div style={styles.wizardLabel}>Anything else? (optional)</div>
              <input className="saarthi-input" placeholder="e.g. I know basic Python, interested in startups" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 1, borderRadius: 'var(--r-full)' }} onClick={handleGetRecommendation}>🚀 Show My Career Path</button>
            <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => setShowWizard(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {recommendation && !showWizard && (
        <div className="saarthi-card" style={{ border: '2px solid var(--student-primary)' }}>
          <h3 style={{ ...styles.cardTitle, color: 'var(--student-primary)' }}>✨ Your Personalized Career Roadmap</h3>
          <div style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--navy-deep)">$1</strong>').replace(/\n/g, '<br/>') }} />
          <button className="btn btn-sm btn-ghost" style={{ marginTop: 12, borderRadius: 'var(--r-full)' }} onClick={() => setRecommendation(null)}>🔄 Try Again</button>
        </div>
      )}

      {/* Career paths grid */}
      <div><h2 style={styles.sectionTitle}>Explore All Career Paths</h2>
        <div style={styles.grid}>
          {CAREER_PATHS.map(c => (
            <div key={c.title} className="saarthi-card" style={{ borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-deep)' }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>Growth: {c.growth}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>💰 {c.salary}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {c.skills.slice(0, 3).map(s => (<span key={s} style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 11, fontWeight: 600, background: c.color + '15', color: c.color }}>{s}</span>))}
              </div>
              <button className="btn btn-sm" style={{ background: c.color, color: '#fff', borderRadius: 'var(--r-full)', width: '100%' }} onClick={() => { setInterests([c.title.split(' ')[0]]); handleFindCareer(); }}>Get Roadmap →</button>
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
  sectionTitle: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 14 },
  cardTitle: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 12 },
  wizardGrid: { display: 'flex', flexDirection: 'column', gap: 16 },
  wizardLabel: { fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: 7 },
  optionBtn: { padding: '6px 13px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--t-fast)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
};
