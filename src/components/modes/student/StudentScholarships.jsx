import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';

const SCHOLARSHIPS = [
  { id: 1, name: 'National Merit Scholarship', amount: '₹1,00,000/year', eligibility: '90%+ in 10th standard', deadline: '2025-07-15', type: 'merit', category: 'Government', amountNum: 100000, description: 'For top-performing students across India based on academic merit.', portal: 'scholarships.gov.in', steps: ['Register at scholarships.gov.in', 'Upload mark sheets', 'Submit income certificate', 'Wait for verification'] },
  { id: 2, name: 'PM Scholarship for SC/ST', amount: '₹20,000/year', eligibility: 'SC/ST students, 60%+ marks', deadline: 'Ongoing', type: 'government', category: 'Government', amountNum: 20000, description: 'Central government scholarship for SC/ST students in professional courses.', portal: 'scholarships.gov.in', steps: ['Visit NSP portal', 'Select state & scheme', 'Fill application form', 'Upload documents'] },
  { id: 3, name: 'State Scholarship for Girls', amount: '₹50,000/year', eligibility: 'Girl students, 75%+ marks', deadline: '2025-07-30', type: 'government', category: 'State', amountNum: 50000, description: 'Empowering girl students by providing financial support for higher education.', portal: 'State education portal', steps: ['Contact state education dept', 'Submit income proof', 'Attach bonafide certificate', 'Academic verification'] },
  { id: 4, name: 'Tata Trust Scholarship', amount: '₹2,00,000/year', eligibility: 'Annual income < ₹3L, merit based', deadline: '2025-08-31', type: 'private', category: 'Private', amountNum: 200000, description: 'Comprehensive scholarship from Tata Trusts for deserving students in need.', portal: 'tatatrusts.org', steps: ['Apply at tatatrusts.org', 'Personal interview', 'Document verification', 'Award announcement'] },
  { id: 5, name: 'Reliance Foundation Scholarship', amount: '₹4,00,000/year', eligibility: 'UG students in STEM/humanities, merit + need', deadline: '2025-09-15', type: 'private', category: 'Private', amountNum: 400000, description: 'One of India\'s largest private scholarships for undergraduate students.', portal: 'reliancefoundation.org', steps: ['Online application', 'Merit screening', 'Socio-economic screening', 'Interview round'] },
  { id: 6, name: 'AICTE Pragati Scholarship', amount: '₹50,000/year', eligibility: 'Girl students in technical education', deadline: '2025-10-31', type: 'government', category: 'Government', amountNum: 50000, description: 'For girl students pursuing technical education at AICTE approved institutions.', portal: 'aicte-india.org', steps: ['Check AICTE portal', 'Institution nomination', 'Document submission', 'Bank verification'] },
];

const INTERNSHIPS = [
  { company: 'Google', role: 'Software Engineering Intern', stipend: '₹50,000/month', duration: '3 months', deadline: '2025-07-20', logo: '🟢', skills: ['Python', 'Algorithms', 'Problem Solving'], apply: 'careers.google.com' },
  { company: 'Microsoft', role: 'Data Analytics Intern', stipend: '₹40,000/month', duration: '6 weeks', deadline: '2025-07-25', logo: '🔵', skills: ['Excel', 'SQL', 'Power BI'], apply: 'careers.microsoft.com' },
  { company: 'ISRO', role: 'Research Intern', stipend: '₹15,000/month', duration: '2 months', deadline: '2025-08-05', logo: '🚀', skills: ['Physics', 'Mathematics', 'Research'], apply: 'isro.gov.in' },
  { company: 'Internshala', role: 'Any Domain', stipend: '₹5,000–25,000', duration: '1–6 months', deadline: 'Rolling', logo: '🎓', skills: ['Varies by role'], apply: 'internshala.com' },
];

