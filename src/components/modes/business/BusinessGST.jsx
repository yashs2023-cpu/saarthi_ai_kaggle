import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import geminiService from '../../../services/gemini';

const GST_SLABS = [
  { rate: '0%',  items: 'Fresh vegetables, milk, eggs, unprocessed food', color: '#10B981' },
  { rate: '5%',  items: 'Packaged food, tea, coffee, cooking oil, sugar', color: '#0EA5E9' },
  { rate: '12%', items: 'Processed food, computers, medicines, mobile phones', color: '#6C63FF' },
  { rate: '18%', items: 'Soaps, shampoos, electronics, AC, refrigerators', color: '#F59E0B' },
  { rate: '28%', items: 'Luxury items, cigarettes, cars, aerated beverages', color: '#EF4444' },
];

const DEADLINES = [
  { form: 'GSTR-1',  deadline: '11th of next month', desc: 'Outward supply details', penalty: '₹50/day' },
  { form: 'GSTR-3B', deadline: '20th of next month', desc: 'Monthly summary return',  penalty: '₹50/day' },
  { form: 'GSTR-9',  deadline: '31st December',      desc: 'Annual return',            penalty: '₹200/day' },
];

export default function BusinessGST() {
  const { showToast } = useToast();
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [result, setResult] = useState(null);
  const [gstQuestion, setGstQuestion] = useState('');
  const [gstAnswer, setGstAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleCalculate = () => {
    const amount = parseFloat(invoiceAmount);
    const rate = parseFloat(gstRate);
    if (isNaN(amount) || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
    if (isNaN(rate) || rate < 0) { showToast('Please select a valid GST rate', 'error'); return; }
    const cgstRate = rate / 2;
    const cgstAmount = (amount * cgstRate) / 100;
    const sgstAmount = cgstAmount;
    const totalGst = cgstAmount + sgstAmount;
    setResult({ baseAmount: amount.toFixed(2), cgstRate: cgstRate.toFixed(2), cgstAmount: cgstAmount.toFixed(2), sgstRate: cgstRate.toFixed(2), sgstAmount: sgstAmount.toFixed(2), totalGstRate: rate.toFixed(2), totalGst: totalGst.toFixed(2), finalAmount: (amount + totalGst).toFixed(2) });
    showToast(`GST Calculated! CGST ${cgstRate}% + SGST ${cgstRate}% = ${rate}% total`, 'success');
  };

  const askGstQuestion = async () => {
    if (!gstQuestion.trim()) { showToast('Please enter a question', 'warning'); return; }
    setLoadingAnswer(true);
    try {
      const response = await geminiService.chat(
        [{ role: 'user', text: gstQuestion }],
        'You are a GST expert for Indian MSMEs. Answer clearly, mention specific GST sections, deadlines, and penalties where relevant. Keep answers concise and practical.',
        'en'
      );
      setGstAnswer(response || 'Could not get answer. Please check the GST portal at gst.gov.in or call 1800-1200-232.');
      showToast('✅ Answer ready!', 'success');
    } catch { setGstAnswer('Please check gst.gov.in or call GST helpline: 1800-1200-232.'); }
    finally { setLoadingAnswer(false); }
  };

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>GST Guide 🏛️</h1>
        <p style={styles.subtitle}>Calculator, deadlines, and AI-powered GST Q&A</p>
      </div>

      {/* Calculator */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F4F8, #E2E8F0)' }}>
        <h3 style={styles.cardTitle}>🧮 GST Calculator</h3>
        <div style={styles.calcForm}>
          <div style={styles.field}><label style={styles.label}>Invoice Amount (₹)</label><input className="saarthi-input" type="number" placeholder="Enter base amount" value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>GST Rate (%)</label>
            <select className="saarthi-input" value={gstRate} onChange={e => setGstRate(e.target.value)}>
              {['0','5','12','18','28'].map(r => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <button className="btn btn-navy" style={{ borderRadius: 'var(--r-full)' }} onClick={handleCalculate}>Calculate →</button>
            <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => { setInvoiceAmount(''); setResult(null); }}>Reset</button>
          </div>
        </div>
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.resultGrid}>
              {[['Base Amount', `₹${parseFloat(result.baseAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'var(--navy-deep)'], [`CGST (${result.cgstRate}%)`, `₹${parseFloat(result.cgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'var(--gray-700)'], [`SGST (${result.sgstRate}%)`, `₹${parseFloat(result.sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'var(--gray-700)'], [`Total GST (${result.totalGstRate}%)`, `₹${parseFloat(result.totalGst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '#F59E0B']].map(([label, val, color]) => (
                <div key={label} style={styles.resultItem}><span style={styles.resultLabel}>{label}</span><span style={{ ...styles.resultValue, color }}>{val}</span></div>
              ))}
              <div style={{ ...styles.resultItem, gridColumn: '1 / -1', background: 'var(--navy)', borderRadius: 'var(--r-md)' }}>
                <span style={{ ...styles.resultLabel, color: 'rgba(255,255,255,0.7)' }}>Final Amount (incl. GST)</span>
                <span style={{ ...styles.resultValue, color: '#fff', fontSize: 20 }}>₹{parseFloat(result.finalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI GST Q&A */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>🤖 Ask AI — GST Questions</h3>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>Ask anything about GST — filing, ITC, penalties, registration</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="saarthi-input" style={{ flex: 1 }} placeholder="e.g. How to claim ITC on purchases?" value={gstQuestion} onChange={e => setGstQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askGstQuestion()} />
          <button className="btn btn-primary" style={{ borderRadius: 'var(--r-md)', flexShrink: 0, opacity: loadingAnswer ? 0.6 : 1 }} onClick={askGstQuestion} disabled={loadingAnswer}>{loadingAnswer ? '⏳' : '→'}</button>
        </div>
        {gstAnswer && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-200)', fontSize: 13.5, lineHeight: 1.7, color: 'var(--gray-700)' }}
            dangerouslySetInnerHTML={{ __html: gstAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {['How to file GSTR-3B?', 'What is ITC?', 'GST on restaurant food?', 'Composition scheme limit?'].map(q => (
            <button key={q} style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--gray-200)', background: '#fff', fontSize: 12, cursor: 'pointer', color: 'var(--navy-deep)', fontWeight: 500 }} onClick={() => { setGstQuestion(q); }}>{q}</button>
          ))}
        </div>
      </div>

      {/* GST Slabs */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>GST Rate Slabs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GST_SLABS.map(s => (
            <div key={s.rate} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, width: 40, flexShrink: 0, color: s.color }}>{s.rate}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{s.items}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filing deadlines */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>📅 Filing Deadlines</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEADLINES.map(d => (
            <div key={d.form} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--navy)', color: '#fff', padding: '4px 12px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{d.form}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{d.desc}</div></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginLeft: 'auto' }}>📅 {d.deadline}</div>
              <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>⚠️ {d.penalty} late</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 14 },
  calcForm: { display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.1)' },
  field: { display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 140 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' },
  resultBox: { background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--r-lg)', padding: 16 },
  resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  resultItem: { display: 'flex', flexDirection: 'column', gap: 4, padding: 12, background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--gray-200)' },
  resultLabel: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' },
  resultValue: { fontSize: 17, fontWeight: 800 },
};
