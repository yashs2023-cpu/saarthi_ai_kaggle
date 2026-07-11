import React, { useState } from 'react';
import geminiService from '../../../services/gemini';
import { useToast } from '../../../hooks/useToast';

const MONTHLY = [
  { month: 'Jan', rev: 185000, exp: 120000 }, { month: 'Feb', rev: 200000, exp: 130000 },
  { month: 'Mar', rev: 220000, exp: 135000 }, { month: 'Apr', rev: 210000, exp: 140000 },
  { month: 'May', rev: 235000, exp: 145000 }, { month: 'Jun', rev: 245000, exp: 150000 },
];
const MAX = Math.max(...MONTHLY.map(m => m.rev));

const EXPENSES = [
  { category: 'Raw Material', amount: '₹60,000', pct: 40, color: '#6C63FF' },
  { category: 'Salaries',     amount: '₹45,000', pct: 30, color: '#10B981' },
  { category: 'Rent',         amount: '₹15,000', pct: 10, color: '#F59E0B' },
  { category: 'Utilities',    amount: '₹12,000', pct: 8,  color: '#EF4444' },
  { category: 'Marketing',    amount: '₹10,000', pct: 7,  color: '#0EA5E9' },
  { category: 'Misc',         amount: '₹8,000',  pct: 5,  color: '#FF9933' },
];