export default function StudentScholarships() {
  const [tab, setTab] = useState('scholarships');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [expanded, setExpanded] = useState(null);
  const { showToast } = useToast();

  const filtered = SCHOLARSHIPS
    .filter(s => filter === 'all' || s.type === filter)
    .sort((a, b) => sortBy === 'amount' ? b.amountNum - a.amountNum : a.deadline.localeCompare(b.deadline));

  const getDaysLeft = (deadline) => {
    if (deadline === 'Ongoing' || deadline === 'Rolling') return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div style={styles.page}>
      <div><h1 style={styles.title}>Scholarships & Internships 🏅</h1><p style={styles.subtitle}>Discover funding and real-world experience — filtered and sorted for you</p></div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[['₹7.7L+', 'Max Scholarship/year'], ['6', 'Active Scholarships'], ['4', 'Top Internships'], ['Free', 'NSP Applications']].map(([num, label]) => (
          <div key={label} className="saarthi-card" style={{ textAlign: 'center', flex: 1, minWidth: 100 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--student-primary)' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        {[['scholarships', '🏅 Scholarships'], ['internships', '💼 Internships']].map(([key, label]) => (
          <button key={key} style={{ ...styles.tab, background: tab === key ? 'var(--student-primary)' : '#fff', color: tab === key ? '#fff' : 'var(--gray-600)', borderColor: tab === key ? 'var(--student-primary)' : 'var(--gray-200)' }} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === 'scholarships' && (
        <>
          {/* Filters + Sort */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={styles.filterRow}>
              {[['all', 'All'], ['government', 'Government'], ['private', 'Private'], ['merit', 'Merit']].map(([key, label]) => (
                <button key={key} style={{ ...styles.filterBtn, background: filter === key ? 'var(--student-primary)' : '#fff', color: filter === key ? '#fff' : 'var(--gray-600)', borderColor: filter === key ? 'var(--student-primary)' : 'var(--gray-200)' }} onClick={() => setFilter(key)}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Sort:</span>
              {[['deadline', '📅 Deadline'], ['amount', '💰 Amount']].map(([key, label]) => (
                <button key={key} style={{ ...styles.filterBtn, background: sortBy === key ? '#F59E0B' : '#fff', color: sortBy === key ? '#fff' : 'var(--gray-600)', borderColor: sortBy === key ? '#F59E0B' : 'var(--gray-200)', padding: '5px 10px' }} onClick={() => setSortBy(key)}>{label}</button>
              ))}
            </div>
          </div>

          <div style={styles.list}>
            {filtered.map(s => {
              const daysLeft = getDaysLeft(s.deadline);
              const urgent = daysLeft !== null && daysLeft <= 30 && daysLeft > 0;
              return (
                <div key={s.id} className="saarthi-card" style={{ borderLeft: `4px solid ${urgent ? 'var(--danger)' : 'var(--student-primary)'}` }}>
                  <div style={styles.schHeader} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <div>
                      <h3 style={styles.schName}>{s.name}</h3>
                      <div style={{ display: 'flex', gap: 7, marginTop: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="badge badge-success">💰 {s.amount}</span>
                        <span className="badge badge-info">{s.category}</span>
                        {urgent && <span className="badge badge-danger">⚠️ {daysLeft} days left!</span>}
                        {!urgent && s.deadline !== 'Ongoing' && daysLeft !== null && <span className="badge badge-warning">📅 {daysLeft} days</span>}
                        {(s.deadline === 'Ongoing' || s.deadline === 'Rolling') && <span className="badge badge-success">🟢 Open</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: 'var(--gray-400)', flexShrink: 0 }}>{expanded === s.id ? '▲' : '▼'}</span>
                  </div>
                  {expanded === s.id && (
                    <div style={styles.schDetails} className="anim-up">
                      <p style={styles.schDesc}>{s.description}</p>
                      <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: 13, color: 'var(--gray-700)', marginBottom: 12 }}>
                        <strong>Eligibility:</strong> {s.eligibility}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 10, fontWeight: 600 }}>🌐 Apply at: <span style={{ color: 'var(--student-primary)' }}>{s.portal}</span></div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8 }}>How to Apply:</h4>
                      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {s.steps.map((step, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--student-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button className="btn btn-sm" style={{ background: 'var(--student-primary)', color: '#fff', borderRadius: 'var(--r-full)' }} onClick={() => { showToast(`Opening ${s.portal}…`, 'info'); window.open(`https://${s.portal}`, '_blank'); }}>📝 Apply Now</button>
                        <button className="btn btn-sm btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => showToast('Saved to your list! 🔖', 'success')}>🔖 Save</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'internships' && (
        <div style={styles.list}>
          {INTERNSHIPS.map((intern, i) => (
            <div key={i} className="saarthi-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--gray-100)', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{intern.logo}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)' }}>{intern.company}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', margin: '3px 0 8px' }}>{intern.role}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <span className="badge badge-success">💰 {intern.stipend}</span>
                  <span className="badge badge-info">⏱️ {intern.duration}</span>
                  <span className="badge badge-warning">📅 {intern.deadline}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {intern.skills.map(s => (<span key={s} style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--student-primary)', padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600 }}>{s}</span>))}
                </div>
              </div>
              <button className="btn btn-sm" style={{ background: 'var(--student-primary)', color: '#fff', borderRadius: 'var(--r-full)', flexShrink: 0 }} onClick={() => window.open(`https://${intern.apply}`, '_blank')}>Apply →</button>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--r-xl)', border: '1px dashed var(--gray-200)' }}>
            <div style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 600 }}>🔍 Find 1000+ more internships</div>
            <button className="btn btn-sm" style={{ background: 'var(--student-primary)', color: '#fff', borderRadius: 'var(--r-full)', marginTop: 8 }} onClick={() => window.open('https://internshala.com', '_blank')}>Open Internshala →</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)' },
  statsRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  tabRow: { display: 'flex', gap: 10 },
  tab: { padding: '9px 22px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  filterRow: { display: 'flex', gap: 7, flexWrap: 'wrap' },
  filterBtn: { padding: '6px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  schHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  schName: { fontSize: 15, fontWeight: 700, color: 'var(--navy-deep)' },
  schDetails: { marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--gray-100)' },
  schDesc: { fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 10 },
};
