import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { useLanguage } from '../../../contexts/LanguageContext';
import voiceService from '../../../services/voice';

// ── Eligibility wizard options ──────────────────────────────────────────────
const CRITERIA = {
  income: ['BPL (Below Poverty Line)', 'Low Income', 'Middle Income', 'Any Income'],
  gender: ['Women', 'Men', 'Any'],
  occupation: ['Farmer', 'Labourer', 'Self-employed', 'Any'],
  state: ['Rural', 'Urban', 'Any'],
};

const SCHEME_TAGS = {
  agriculture: { color: '#10B981', bg: '#ECFDF5' },
  health:      { color: '#EF4444', bg: '#FEF2F2' },
  employment:  { color: '#F59E0B', bg: '#FFFBEB' },
  women:       { color: '#D4547A', bg: '#FFF0F5' },
  housing:     { color: '#6C63FF', bg: '#F5F3FF' },
  energy:      { color: '#FF9933', bg: '#FFF8E7' },
};

export default function AmmaSchemes() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [criteria, setCriteria] = useState({ income: 'Any Income', gender: 'Any', occupation: 'Any', state: 'Any' });
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('saarthi_saved_schemes') || '[]'); } catch { return []; } });
  const [activeTab, setActiveTab] = useState('browse'); // browse | saved
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const sT = t?.schemes || {};
   

  const saveScheme = (scheme) => {
    const name = scheme.name;
    const isAlready = saved.some(s => s.id === scheme.id);
    const updated = isAlready ? saved.filter(s => s.id !== scheme.id) : [...saved, scheme];
    setSaved(updated);
    localStorage.setItem('saarthi_saved_schemes', JSON.stringify(updated));
    showToast(isAlready ? 'Removed from saved schemes' : `✅ "${name}" saved!`, 'success');
  };

  const isSaved = (id) => saved.some(s => s.id === id);

  const handleListen = (scheme) => {
    // Use language-specific fields
    const nameKey = `${language}_name`;
    const benefitKey = `${language}_benefit`;
    const descKey = `${language}_description`;
    const eligKey = `${language}_eligibility`;
    const docsKey = `${language}_documents`;

    const name = scheme[nameKey] || scheme.name;
    const benefit = scheme[benefitKey] || scheme.benefit;
    const description = scheme[descKey] || scheme.description;
    const eligibility = scheme[eligKey] || scheme.eligibility;
    const documents = scheme[docsKey] || scheme.documents;

    const textToSpeak = `${name}. Benefits: ${benefit}. ${description}. Eligibility: ${eligibility}. Required documents are: ${documents.join(', ')}.`;
    showToast(`Listening to ${name}… 🔊`, 'info');
    voiceService.speak(textToSpeak, language, 'amma');
  };
  const currentSchemes = sT.defaultMock || [];
  const displaySchemes = activeTab === 'saved' ? saved : currentSchemes.filter((s) => {
    const matchCat = category === 'all' || s.category === category;
    const nameKey = `${language}_name`;
    const schemeName = s[nameKey] || s.name;
    const matchSearch = !search || schemeName.toLowerCase().includes(search.toLowerCase());
    // Criteria filtering
    const matchIncome = criteria.income === 'Any Income' || (criteria.income === 'BPL (Below Poverty Line)' && (s.eligibility?.toLowerCase().includes('bpl') || s.eligibility?.toLowerCase().includes('below poverty'))) || criteria.income !== 'BPL (Below Poverty Line)';
    const matchGender = criteria.gender === 'Any' || (criteria.gender === 'Women' && s.category === 'women') || criteria.gender !== 'Women';
    const matchOcc = criteria.occupation === 'Any' || (criteria.occupation === 'Farmer' && s.category === 'agriculture') || criteria.occupation !== 'Farmer';
    return matchCat && matchSearch && matchIncome && matchGender && matchOcc;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={styles.title}>{sT.title || '🏛️ Government Schemes'}</h1>
          <p style={styles.subtitle}>{sT.subtitle || 'Find schemes you are eligible for'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['browse', '🏛️ All Schemes'], ['saved', `🔖 Saved (${saved.length})`]].map(([key, label]) => (
            <button key={key} style={{ ...styles.tabBtn, background: activeTab === key ? 'var(--saffron)' : '#fff', color: activeTab === key ? '#fff' : 'var(--gray-700)', borderColor: activeTab === key ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
          <button style={{ ...styles.tabBtn, background: showFilter ? '#6C63FF' : '#fff', color: showFilter ? '#fff' : 'var(--gray-700)', borderColor: showFilter ? '#6C63FF' : 'var(--gray-200)' }} onClick={() => setShowFilter(!showFilter)}>
            🎯 {showFilter ? 'Hide Filter' : 'Eligibility Filter'}
          </button>
        </div>
      </div>

      {/* Eligibility Wizard */}
      {showFilter && (
        <div style={styles.wizardCard} className="anim-up">
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎯</span> Filter Schemes by Your Eligibility
          </div>
          <div style={styles.wizardGrid}>
            {Object.entries(CRITERIA).map(([key, options]) => (
              <div key={key}>
                <div style={styles.wizardLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div style={styles.optionRow}>
                  {options.map(opt => (
                    <button key={opt} style={{ ...styles.optionBtn, background: criteria[key] === opt ? 'var(--saffron)' : '#fff', color: criteria[key] === opt ? '#fff' : 'var(--gray-700)', borderColor: criteria[key] === opt ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setCriteria(prev => ({ ...prev, [key]: opt }))}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ borderRadius: 'var(--r-full)' }} onClick={() => { setShowFilter(false); showToast(`Showing schemes matching your criteria ✅`, 'success'); }}>Apply Filter</button>
            <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => setCriteria({ income: 'Any Income', gender: 'Any', occupation: 'Any', state: 'Any' })}>Reset</button>
          </div>
        </div>
      )}

      {/* Search */}
      {activeTab === 'browse' && (
        <input className="saarthi-input" placeholder={`🔍 ${sT.searchPlaceholder || 'Search schemes...'}`} value={search} onChange={e => setSearch(e.target.value)} />
      )}

      {/* Category filters */}
      {activeTab === 'browse' && (
        <div style={styles.filters}>
          {[
            { key: 'all', label: sT.cats?.all || '🏛️ All' },
            { key: 'agriculture', label: sT.cats?.agriculture || '🌾 Agriculture' },
            { key: 'health', label: sT.cats?.health || '🏥 Health' },
            { key: 'employment', label: sT.cats?.employment || '👷 Employment' },
            { key: 'women', label: sT.cats?.women || '👩 Women' },
            { key: 'housing', label: sT.cats?.housing || '🏠 Housing' },
            { key: 'energy', label: sT.cats?.energy || '🔥 Energy' },
          ].map(c => (
            <button key={c.key} style={{ ...styles.filterBtn, background: category === c.key ? 'var(--saffron)' : '#fff', color: category === c.key ? '#fff' : 'var(--gray-700)', borderColor: category === c.key ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setCategory(c.key)}>{c.label}</button>
          ))}
        </div>
      )}

      {/* Count */}
      <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>
        Showing {displaySchemes.length} schemes {activeTab === 'saved' ? 'saved' : 'matching your criteria'}
      </div>

      {/* Schemes list */}
      <div style={styles.schemesList}>
        {displaySchemes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 24px', background: '#fff', borderRadius: 'var(--r-xl)', border: '1px dashed var(--gray-200)' }}>
            <div style={{ fontSize: 48 }}>🔖</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-600)', marginTop: 8 }}>{activeTab === 'saved' ? 'No saved schemes yet' : 'No schemes match your criteria'}</div>
          </div>
        )}
        {displaySchemes.map(s => {
          const nameKey = `${language}_name`;
          const benefitKey = `${language}_benefit`;
          const descKey = `${language}_description`;
          const eligKey = `${language}_eligibility`;
          const howKey = `${language}_howToApply`;
          const docsKey = `${language}_documents`;
          const deadKey = `${language}_deadline`;
          const tagKey = `${language}_tag`;
          const tagStyle = SCHEME_TAGS[s.category] || { color: 'var(--saffron)', bg: 'var(--ivory)' };

          return (
            <div key={s.id} className="saarthi-card" style={{ ...styles.schemeCard, borderLeft: `4px solid ${tagStyle.color}` }}>
              <div style={styles.schemeHeader} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div style={styles.schemeLeft}>
                  <div style={{ ...styles.schemeIconBadge, background: tagStyle.bg, color: tagStyle.color }}>{s.icon}</div>
                  <div>
                    <div style={styles.schemeName}>{s[nameKey] || s.name}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ ...styles.schemeTagBadge, background: tagStyle.bg, color: tagStyle.color }}>{s[tagKey] || s.tag}</span>
                      <span style={styles.schemeBenefit}>{s[benefitKey] || s.benefit}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: isSaved(s.id) ? '#F59E0B' : 'var(--gray-300)', padding: 4 }} onClick={e => { e.stopPropagation(); saveScheme(s); }} title="Save scheme">🔖</button>
                  <span style={{ fontSize: 16, color: 'var(--gray-400)' }}>{expanded === s.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === s.id && (
                <div style={styles.schemeDetails} className="anim-up">
                  <p style={styles.schemeDesc}>{s[descKey] || s.description}</p>
                  <div style={styles.detailGrid}>
                    {[
                      { label: `✓ ${sT.eligibility || 'Eligibility'}`, value: s[eligKey] || s.eligibility },
                      { label: `📋 ${sT.howToApply || 'How to Apply'}`, value: s[howKey] || s.howToApply },
                      { label: `📅 ${sT.deadline || 'Deadline'}`, value: s[deadKey] || s.deadline },
                      { label: `📄 ${sT.documents || 'Documents'}`, value: (s[docsKey] || s.documents || []).join(' · ') },
                    ].map(item => (
                      <div key={item.label} style={styles.detailItem}>
                        <span style={styles.detailLabel}>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.actions}>
                    <button className="btn btn-sm" style={{ background: tagStyle.color, color: '#fff', borderRadius: 'var(--r-full)' }} onClick={() => window.open(s.applicationUrl, '_blank')}>📝 {sT.applyNow || 'Apply Now'}</button>
                    <button className="btn btn-sm btn-primary" onClick={() => handleListen(s)}>🔊 {sT.listen || 'Listen'}</button>
                    <button className="btn btn-sm" style={{ background: isSaved(s.id) ? '#FFFBEB' : '#fff', color: isSaved(s.id) ? '#F59E0B' : 'var(--gray-600)', border: `1px solid ${isSaved(s.id) ? '#FDE68A' : 'var(--gray-200)'}`, borderRadius: 'var(--r-full)' }} onClick={() => saveScheme(s)}>{isSaved(s.id) ? '🔖 Saved' : '🔖 Save'}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)' },
  tabBtn: { padding: '8px 16px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--t-fast)' },
  wizardCard: { background: '#fff', border: '1.5px solid var(--saffron-glow)', borderRadius: 'var(--r-xl)', padding: 20, boxShadow: 'var(--shadow-sm)' },
  wizardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 },
  wizardLabel: { fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  optionBtn: { padding: '5px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--t-fast)' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--t-fast)' },
  schemesList: { display: 'flex', flexDirection: 'column', gap: 12 },
  schemeCard: { cursor: 'pointer' },
  schemeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  schemeLeft: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  schemeIconBadge: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  schemeName: { fontSize: 15, fontWeight: 700, color: 'var(--navy-deep)' },
  schemeTagBadge: { padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 11, fontWeight: 700 },
  schemeBenefit: { fontSize: 13, fontWeight: 700, color: 'var(--saffron)' },
  schemeDetails: { marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' },
  schemeDesc: { fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 14 },
  detailGrid: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--gray-700)' },
  detailLabel: { fontWeight: 700, color: 'var(--gray-500)', fontSize: 11, textTransform: 'uppercase', marginBottom: 2 },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
};