export default function BusinessInsights() {
  const [revenue, setRevenue] = useState('');
  const [expenses, setExpenses] = useState('');
  const [customers, setCustomers] = useState('');
  const [businessType, setBusinessType] = useState('Retail Shop');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const generateInsights = async () => {
    setLoading(true);
    showToast('🤖 Analysing your business data…', 'info');
    try {
      const prompt = `Analyse this Indian ${businessType} business data and give actionable insights:
Revenue: ₹${revenue || '2,45,000'}/month
Expenses: ₹${expenses || '1,50,000'}/month  
Customers: ${customers || '48'} active
Profit: ₹${(parseInt((revenue || '245000').replace(/,/g, '')) - parseInt((expenses || '150000').replace(/,/g, ''))).toLocaleString('en-IN') || '95,000'}/month

Give 4 specific insights and 3 actionable recommendations. Be direct, use Indian business context, include specific numbers.`;

      const response = await geminiService.chat(
        [{ role: 'user', text: prompt }],
        'You are a sharp Indian business analyst. Give specific, data-driven insights for MSMEs.',
        'en'
      );
      setInsights(response || getDefaultInsights());
      showToast('✅ Insights generated!', 'success');
    } catch { setInsights(getDefaultInsights()); showToast('Using offline analysis', 'info'); }
    finally { setLoading(false); }
  };

  const getDefaultInsights = () => `**Revenue Analysis**\nRevenue grew 15% this month — strong momentum. Top driver appears to be repeat customer orders.

**Profit Warning**\nProfit margin at 32% is below healthy 40% benchmark for retail. Raw material costs (40% of expenses) are the main drag — negotiate bulk purchase deals.

**Customer Opportunity**\nWith 48 active customers, focus on retention first. A 5% improvement in retention increases profit by 25-95% — cheaper than acquiring new customers.

**Cash Flow**\nCurrent burn rate suggests 1.6 months runway. Build emergency reserve of ₹2L to cover 2 months of operating costs.

**Recommendations**\n1. Negotiate 15-day payment terms with suppliers to improve cash flow\n2. Launch WhatsApp loyalty program — costs ₹0, can boost repeat orders by 20%\n3. Apply for PM Mudra Yojana loan (up to ₹10L) to fund bulk inventory purchase`;

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>Business Insights 📊</h1>
        <p style={styles.subtitle}>Enter your numbers to get AI-powered analysis</p>
      </div>

      {/* Input panel */}
      <div className="saarthi-card" style={{ background: 'linear-gradient(135deg, #F0F4F8, #E2E8F0)' }}>
        <h3 style={styles.cardTitle}>🔢 Your Business Data</h3>
        <div style={styles.inputGrid}>
          <div style={styles.field}><label style={styles.label}>Business Type</label>
            <select className="saarthi-input" value={businessType} onChange={e => setBusinessType(e.target.value)}>
              {['Retail Shop', 'Restaurant/Food', 'Manufacturing', 'Service Business', 'E-commerce', 'Wholesale'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.field}><label style={styles.label}>Monthly Revenue (₹)</label><input className="saarthi-input" placeholder="e.g. 2,45,000" value={revenue} onChange={e => setRevenue(e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Monthly Expenses (₹)</label><input className="saarthi-input" placeholder="e.g. 1,50,000" value={expenses} onChange={e => setExpenses(e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Active Customers</label><input className="saarthi-input" placeholder="e.g. 48" value={customers} onChange={e => setCustomers(e.target.value)} /></div>
        </div>
        <button className="btn btn-navy" style={{ borderRadius: 'var(--r-full)', marginTop: 14, opacity: loading ? 0.6 : 1 }} onClick={generateInsights} disabled={loading}>
          {loading ? '⏳ Analysing…' : '🤖 Generate AI Insights'}
        </button>
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="saarthi-card" style={{ border: '2px solid var(--navy)' }}>
          <h3 style={{ ...styles.cardTitle, color: 'var(--navy-deep)', marginBottom: 12 }}>🤖 AI Analysis</h3>
          <div style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: insights.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--navy-deep)">$1</strong>').replace(/\n/g, '<br/>') }} />
        </div>
      )}

      {/* Revenue chart */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>Monthly Revenue vs Expenses</h3>
        <div style={styles.chart}>
          {MONTHLY.map(m => (
            <div key={m.month} style={styles.barGroup}>
              <div style={styles.bars}>
                <div style={{ ...styles.bar, height: `${(m.rev / MAX) * 140}px`, background: 'var(--business-primary)' }} title={`Revenue: ₹${m.rev.toLocaleString('en-IN')}`} />
                <div style={{ ...styles.bar, height: `${(m.exp / MAX) * 140}px`, background: 'var(--gold)' }} title={`Expenses: ₹${m.exp.toLocaleString('en-IN')}`} />
              </div>
              <span style={styles.barLabel}>{m.month}</span>
            </div>
          ))}
        </div>
        <div style={styles.legend}>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: 'var(--business-primary)' }} /> Revenue</span>
          <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: 'var(--gold)' }} /> Expenses</span>
        </div>
      </div>

      {/* Expense breakdown */}
      <div className="saarthi-card">
        <h3 style={styles.cardTitle}>Expense Breakdown (Sample)</h3>
        <div style={styles.expenseList}>
          {EXPENSES.map(e => (
            <div key={e.category} style={styles.expenseRow}>
              <span style={styles.expCat}>{e.category}</span>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${e.pct}%`, background: e.color }} /></div>
              <span style={styles.expPct}>{e.pct}%</span>
              <span style={styles.expAmt}>{e.amount}</span>
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
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 16 },
  inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' },
  chart: { display: 'flex', gap: 16, alignItems: 'flex-end', height: 180, justifyContent: 'space-around', marginBottom: 12 },
  barGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 },
  bars: { display: 'flex', gap: 3, alignItems: 'flex-end' },
  bar: { width: 16, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', minHeight: 4 },
  barLabel: { fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 },
  legend: { display: 'flex', gap: 16, justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-600)' },
  legendDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  expenseList: { display: 'flex', flexDirection: 'column', gap: 10 },
  expenseRow: { display: 'flex', alignItems: 'center', gap: 10 },
  expCat: { fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', width: 110, flexShrink: 0 },
  progressBar: { flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  expPct: { fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', width: 30, textAlign: 'right' },
  expAmt: { fontSize: 12, fontWeight: 700, color: 'var(--navy-deep)', width: 70, textAlign: 'right' },
};
