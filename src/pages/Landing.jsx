import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PERSONAS = [
  { key: 'amma',     avatar: '👩‍🍳', name: 'Amma Saarthi',     desc: 'Caring like family, guiding every day',  color: '#FF9933', bg: '#FFF8E7' },
  { key: 'student',  avatar: '👨‍🎓', name: 'Student Saarthi',   desc: 'Your AI buddy for learning & success',    color: '#6C63FF', bg: '#F5F3FF' },
  { key: 'senior',   avatar: '👴',   name: 'Senior Saarthi',    desc: 'Safe, simple & caring digital life',      color: '#0EA5E9', bg: '#F0F9FF' },
  { key: 'business', avatar: '👨‍💼', name: 'Business Saarthi',  desc: 'Smart growth for Indian entrepreneurs',   color: '#1B365D', bg: '#F0F4F8' },
];

const PROBLEMS = [
  { icon: '🎭', title: 'Digital Scams',      desc: 'Millions fall victim to UPI fraud, phishing & fake calls every year' },
  { icon: '📱', title: 'Digital Literacy',   desc: 'Complex technology leaves millions confused and left behind' },
  { icon: '🎓', title: 'Career Confusion',   desc: 'Students struggle to find the right path without guidance' },
  { icon: '🏛️', title: 'Scheme Awareness',  desc: 'Eligible citizens miss out on lakhs of rupees in government benefits' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Assistant',       desc: 'Gemini-powered responses in your language and context',   color: '#FF9933' },
  { icon: '🛡️', title: 'Scam Shield',        desc: 'Real-time SMS, WhatsApp & URL analysis',                  color: '#EF4444' },
  { icon: '🏛️', title: 'Government Schemes', desc: 'Discover and apply for benefits you deserve',              color: '#10B981' },
  { icon: '📚', title: 'Learning Hub',        desc: 'Personalized study plans and career guidance',             color: '#6C63FF' },
  { icon: '🎤', title: 'Voice Support',       desc: 'Talk naturally in Hindi, Tamil, Telugu & more',           color: '#0EA5E9' },
  { icon: '🌐', title: 'Works Offline',       desc: 'Core features work even with limited connectivity',       color: '#D4AF37' },
];

const TESTIMONIALS = [
  { quote: "Amma Saarthi helped me discover the PM-Kisan scheme. I received my ₹2,000 installment within weeks! The recipe planner is also my daily helper.", author: "Rajeswari Devi", role: "Homemaker, Bihar", avatar: "👩" },
  { quote: "The Student Saarthi career pathfinder and scholarship tracker is amazing. It found three scholarships I was eligible for and guided me on preparation.", author: "Aman Preet Singh", role: "B.Tech Student, Punjab", avatar: "🧑‍🎓" },
  { quote: "Since using Senior Saarthi, I feel much safer. The Scam Shield warning helps me avoid fake OTP calls and the big buttons are very easy to read.", author: "Devendra Prasad", role: "Retired Officer, UP", avatar: "👴" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isAuthenticated) navigate('/choose');
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.page} className="indian-art-bg">
      {/* ── Navbar ── */}
      <nav style={{
        ...styles.navbar,
        background: 'rgba(255,255,255,0.92)',
        boxShadow: '0 24px 70px rgba(15,23,42,0.08)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(15,23,42,0.07)',
      }}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.brandLogoContainer}>
              <svg viewBox="0 0 100 100" width="36" height="36" style={{ animation: 'chakra-spin 25s linear infinite' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="var(--primary)" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 41 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 41 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>
            <span style={styles.brandText}>Saarthi AI</span>
          </div>

          <div style={styles.navLinks}>
            {['Home', 'Features', 'How it Works', 'About Us', 'Contact'].map((link) => (
              <button
                key={link}
                style={styles.navLink}
                onClick={() => {
                  const ids = {
                    Home: null,
                    Features: 'features',
                    'How it Works': 'personas',
                    'About Us': 'testimonials',
                    Contact: 'footer',
                  };
                  const id = ids[link];
                  if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link}
              </button>
            ))}
          </div>

          <button className="btn btn-gold btn-sm" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroCircle3} />

        <div style={styles.heroContent} className="anim-up">
          <div style={styles.heroEyebrow}>AI Companion for Every Indian</div>
          <h1 style={styles.heroTitle}>Saarthi AI</h1>
          <p style={styles.heroDesc}>
            One AI companion. Four personalities. Endless possibilities for learning, health, business, and safety.
          </p>
          <div style={styles.heroCTAs}>
            <button className="btn btn-gold btn-lg" onClick={() => navigate('/login')}>
              Explore Saarthi
            </button>
            <button
              className="btn btn-outline btn-lg"
              style={{ color: 'var(--text-primary)', borderColor: 'rgba(15,23,42,0.12)' }}
              onClick={() => document.getElementById('personas')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Demo
            </button>
          </div>
          <div style={styles.heroTrust}>
            {['20+ Smart Features', '50K+ Happy Users', '95% Satisfaction', '24/7 AI Assistance'].map((item) => (
              <div key={item} style={styles.heroTrustItem}>{item}</div>
            ))}
          </div>
        </div>

        <div style={styles.heroVisual} className="anim-right">
          <div style={styles.heroPersonaGrid}>
            <div style={{ ...styles.heroPersonaCard, ...styles.heroPersonaCardAccent }}>
              <div style={styles.heroPersonaEmoji}>👩‍🍳</div>
              <div style={styles.heroPersonaName}>Amma Saarthi</div>
              <div style={styles.heroPersonaLabel}>Empowering Home Makers</div>
            </div>
            <div style={{ ...styles.heroPersonaCard, ...styles.heroPersonaCardAccent }}>
              <div style={styles.heroPersonaEmoji}>🎓</div>
              <div style={styles.heroPersonaName}>Student Saarthi</div>
              <div style={styles.heroPersonaLabel}>Guiding Future Leaders</div>
            </div>

            <div style={styles.heroCenterLogo}>
              <div style={styles.heroLogoShell}>
                <svg viewBox="0 0 100 100" width="52" height="52" style={{ animation: 'chakra-spin 25s linear infinite' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="3" />
                  <circle cx="50" cy="50" r="8" fill="var(--primary)" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 35 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 35 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="var(--primary)"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div style={styles.heroLogoText}>Saarthi AI</div>
              </div>
            </div>

            <div style={{ ...styles.heroPersonaCard, ...styles.heroPersonaCardAccent }}>
              <div style={styles.heroPersonaEmoji}>👴</div>
              <div style={styles.heroPersonaName}>Senior Saarthi</div>
              <div style={styles.heroPersonaLabel}>Caring for Our Elders</div>
            </div>
            <div style={{ ...styles.heroPersonaCard, ...styles.heroPersonaCardAccent }}>
              <div style={styles.heroPersonaEmoji}>💼</div>
              <div style={styles.heroPersonaName}>Business Saarthi</div>
              <div style={styles.heroPersonaLabel}>Growing Small Businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section style={styles.problemSection} className="jali-art-bg">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div className="badge badge-danger" style={{ fontSize: 13, marginBottom: 12, display: 'inline-flex' }}>The Challenge</div>
            <h2 style={styles.sectionTitle}>India's Digital Divide is Real</h2>
            <p style={styles.sectionDesc}>Millions of Indians face these challenges every single day</p>
          </div>
          <div style={styles.problemGrid}>
            {PROBLEMS.map((p, i) => (
              <div key={p.title} className={`saarthi-card anim-up anim-delay-${i + 1}`} style={styles.problemCard}>
                <div style={styles.problemIcon}>{p.icon}</div>
                <h3 style={styles.problemTitle}>{p.title}</h3>
                <p style={styles.problemDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Persona Showcase ── */}
      <section id="personas" style={styles.personaSection} className="lotus-art-bg">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div className="badge badge-saffron" style={{ fontSize: 13, marginBottom: 12, display: 'inline-flex' }}>Meet Your Saarthi</div>
            <h2 style={styles.sectionTitle}>Choose Your AI Companion</h2>
            <p style={styles.sectionDesc}>Each Saarthi is trained specifically for your needs</p>
          </div>
          <div style={styles.personaGrid}>
            {PERSONAS.map((p, i) => (
              <div
                key={p.key}
                className="saarthi-card-royal anim-up"
                style={{ ...styles.personaCard, animationDelay: `${(i + 1) * 0.1}s` }}
                onClick={() => navigate('/login')}
              >
                <div style={{ ...styles.personaCardAvatar, background: p.bg }}>
                  <span style={{ display: 'inline-block', transform: 'rotate(45deg)', color: p.color }}>
                    {p.avatar}
                  </span>
                </div>
                <h3 style={{ ...styles.personaCardName, color: p.color }}>{p.name}</h3>
                <p style={styles.personaCardDesc}>{p.desc}</p>
                <button
                  className="btn btn-sm"
                  style={{ marginTop: 16, background: p.color, color: '#fff', borderRadius: 'var(--r-full)' }}
                >
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={styles.featuresSection} className="jali-art-bg">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div className="badge badge-gold" style={{ fontSize: 13, marginBottom: 12, display: 'inline-flex' }}>Features</div>
            <h2 style={styles.sectionTitle}>Everything You Need</h2>
            <p style={styles.sectionDesc}>Powerful AI tools designed for real Indian needs</p>
          </div>
          <div style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`saarthi-card anim-up anim-delay-${(i % 3) + 1}`} style={styles.featureCard}>
                <div style={{ ...styles.featureIcon, background: f.color + '18', color: f.color }}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={styles.testimonialsSection} className="lotus-art-bg">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div className="badge badge-royal" style={{ fontSize: 13, marginBottom: 12, display: 'inline-flex' }}>Testimonials</div>
            <h2 style={styles.sectionTitle}>Loved Across Bharat</h2>
            <p style={styles.sectionDesc}>Hear from fellow citizens who transformed their digital lives with Saarthi</p>
          </div>
          <div style={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.author} className="saarthi-card-royal anim-up" style={{ ...styles.testimonialCard, animationDelay: `${(i + 1) * 0.15}s` }}>
                <p style={styles.testimonialQuote}>"{t.quote}"</p>
                <div style={styles.testimonialUser}>
                  <div style={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <h4 style={styles.testimonialName}>{t.author}</h4>
                    <p style={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>आपका Saarthi इंतज़ार कर रहा है</h2>
          <p style={styles.ctaDesc}>Join millions of Indians who trust Saarthi for their digital journey</p>
          <button className="btn btn-gold btn-lg" onClick={() => navigate('/login')}>
            <span style={{ fontWeight: 800 }}>🚀 Start for Free — No signup fees</span>
          </button>
        </div>
      </section>

      {/* ── Professional Footer ── */}
      <footer style={styles.footer}>
        <div style={styles.footerBody}>
          <div style={styles.footerGrid}>
            <div style={styles.footerBrandCol}>
              <div style={styles.footerLogo}>
                <div style={styles.footerIcon}>
                  <svg viewBox="0 0 100 100" width="32" height="32" style={{ animation: 'chakra-spin 25s linear infinite', flexShrink: 0 }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4" />
                    <circle cx="50" cy="50" r="8" fill="var(--primary)" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line key={i} x1="50" y1="50"
                        x2={50 + 41 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={50 + 41 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="var(--primary)" strokeWidth="2.5" />
                    ))}
                  </svg>
                </div>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 22, letterSpacing: '-0.3px' }}>Saarthi AI</span>
              </div>
              <p style={styles.footerTagline}>आपका डिजिटल साथी</p>
              <p style={styles.footerDesc}>India's first multi-agent AI platform built for Bharat — bridging the digital divide one conversation at a time.</p>
              <div style={styles.footerBadges}>
                <span style={styles.footerBadge}>🇮🇳 Made in India</span>
                <span style={styles.footerBadge}>🔒 Privacy First</span>
                <span style={styles.footerBadge}>⚡ Free Forever</span>
              </div>
            </div>

            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>AI Agents</h4>
              {[
                ['🏡', 'Amma Saarthi', 'For homemakers & mothers'],
                ['🎓', 'Student Saarthi', 'For students & graduates'],
                ['💼', 'Business Saarthi', 'For MSMEs & entrepreneurs'],
                ['🌟', 'Senior Saarthi', 'For elderly citizens'],
              ].map(([icon, name, desc]) => (
                <div key={name} style={styles.footerAgentItem} onClick={() => navigate('/login')}>
                  <span style={styles.footerAgentIcon}>{icon}</span>
                  <div>
                    <div style={styles.footerAgentName}>{name}</div>
                    <div style={styles.footerAgentDesc}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>Features</h4>
              {['🛡️ Scam Shield Protection', '🏛️ Government Schemes Guide', '📚 AI Study Notes', '🍳 Smart Recipe Generator', '🎤 Voice AI (6 languages)', '🧠 Memory & RAG System', '📊 Business Insights', '🆘 Senior SOS'].map(f => (
                <div key={f} style={styles.footerFeatureItem}>{f}</div>
              ))}
            </div>

            {/* Resources column */}
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>Technology</h4>
              {[
                ['⚡', 'Gemini 2.0 Flash', 'Google AI'],
                ['🔍', 'RAG System', 'Local Knowledge Base'],
                ['🧠', 'Agent Memory', 'Persistent Context'],
                ['🎤', 'Voice AI', 'Web Speech API'],
                ['🌐', 'Multilingual', '6 Indian Languages'],
                ['⚛️', 'React + Vite', 'Frontend'],
                ['🔐', 'Firebase Auth', 'Authentication'],
              ].map(([icon, name, sub]) => (
                <div key={name} style={styles.footerTechItem}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div style={styles.footerStats}>
            {[['4', 'AI Agents'], ['60+', 'Knowledge Chunks'], ['6', 'Languages'], ['100%', 'Free to Use'], ['0', 'Data Sold']].map(([num, label]) => (
              <div key={label} style={styles.footerStat}>
                <div style={styles.footerStatNum}>{num}</div>
                <div style={styles.footerStatLabel}>{label}</div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={styles.footerBottom}>
            <div style={styles.footerCopy}>
              © 2025–2026 Saarthi AI · Built with ❤️ for Bharat · Google Capstone Project
            </div>
            <div style={styles.footerLinks}>
              {['Privacy Policy', 'Terms of Use', 'Contact Us', 'GitHub'].map(l => (
                <span key={l} style={styles.footerLink}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: 'var(--ivory)', minHeight: '100vh', position: 'relative' },
  navbar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, transition: 'all 0.3s ease', padding: '0 24px' },
  navInner: { maxWidth: 1280, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBrand: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  brandLogoContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandText: { fontSize: 20, fontWeight: 800, color: 'var(--royal-maroon)', letterSpacing: '0.5px' },
  navActions: { display: 'flex', alignItems: 'center', gap: 12 },
  navLogin: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--royal-maroon)', padding: '8px 16px' },
  navLinks: { display: 'flex', gap: 22, alignItems: 'center' },
  navLink: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, padding: '8px 10px', borderRadius: '999px', transition: 'background 0.2s' },
  hero: { minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center', padding: '100px 24px 80px', maxWidth: 1280, margin: '0 auto', gap: 48, position: 'relative', overflow: 'hidden' },
  heroEyebrow: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: '999px', background: 'rgba(255,209,135,0.22)', color: 'var(--primary-dark)', fontSize: 13, fontWeight: 700, marginBottom: 18, letterSpacing: '0.02em' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: 640 },
  heroTitle: { fontSize: 'clamp(3rem, 5vw, 4.25rem)', fontWeight: 900, lineHeight: 1.02, color: 'var(--text-primary)', marginBottom: 24 },
  heroDesc: { fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32, maxWidth: 520 },
  heroCTAs: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 },
  heroTrust: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 12, maxWidth: 520 },
  heroTrustItem: { background: '#fff', borderRadius: '22px', padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)', boxShadow: '0 18px 50px rgba(15,23,42,0.06)', border: '1px solid rgba(15,23,42,0.08)' },
  heroVisual: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 520, maxWidth: 520 },
  heroPersonaGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 },
  heroPersonaCard: { background: '#fff', borderRadius: '28px', padding: '26px 22px', display: 'grid', gap: 12, boxShadow: '0 24px 60px rgba(15,23,42,0.08)', border: '1px solid rgba(15,23,42,0.08)' },
  heroPersonaCardAccent: { background: 'linear-gradient(180deg, #fff 0%, #fdf7ef 100%)' },
  heroPersonaEmoji: { width: 52, height: 52, borderRadius: 18, display: 'grid', placeItems: 'center', fontSize: 26, background: 'rgba(255,138,0,0.12)' },
  heroPersonaName: { fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' },
  heroPersonaLabel: { fontSize: 13, color: 'var(--text-secondary)' },
  heroCenterLogo: { position: 'absolute', inset: '50% auto auto 50%', transform: 'translate(-50%, -50%)', zIndex: 2 },
  heroLogoShell: { width: 180, minHeight: 180, borderRadius: '40px', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 28px 80px rgba(15,23,42,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  heroLogoText: { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' },
  heroCard: { background: '#fff', borderRadius: 'var(--r-2xl)', padding: 24, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-100)' },
  heroCardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative' },
  heroCardAvatar: { width: 40, height: 40, borderRadius: 12, background: 'var(--amma-bg)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', position: 'absolute', top: 2, right: 2 },
  heroChatBubble: { background: 'var(--gray-50)', borderRadius: '16px 16px 16px 4px', padding: '12px 14px', fontSize: 13, lineHeight: 1.5, marginBottom: 8, color: 'var(--gray-700)', border: '1px solid var(--gray-200)' },
  heroChatBubbleUser: { background: 'linear-gradient(135deg, var(--royal-maroon), var(--royal-burgundy))', borderRadius: '16px 16px 4px 16px', padding: '12px 14px', fontSize: 13, color: '#fff', lineHeight: 1.5, marginBottom: 8, textAlign: 'right' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 24px' },
  sectionHeader: { textAlign: 'center', marginBottom: 56 },
  sectionTitle: { fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 12 },
  sectionDesc: { fontSize: 16, color: 'var(--gray-500)', maxWidth: 480, margin: '0 auto' },
  problemSection: { padding: '80px 0', background: '#fff', position: 'relative' },
  problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 },
  problemCard: { textAlign: 'center', cursor: 'default' },
  problemIcon: { fontSize: 40, marginBottom: 12 },
  problemTitle: { fontSize: 18, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8 },
  problemDesc: { fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 },
  personaSection: { padding: '80px 0', background: 'var(--ivory)', position: 'relative' },
  personaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 },
  personaCard: {
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'var(--t-normal)',
    borderRadius: '40px 40px 16px 16px',
    background: '#fff',
    overflow: 'hidden',
  },
  personaCardAvatar: {
    width: 80,
    height: 80,
    borderRadius: '50% 50% 0 50%',
    transform: 'rotate(-45deg)',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--gold)',
    boxShadow: 'var(--shadow-gold)',
  },
  personaCardName: { fontSize: 18, fontWeight: 700, marginBottom: 8 },
  personaCardDesc: { fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 },
  featuresSection: { padding: '80px 0', background: '#fff', position: 'relative' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  featureCard: { cursor: 'default' },
  featureIcon: { width: 52, height: 52, borderRadius: 14, fontSize: 24, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8 },
  featureDesc: { fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 },
  testimonialsSection: { padding: '80px 0', background: 'var(--ivory-warm)', position: 'relative' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' },
  testimonialCard: { background: '#fff', padding: 32, borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)', transition: 'var(--t-normal)' },
  testimonialQuote: { fontSize: 15, fontStyle: 'italic', color: 'var(--gray-700)', marginBottom: 20, lineHeight: 1.6 },
  testimonialUser: { display: 'flex', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  testimonialName: { fontSize: 15, fontWeight: 700, color: 'var(--navy-deep)' },
  testimonialRole: { fontSize: 12, color: 'var(--gray-500)' },
  ctaSection: { padding: '100px 24px', background: 'linear-gradient(135deg, var(--royal-maroon) 0%, var(--royal-burgundy) 50%, var(--peacock-deep) 100%)', textAlign: 'center', borderTop: '4px solid var(--gold)' },
  ctaContent: { maxWidth: 600, margin: '0 auto' },
  ctaTitle: { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', marginBottom: 16 },
  ctaDesc: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32 },
  footer: { background: 'var(--royal-burgundy)', borderTop: '2px solid var(--gold)' },
  tricolorBar: { display: 'flex', height: 4 },
  footerBody: { maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px' },
  footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 },
  footerBrandCol: { maxWidth: 280 },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  footerTagline: { fontSize: 15, color: 'var(--gold)', fontWeight: 600, marginBottom: 10 },
  footerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 18 },
  footerBadges: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  footerBadge: { fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 'var(--r-full)', fontWeight: 600 },
  footerCol: {},
  footerColTitle: { fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  footerAgentItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, transition: 'background 0.15s' },
  footerAgentIcon: { fontSize: 20, flexShrink: 0 },
  footerAgentName: { fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' },
  footerAgentDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  footerFeatureItem: { fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginBottom: 9, lineHeight: 1.4 },
  footerTechItem: { display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  footerStats: { display: 'flex', justifyContent: 'space-around', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  footerStat: { textAlign: 'center' },
  footerStatNum: { fontSize: 26, fontWeight: 800, color: 'var(--gold)' },
  footerStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginTop: 2 },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  footerCopy: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  footerLinks: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  footerLink: { fontSize: 12, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'color 0.15s' },
};
