import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import geminiService from '../../../services/gemini';

const INIT_MEDICINES = [
  { id: 1, name: 'Blood Pressure Medicine', dosage: '1 tablet', time: '8:00 AM', taken: true,  reason: 'Hypertension' },
  { id: 2, name: 'Heart Capsule',           dosage: '1 capsule',time: '1:00 PM', taken: true,  reason: 'Heart health' },
  { id: 3, name: 'Calcium Supplement',      dosage: '1 tablet', time: '8:00 PM', taken: false, reason: 'Bone strength' },
];

export default function SeniorHealth() {
  const [medicines, setMedicines] = useState(INIT_MEDICINES);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('');
  const [healthQuestion, setHealthQuestion] = useState('');
  const [healthAnswer, setHealthAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const { showToast } = useToast();

  const markTaken = (id) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: true } : m));
    showToast('Medicine marked as taken ✅', 'success');
  };

  const addMedicine = () => {
    if (!newName.trim()) { showToast('Please enter medicine name', 'warning'); return; }
    setMedicines(prev => [...prev, { id: Date.now(), name: newName, dosage: newDosage || '1 tablet', time: newTime || 'Morning', taken: false, reason: 'As prescribed' }]);
    setNewName(''); setNewDosage(''); setNewTime('');
    showToast('Medicine reminder set! 🔔', 'success');
  };

  const askHealthQuestion = async () => {
    if (!healthQuestion.trim()) { showToast('Please enter a question', 'warning'); return; }
    setLoadingAnswer(true);
    try {
      const response = await geminiService.chat(
        [{ role: 'user', text: healthQuestion }],
        'You are a caring doctor speaking to an elderly Indian patient (60+ years). Give simple, clear, safe health advice in simple language. Always recommend consulting a real doctor for serious symptoms. Use Hindi words occasionally to feel familiar.',
        'en'
      );
      setHealthAnswer(response || 'Please consult your doctor. For emergency, call 108 immediately.');
    } catch { setHealthAnswer('Please consult your doctor. For emergency, call 108.'); }
    finally { setLoadingAnswer(false); }
  };

  const pending = medicines.filter(m => !m.taken);

  return (
    <div style={styles.page} className="senior-mode">
      <div>
        <h1 style={styles.title}>Health & Medicines 💊</h1>
        <p style={styles.subtitle}>Apni dawaiyan yaad rakhein — sehat sab se badi daulat hai</p>
      </div>

      {pending.length > 0 && (
        <div style={styles.pendingBanner}>⏰ {pending.length} medicine{pending.length > 1 ? 's' : ''} leni baaki hai aaj</div>
      )}

      {/* Medicine list */}
      <div>
        <h2 style={styles.sectionTitle}>Aaj ki Dawaiyan</h2>
        <div style={styles.medicineList}>
          {medicines.map(m => (
            <div key={m.id} style={{ ...styles.medicineCard, opacity: m.taken ? 0.65 : 1 }}>
              <div style={{ ...styles.medStatus, background: m.taken ? '#ECFDF5' : '#FFFBEB', border: `2px solid ${m.taken ? '#10B981' : '#F59E0B'}` }}>
                <span style={{ fontSize: 24 }}>{m.taken ? '✅' : '⏳'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.medName}>{m.name}</div>
                <div style={styles.medDetails}>💊 {m.dosage} · ⏰ {m.time} · {m.reason}</div>
              </div>
              {!m.taken && (
                <button style={styles.takenBtn} onClick={() => markTaken(m.id)}>✓ Li</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add medicine */}
      <div className="saarthi-card">
        <h3 style={styles.sectionTitle}>➕ Nayi Dawai Add Karein</h3>
        <div style={styles.form}>
          {[['Dawai ka naam', newName, setNewName, 'e.g., Metformin 500mg'], ['Dose', newDosage, setNewDosage, 'e.g., 1 tablet'], ['Time', newTime, setNewTime, 'e.g., 9:00 AM']].map(([label, val, setter, ph]) => (
            <div key={label}>
              <label style={styles.label}>{label}</label>
              <input className="saarthi-input" style={{ fontSize: 16 }} placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: 14 }} onClick={addMedicine}>🔔 Reminder Set Karein</button>
        </div>
      </div>

      {/* AI Health Q&A */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', border: '1.5px solid rgba(14,165,233,0.2)' }}>
        <h3 style={styles.sectionTitle}>🤖 Doctor Se Poochein (AI)</h3>
        <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 12 }}>Koi bhi health sawaal poochein — AI doctor jawab dega</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="saarthi-input" style={{ flex: 1, fontSize: 15 }} placeholder="e.g. Sugar mein kya khana chahiye?" value={healthQuestion} onChange={e => setHealthQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askHealthQuestion()} />
          <button className="btn" style={{ background: 'var(--senior-primary)', color: '#fff', borderRadius: 'var(--r-md)', flexShrink: 0, opacity: loadingAnswer ? 0.6 : 1 }} onClick={askHealthQuestion} disabled={loadingAnswer}>{loadingAnswer ? '⏳' : '→'}</button>
        </div>
        {healthAnswer && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: '#fff', borderRadius: 'var(--r-lg)', fontSize: 14, lineHeight: 1.8, color: 'var(--gray-700)', border: '1px solid var(--gray-200)' }}
            dangerouslySetInnerHTML={{ __html: healthAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {['Sugar mein kya khana chahiye?', 'BP ke liye exercise?', 'Vitamin D kaise badhayein?', 'Neend nahi aa rahi — kya karein?'].map(q => (
            <button key={q} style={{ padding: '6px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--gray-200)', background: '#fff', fontSize: 12, cursor: 'pointer', color: 'var(--navy-deep)' }} onClick={() => setHealthQuestion(q)}>{q}</button>
          ))}
        </div>
      </div>

      {/* Health tips */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F9FF, #BAE6FD)', border: '1.5px solid rgba(14,165,233,0.2)' }}>
        <h3 style={styles.sectionTitle}>💡 Sehat Tips</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {['💧 Roz 8 gilaas paani piyein', '🚶 Roz 20-30 minute walking karein', '🛌 Raat ko 7-8 ghante zaroor soyein', '🥗 Hara saag aur phal khayein', '🧘 Subah 10 minute meditation karein'].map(t => (
            <div key={t} style={{ fontSize: 15, color: 'var(--gray-700)' }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontSize: 26, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 15, color: 'var(--gray-500)' },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 14 },
  pendingBanner: { background: '#FFFBEB', border: '2px solid rgba(245,158,11,0.3)', borderRadius: 'var(--r-xl)', padding: '14px 20px', fontSize: 16, fontWeight: 700, color: '#92400E' },
  medicineList: { display: 'flex', flexDirection: 'column', gap: 12 },
  medicineCard: { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', padding: '16px 20px', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' },
  medStatus: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  medName: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 4 },
  medDetails: { fontSize: 14, color: 'var(--gray-500)' },
  takenBtn: { background: 'linear-gradient(135deg, var(--success), #059669)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', padding: '10px 18px', fontSize: 15, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  label: { display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 5 },
};
