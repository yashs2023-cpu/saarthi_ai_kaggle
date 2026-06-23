// ─── Senior Citizen Agent Knowledge Base ─────────────────────────────────────

const seniorKnowledge = [
  // ── Pension & Benefits ──
  {
    id: 'sen_001',
    tags: ['pension', 'epf', 'eps', 'retirement', 'provident-fund', 'pf'],
    content: `EPF Pension (EPS-95): If you worked in a company that deducted PF, you get monthly pension after age 58. Check pension status at unifiedportal-mem.epfindia.gov.in or call EPFO helpline 1800-118-005 (free). Minimum pension: ₹1,000/month. To withdraw: Submit Form 10D at EPFO office. Bring: UAN number, Aadhaar, bank passbook, cancelled cheque. If employer closed, apply for pension claim with service certificate.`,
  },
  {
    id: 'sen_002',
    tags: ['ignoaps', 'old-age-pension', 'state-pension', 'monthly', 'income'],
    content: `Old Age Pension Schemes: Indira Gandhi National Old Age Pension (IGNOAPS): ₹200-500/month from central government for 60+ BPL citizens. State governments add extra. Total varies: ₹500-3,000/month depending on state. Apply at nearest Gram Panchayat (rural) or Ward Office (urban). Documents: Aadhaar, age proof, BPL card or income certificate, bank account. Delhi: ₹2,500/month for 60+. Maharashtra: ₹600/month. Check your state government website for current rates.`,
  },
  {
    id: 'sen_003',
    tags: ['scss', 'savings', 'post-office', 'bank', 'fd', 'interest', 'deposit'],
    content: `Senior Citizen Savings Scheme (SCSS): 8.2% interest (highest safe investment for seniors). Available at Post Office and authorized banks. Max investment: ₹30 lakh. Tenure: 5 years (extendable by 3 years). Interest paid quarterly. Premature withdrawal: allowed after 1 year with penalty. Also try: PM Vaya Vandana Yojana (PMVVY) - guaranteed 7.4% pension for 10 years from LIC. Tax benefit: ₹1.5 lakh deduction under 80C. Senior citizens get extra 0.25-0.50% interest on regular FDs too.`,
  },
  {
    id: 'sen_004',
    tags: ['ayushman', 'health', 'hospital', 'treatment', 'free', 'insurance'],
    content: `Ayushman Bharat for Senior Citizens: From October 2024, all senior citizens aged 70+ are covered under Ayushman Bharat regardless of income. ₹5 lakh health insurance per year. Covers 1,900+ medical procedures. No premium to pay. Get Ayushman card at nearest Ayushman center, Common Service Centre, or ayushmanbharat.pmjay.gov.in. ABHA (Health ID) links all your health records digitally. Always show Ayushman card before hospital admission to avoid bills.`,
  },
  {
    id: 'sen_005',
    tags: ['bus', 'train', 'travel', 'railway', 'concession', 'discount'],
    content: `Travel Concessions for Senior Citizens: Indian Railways: 40% discount for men 60+, 50% for women 58+. Book at IRCTC online or railway counter. Show age proof. Some trains like Rajdhani give 40% discount. State bus concessions: Most states give 50% to 100% free bus travel for 60+ citizens. Get Senior Citizen card from State Transport Authority (STO) or Municipal office. Air travel: Most airlines give 5-10% discount for 60+ - book directly on airline website and select senior citizen fare.`,
  },

  // ── Health ──
  {
    id: 'sen_006',
    tags: ['medicine', 'tablet', 'blood-pressure', 'diabetes', 'heart', 'health'],
    content: `Common Senior Health Issues: Blood Pressure: Check weekly at home. Normal: below 120/80. High BP above 140/90 needs medication. Diabetes: Check blood sugar monthly. Fasting normal: 70-110 mg/dL. Take medicines at same time daily - never miss dose. Arthritis: Morning walk, warm water exercises, avoid stairs when knees hurt. Eyes: Annual eye checkup. Glaucoma and cataract are common after 60. Cataract surgery is free at government hospitals. Teeth: Visit dentist yearly. Government hospitals offer free dental services. Hearing: Hearing loss is common - get hearing aid if needed, often subsidized under ADIP scheme.`,
  },
  {
    id: 'sen_007',
    tags: ['emergency', 'hospital', 'ambulance', '108', 'doctor', 'urgent'],
    content: `Medical Emergency Numbers: 108 - Free ambulance anywhere in India (24 hours). 104 - Medical helpline, free teleconsultation. 1860-500-4104 - AIIMS Delhi appointment. For heart attack: Chew aspirin (if not allergic) and call 108 immediately. Signs of stroke (FAST test): Face drooping, Arm weakness, Speech difficulty, Time to call 108. Falls prevention: Remove loose rugs, install grab bars in bathroom, use night light. Keep doctor's number, nearest hospital address, blood group written on paper near bed. Always keep 7-day medicine supply.`,
  },
  {
    id: 'sen_008',
    tags: ['yoga', 'exercise', 'walk', 'fitness', 'aging', 'health-tips'],
    content: `Exercise & Wellness for Seniors: 30 minutes walking daily reduces risk of heart disease by 35% and improves mood. Safe exercises for seniors: 1) Chair yoga 2) Swimming 3) Light cycling 4) Pranayama (deep breathing) 5) Balance exercises. Avoid: Heavy weightlifting, running on hard surface, high-impact aerobics. Free Yoga: Doordarshan and All India Radio broadcast morning yoga. PM Yoga Abhiyan: Free yoga classes at parks nationwide. Diet: Reduce salt (BP), sugar (diabetes), fried food. Increase fiber (vegetables, dal), calcium (milk, ragi), protein (eggs, fish, dal). Drink 6-8 glasses water daily.`,
  },

  // ── Digital Safety ──
  {
    id: 'sen_009',
    tags: ['scam', 'fraud', 'otp', 'phone-call', 'bank', 'safe', 'protect'],
    content: `Scam Protection for Senior Citizens: Most common scams targeting seniors: 1) BANK KYC SCAM: "Your account will be blocked, share OTP" - HANG UP, banks never call like this 2) LOTTERY SCAM: "You won ₹50 lakh, pay ₹5,000 tax first" - 100% fake 3) GRANDCHILD SCAM: "Beta/Beti has accident, send money immediately" - Call your child directly first 4) FAKE POLICE CALL: Police never demand money over phone 5) INVESTMENT SCAM: Guaranteed 20% returns per month does not exist. Rule: If someone calls asking for money or OTP - ALWAYS say "I will call you back on official number" and HANG UP. Your real bank number is on the back of your ATM card.`,
  },
  {
    id: 'sen_010',
    tags: ['smartphone', 'whatsapp', 'video-call', 'mobile', 'technology', 'digital'],
    content: `Simple Smartphone Guide for Seniors: Making WhatsApp Video Call: 1) Open WhatsApp 2) Tap on contact name 3) Tap video camera icon 4) Wait for them to answer. Sending message: 1) Tap contact 2) Tap text box at bottom 3) Type message 4) Tap green arrow. Sending voice message: Tap and hold microphone icon, speak, release. Sharing photo: Tap paperclip icon → Gallery → Choose photo → Tap send. Increasing text size: Settings → Display → Font size → Large. Most important: Never tap on links in unknown messages. Never download apps from WhatsApp links. Only download from Google Play Store.`,
  },
  {
    id: 'sen_011',
    tags: ['family', 'lonely', 'connect', 'social', 'community', 'friends'],
    content: `Staying Connected and Avoiding Loneliness: Studies show loneliness is as harmful as smoking 15 cigarettes/day. Activities: 1) Join Senior Citizen Club at nearest park (most cities have free morning groups) 2) Participate in temple/religious community activities 3) Teach young people your skills - many NGOs run programs 4) Online senior communities: SeniorWorld.in, SeniorBridge.co.in 5) HelpAge India (helpageindia.org): 1800-180-1253 - free helpline for seniors. Many city municipal corporations run Day Care Centers for seniors - free or nominal cost. Volunteering is proven to improve both mental and physical health in seniors.`,
  },

  // ── Legal Rights ──
  {
    id: 'sen_012',
    tags: ['rights', 'law', 'maintenance', 'property', 'family', 'abuse'],
    content: `Legal Rights of Senior Citizens: Maintenance and Welfare of Parents and Senior Citizens Act 2007: Your adult children are legally obligated to maintain you. Tribunal can order up to ₹10,000/month maintenance. File complaint at Sub-Divisional Magistrate office. Property rights: You cannot be evicted from your home by children. Make a WILL to avoid property disputes. Free Legal Aid: District Legal Services Authority (DLSA) provides free legal help to 60+ seniors. Helpline: 15100 (Senior Citizen Helpline, 24/7). Elder abuse: Report to police or call helpline. HelpAge India: 1800-180-1253.`,
  },
  {
    id: 'sen_013',
    tags: ['will', 'property', 'nominee', 'bank', 'documents', 'legal'],
    content: `Important Documents for Senior Citizens: Must keep organized: 1) Property documents (sale deed, registry) 2) Bank passbooks and FD certificates 3) Insurance policies 4) PAN and Aadhaar cards 5) Pension documents 6) Birth certificate and marriage certificate. Make a Will: Even a handwritten will is valid if signed and witnessed by 2 people. Register will at Sub-Registrar office for stronger legal standing. Add nominee: Update nominee in all bank accounts and insurance policies. Keep one trusted family member informed about all documents and where they are stored.`,
  },
  {
    id: 'sen_014',
    tags: ['income-tax', 'tax', 'return', 'exemption', 'itr', 'senior'],
    content: `Income Tax for Senior Citizens: Basic exemption: ₹3 lakh for 60-80 years, ₹5 lakh for 80+ years. No tax if total income below these limits. Senior Citizens do NOT need to file ITR if: income only from salary/pension and bank, AND age 75+, AND receiving pension and interest from same bank. Section 80D: ₹50,000 deduction for health insurance premium. Section 80TTB: ₹50,000 deduction on interest income from banks/post office. File ITR using ITR-1 (Sahaj form) - simplest form. Free ITR filing at incometax.gov.in. Deadline: 31st July annually.`,
  },
];

export default seniorKnowledge;
