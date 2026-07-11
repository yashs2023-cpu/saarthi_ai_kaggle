import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import geminiService from '../../../services/gemini';
import { useToast } from '../../../hooks/useToast';

const QUICK = [
  { icon: '🤖', label: 'AI Advisor',   path: '/business/ai',        color: '#1B365D', bg: '#F0F4F8' },
  { icon: '📊', label: 'Insights',     path: '/business/insights',  color: '#10B981', bg: '#ECFDF5' },
  { icon: '👥', label: 'Customers',    path: '/business/customers', color: '#6C63FF', bg: '#F5F3FF' },
  { icon: '🏛️', label: 'GST Guide',   path: '/business/gst',       color: '#F59E0B', bg: '#FFFBEB' },
  { icon: '🛡️', label: 'Scam Shield', path: '/scam-shield',        color: '#EF4444', bg: '#FEF2F2' },
];

const STATS = [
  { label: 'Revenue (Month)',  value: '₹2,45,000', change: '+15%', up: true,  icon: '💰' },
  { label: 'Profit Margin',   value: '32%',        change: '-2%',  up: false, icon: '📈' },
  { label: 'Active Customers',value: '48',         change: '+6',   up: true,  icon: '👥' },
  { label: 'YoY Growth',      value: '23%',        change: '+5%',  up: true,  icon: '🚀' },
];

export default function BusinessHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tip, setTip] = useState('Your profit margin dipped 2% this month. Consider reviewing raw material costs — bulk purchasing may reduce expenses by 8-12%. Talk to your AI Advisor for a detailed plan.');
  const [loadingTip, setLoadingTip] = useState(false);

  const refreshTip = async () => {
    setLoadingTip(true);
    try {
      const response = await geminiService.chat(
        [{ role: 'user', text: 'Give me one specific, actionable business tip for an Indian MSME owner in 2-3 sentences. Focus on growth, cost reduction, or digital marketing. Be direct and practical.' }],
        'You are a sharp Indian business consultant. Give crisp, specific, data-backed advice.',
        'en'
      );
      if (response) setTip(response);
      else showToast('Using cached tip', 'info');
    } catch { showToast('Could not refresh tip', 'error'); }
    finally { setLoadingTip(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.banner} className="anim-up">
        <div>
          <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Business Dashboard</p>
          <h1 style={styles.bannerTitle}>Namaste, <span style={{ color: 'var(--gold-light)' }}>{user?.name || 'Entrepreneur'}</span>!</h1>
          <p style={{ fontSize: 14, opacity: 0.75 }}>Powered by AI — let's grow your business today</p>
        </div>
        <div style={{ fontSize: 64 }}>💼</div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className="saarthi-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy-deep)', margin: '6px 0' }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)' }}>{s.up ? '▲' : '▼'} {s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={styles.sectionTitle}>Quick Access</h2>
        <div style={styles.quickGrid}>
          {QUICK.map(a => (
            <button key={a.label} style={{ ...styles.quickBtn, background: a.bg, borderColor: a.color + '30' }} onClick={() => navigate(a.path)}>
              <span style={{ fontSize: 26, color: a.color }}>{a.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Tip */}
      <div style={styles.aiTip}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 6 }}>
            AI Business Tip of the Day
            {loadingTip && <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 8 }}>refreshing…</span>}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.6 }}>{tip}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-sm" style={{ background: 'var(--business-primary)', color: '#fff', borderRadius: 'var(--r-full)' }} onClick={() => navigate('/business/ai')}>Ask AI →</button>
          <button className="btn btn-sm btn-ghost" style={{ borderRadius: 'var(--r-full)', fontSize: 11 }} onClick={refreshTip} disabled={loadingTip}>🔄 Refresh</button>
        </div>
      </div>

      {/* GST Deadline Alert */}
      <div style={styles.gstAlert}>
        <span style={{ fontSize: 24 }}>📅</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 3 }}>GST Filing Reminder</div>
          <div style={{ fontSize: 13, color: '#78350F' }}>GSTR-1 due by <strong>11th of next month</strong> · GSTR-3B due by <strong>20th of next month</strong> · Late filing penalty: ₹50/day</div>
        </div>
        <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', borderRadius: 'var(--r-full)', flexShrink: 0 }} onClick={() => navigate('/business/gst')}>File Now</button>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  banner: { background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%)', borderRadius: 'var(--r-2xl)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', boxShadow: 'var(--shadow-xl)' },
  bannerTitle: { fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', marginBottom: 6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 14 },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 },
  quickBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 12px', borderRadius: 'var(--r-lg)', border: '1.5px solid transparent', cursor: 'pointer', transition: 'var(--t-normal)' },
  aiTip: { background: 'linear-gradient(135deg, #F0F4F8, #E2E8F0)', border: '1.5px solid rgba(27,54,93,0.15)', borderRadius: 'var(--r-xl)', padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' },
  gstAlert: { background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '2px solid rgba(245,158,11,0.3)', borderRadius: 'var(--r-xl)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 },
};
