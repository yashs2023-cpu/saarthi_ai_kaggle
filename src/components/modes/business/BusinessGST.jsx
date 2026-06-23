import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';

const GST_SLABS = [
  { rate: '0%',   items: 'Essential food items, fresh vegetables, milk, eggs', color: '#10B981' },
  { rate: '5%',   items: 'Packaged food, tea, coffee, cooking oil, sugar',     color: '#0EA5E9' },
  { rate: '12%',  items: 'Processed food, computers, medicines, mobile phones', color: '#6C63FF' },
  { rate: '18%',  items: 'Soaps, shampoos, electronics, AC, refrigerators',    color: '#F59E0B' },
  { rate: '28%',  items: 'Luxury items, cigarettes, cars, aerated beverages',  color: '#EF4444' },
];

const DEADLINES = [
  { form: 'GSTR-1',  deadline: '11th of next month', desc: 'Outward supply details' },
  { form: 'GSTR-3B', deadline: '20th of next month', desc: 'Monthly summary return' },
  { form: 'GSTR-9',  deadline: '31st December',      desc: 'Annual return' },
];

export default function BusinessGST() {
  const { showToast } = useToast();

  // ✅ STATE MANAGEMENT FOR CALCULATOR
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [gstRate, setGstRate] = useState('5');
  const [result, setResult] = useState(null);

  // ✅ CALCULATION LOGIC
  const handleCalculate = () => {
    if (!invoiceAmount || invoiceAmount <= 0) {
      showToast('❌ Please enter a valid invoice amount', 'error');
      return;
    }

    const amount = parseFloat(invoiceAmount);
    const rate = parseFloat(gstRate);

    // GST is split into CGST (Central GST) and SGST (State GST)
    // Each is half of the total rate
    const cgstRate = rate / 2;
    const sgstRate = rate / 2;

    // Calculate amounts
    const cgstAmount = (amount * cgstRate) / 100;
    const sgstAmount = (amount * sgstRate) / 100;
    const totalGst = cgstAmount + sgstAmount;
    const finalAmount = amount + totalGst;

    // Set result
    setResult({
      baseAmount: amount.toFixed(2),
      cgstRate: cgstRate.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstRate: sgstRate.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      totalGstRate: rate.toFixed(2),
      totalGst: totalGst.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
    });

    showToast(`✅ GST Calculated! CGST ${cgstRate.toFixed(1)}% + SGST ${sgstRate.toFixed(1)}% = ${rate}% total 📊`, 'success');
  };

  // ✅ RESET CALCULATOR
  const handleReset = () => {
    setInvoiceAmount('');
    setGstRate('5');
    setResult(null);
  };

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>GST Guide 🏛️</h1>
        <p style={styles.subtitle}>Everything you need to know about GST compliance made simple</p>
      </div>

      {/* GST Calculator */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F4F8, #E2E8F0)' }}>
        <h3 style={styles.cardTitle}>🧮 GST Calculator</h3>
        
        {/* Input Form */}
        <div style={styles.calcForm}>
          <div style={styles.field}>
            <label style={styles.label}>Invoice Amount (₹)</label>
            <input 
              className="saarthi-input" 
              type="number" 
              placeholder="Enter base amount"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>GST Rate (%)</label>
            <select 
              className="saarthi-input"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
            >
              <option value="0">0% - Essential Items</option>
              <option value="5">5% - Packaged Food</option>
              <option value="12">12% - Processed Food</option>
              <option value="18">18% - Electronics</option>
              <option value="28">28% - Luxury Items</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-navy"
              style={{ borderRadius: 'var(--r-full)' }}
              onClick={handleCalculate}
            >
              Calculate →
            </button>
            <button
              className="btn"
              style={{ 
                borderRadius: 'var(--r-full)',
                background: 'var(--gray-300)',
                color: 'var(--navy)'
              }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ✅ CALCULATION RESULT */}
        {result && (
          <div style={styles.resultBox}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--navy)' }}>
              📊 Calculation Result
            </h4>
            
            <div style={styles.resultGrid}>
              {/* Base Amount */}
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Base Amount</span>
                <span style={styles.resultValue}>₹{parseFloat(result.baseAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* CGST */}
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>CGST ({result.cgstRate}%)</span>
                <span style={styles.resultValue}>₹{parseFloat(result.cgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* SGST */}
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>SGST ({result.sgstRate}%)</span>
                <span style={styles.resultValue}>₹{parseFloat(result.sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Total GST */}
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Total GST ({result.totalGstRate}%)</span>
                <span style={{ ...styles.resultValue, color: '#F59E0B', fontWeight: 800 }}>₹{parseFloat(result.totalGst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Final Amount */}
              <div style={{ ...styles.resultItem, gridColumn: '1 / -1', background: 'var(--navy)', color: '#fff', borderRadius: 'var(--r-md)' }}>
                <span style={styles.resultLabel}>Final Amount (Inclusive of GST)</span>
                <span style={{ ...styles.resultValue, color: '#fff' }}>₹{parseFloat(result.finalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Info Box */}
            <div style={styles.infoBox}>
              <p style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                💡 <strong>Note:</strong> GST is divided as CGST (Central) + SGST (State). 
                Each is 50% of the total GST rate. Example: 18% GST = 9% CGST + 9% SGST
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GST Slabs */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>GST Rate Slabs</h3>
        <div style={styles.slabList}>
          {GST_SLABS.map(s => (
            <div key={s.rate} style={{ ...styles.slabItem, borderLeft: `4px solid ${s.color}` }}>
              <div style={{ ...styles.slabRate, color: s.color }}>{s.rate}</div>
              <div style={styles.slabItems}>{s.items}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filing deadlines */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>📅 Filing Deadlines</h3>
        <div style={styles.deadlineList}>
          {DEADLINES.map(d => (
            <div key={d.form} style={styles.deadlineItem}>
              <div style={styles.formBadge}>{d.form}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.deadlineDesc}>{d.desc}</div>
              </div>
              <div style={styles.deadlineDue}>📅 {d.deadline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tips */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)' }}>
        <h3 style={styles.cardTitle}>💡 GST Compliance Tips</h3>
        <div style={styles.tipList}>
          {[
            '📱 Maintain digital records of all invoices (7-year requirement)',
            '🔄 Reconcile GSTR-2A with purchase register monthly',
            '⏰ Late filing attracts ₹50/day penalty (₹20 for NIL returns)',
            '✅ Input Tax Credit: Match with supplier filings before claiming',
            '🏦 Keep separate bank account for GST collections',
          ].map(t => (
            <div key={t} style={styles.tip}>{t}</div>
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
  
  calcForm: { 
    display: 'flex', 
    gap: 14, 
    flexWrap: 'wrap', 
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  field: { display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 150 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' },

  // ✅ NEW STYLES FOR RESULT BOX
  resultBox: {
    background: 'var(--gray-50)',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--r-lg)',
    padding: '16px',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
    marginBottom: 12,
  },
  resultItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '12px',
    background: '#fff',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--gray-200)',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--gray-600)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--navy)',
  },
  infoBox: {
    background: 'var(--ivory)',
    border: '1px solid var(--saffron-glow)',
    borderRadius: 'var(--r-md)',
    padding: '10px 12px',
  },

  slabList: { display: 'flex', flexDirection: 'column', gap: 8 },
  slabItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)',
  },
  slabRate: { fontSize: 20, fontWeight: 800, width: 48, flexShrink: 0 },
  slabItems: { fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 },
  
  deadlineList: { display: 'flex', flexDirection: 'column', gap: 10 },
  deadlineItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)',
    flexWrap: 'wrap',
  },
  formBadge: {
    background: 'var(--navy)', color: '#fff',
    padding: '4px 12px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  deadlineDesc: { fontSize: 13, color: 'var(--gray-600)' },
  deadlineDue: { fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginLeft: 'auto' },
  
  tipList: { display: 'flex', flexDirection: 'column', gap: 8 },
  tip: { fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.5 },
};
