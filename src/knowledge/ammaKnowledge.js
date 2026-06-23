// ─── Amma Agent Knowledge Base ───────────────────────────────────────────────
// Chunked knowledge for RAG retrieval. Each chunk has: id, tags, content.

const ammaKnowledge = [
  // ── Government Schemes ──
  {
    id: 'amma_001',
    tags: ['pm-kisan', 'farmer', 'agriculture', 'money', 'installment', 'kisan'],
    content: `PM-Kisan Samman Nidhi Scheme: Farmers with up to 2 hectares of land get ₹6,000 per year in three installments of ₹2,000 each. Apply at pmkisan.gov.in or nearest CSC center. Documents needed: Aadhaar card, bank passbook, land certificate. The money is directly transferred to the bank account.`,
  },
  {
    id: 'amma_002',
    tags: ['ujjwala', 'lpg', 'gas', 'cooking', 'bpl', 'free'],
    content: `PM Ujjwala Yojana: BPL families get a free LPG cooking gas connection with ₹1,600 subsidy. Visit nearest LPG gas agency with Aadhaar, BPL certificate, and passport photo. Available for women of BPL households who do not already have an LPG connection.`,
  },
  {
    id: 'amma_003',
    tags: ['ayushman', 'health', 'hospital', 'insurance', 'treatment', 'pmjay'],
    content: `Ayushman Bharat (PMJAY): Free health insurance up to ₹5 lakh per family per year for BPL and APL families listed in SECC database. Covers hospitalization, surgery, medicines. Get PMJAY card from nearest ASHA worker or pmjay.gov.in. Works in 24,000+ empanelled hospitals across India.`,
  },
  {
    id: 'amma_004',
    tags: ['mgnrega', 'work', 'employment', 'job', 'rural', 'wages'],
    content: `MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act): 100 days of guaranteed employment per year for rural households at ₹300-350 per day. Register at Gram Panchayat office. Any rural resident aged 18+ who wants manual work can apply. Payment goes directly to bank account within 15 days.`,
  },
  {
    id: 'amma_005',
    tags: ['maternity', 'pregnancy', 'pmvvy', 'mother', 'baby', 'child'],
    content: `PM Matru Vandana Yojana: ₹5,000 cash assistance for first child pregnancy. Eligible for pregnant and nursing women aged 19+ for their first live birth. Register at anganwadi center. Documents: Aadhaar, MCP card, bank account. Money is transferred in installments.`,
  },
  {
    id: 'amma_006',
    tags: ['housing', 'home', 'pmay', 'awas', 'gramin', 'rural'],
    content: `PM Awas Yojana Gramin: ₹1.2 lakh housing assistance for homeless or kutcha house families in rural areas. Apply through Gram Panchayat or pmayg.nic.in. Documents: Aadhaar, BPL certificate, land ownership proof. Urban version (PMAY-U) provides interest subsidy on home loans for EWS/LIG families.`,
  },
  {
    id: 'amma_007',
    tags: ['sukanya', 'girl', 'daughter', 'savings', 'education', 'marriage'],
    content: `Sukanya Samriddhi Yojana: High-interest savings scheme for girl child below 10 years for education and marriage expenses. Open account at Post Office or authorized bank. Documents: Birth certificate, Aadhaar. Minimum deposit ₹250/year, maximum ₹1.5 lakh/year. Interest rate around 8% per annum.`,
  },

  // ── Banking & UPI ──
  {
    id: 'amma_008',
    tags: ['upi', 'payment', 'gpay', 'phonepe', 'paytm', 'transfer', 'money'],
    content: `UPI (Unified Payments Interface) Guide: UPI lets you send and receive money instantly using your phone. Steps: 1) Download GPay/PhonePe/Paytm 2) Link your bank account 3) Set 4-6 digit UPI PIN. To pay: Enter UPI ID or scan QR code. IMPORTANT: Never share your UPI PIN with anyone. Banks never ask for PIN over phone. UPI is only for sending money - if someone asks you to "receive" money by entering PIN, it is a SCAM.`,
  },
  {
    id: 'amma_009',
    tags: ['bank', 'account', 'passbook', 'savings', 'fd', 'deposit'],
    content: `Banking basics for homemakers: Jan Dhan account gives zero balance savings account with free RuPay debit card and ₹1 lakh accident insurance. Required documents: Aadhaar + photo. Recurring Deposit (RD): Save small amounts monthly, earn 5-7% interest. Fixed Deposit (FD): Lump sum for higher interest. Senior citizens get 0.5% extra interest on FDs.`,
  },
  {
    id: 'amma_010',
    tags: ['jan-dhan', 'pradhan-mantri', 'zero-balance', 'account'],
    content: `PM Jan Dhan Yojana: Free zero-balance bank account for every Indian. Benefits include: free RuPay debit card, ₹1 lakh accident insurance, ₹30,000 life insurance, overdraft facility up to ₹10,000 after 6 months. Open at any bank branch with Aadhaar card. Essential for receiving government benefits directly.`,
  },

  // ── Digital Literacy ──
  {
    id: 'amma_011',
    tags: ['smartphone', 'mobile', 'phone', 'app', 'internet', 'digital'],
    content: `Smartphone basics for beginners: 1) To make calls: tap green phone icon, dial number 2) WhatsApp: free messages and video calls over WiFi/data 3) Google: search anything by typing or speaking 4) Camera: tap camera icon to take photos 5) To install apps: open Play Store, search app name, tap Install. Always download apps only from Play Store - avoid unknown websites.`,
  },
  {
    id: 'amma_012',
    tags: ['aadhaar', 'id', 'document', 'update', 'address', 'uidai'],
    content: `Aadhaar Card Guide: Your 12-digit Aadhaar is the most important ID in India. Download e-Aadhaar free at uidai.gov.in. Update address online at ssup.uidai.gov.in. For biometric update (photo/fingerprint) visit nearest Aadhaar center. Lock/unlock Aadhaar biometrics at resident.uidai.gov.in to prevent misuse. Keep Aadhaar safe - share only when absolutely necessary.`,
  },
  {
    id: 'amma_013',
    tags: ['ration', 'ration-card', 'food', 'pds', 'rice', 'wheat', 'grain'],
    content: `Ration Card & PDS (Public Distribution System): Ration card gives subsidized food grains - BPL families get rice at ₹3/kg, wheat at ₹2/kg. Apply at nearest FPS (Fair Price Shop) or online at state government portal. Documents: Aadhaar, residence proof, income certificate. One Nation One Ration Card scheme allows using ration card in any state.`,
  },

  // ── Scam Protection ──
  {
    id: 'amma_014',
    tags: ['scam', 'fraud', 'fake', 'otp', 'safe', 'protect', 'warning'],
    content: `Common scams targeting homemakers: 1) KYC UPDATE SCAM: Banks never call to update KYC - always visit branch in person 2) LOTTERY SCAM: You cannot win a lottery you never entered 3) OTP SCAM: Never share OTP with anyone - ever 4) FAKE GOVERNMENT CALL: Government officials never ask for money over phone 5) WORK FROM HOME SCAM: Jobs paying ₹50,000/week for liking YouTube videos are 100% fake. If in doubt, hang up and call the official helpline.`,
  },
  {
    id: 'amma_015',
    tags: ['cyber', 'complaint', 'report', 'fraud', 'helpline', '1930'],
    content: `If you are scammed: 1) Call Cyber Crime Helpline 1930 immediately 2) Report at cybercrime.gov.in 3) Contact your bank to block transactions 4) File FIR at nearest police station 5) Save all evidence - screenshots, call recordings, transaction IDs. The faster you report, the higher the chance of recovering money. Time is critical - report within 24 hours.`,
  },

  // ── Health & Home ──
  {
    id: 'amma_016',
    tags: ['health', 'anemia', 'nutrition', 'iron', 'diet', 'women'],
    content: `Women's health essentials: Anemia (low blood) is very common in Indian women. Eat iron-rich foods: spinach, drumstick leaves, jaggery, dates, lentils. Take iron supplements if prescribed. Vitamin D deficiency: Get 15 minutes morning sunlight daily. Calcium: Drink milk, eat curd, ragi, sesame seeds. Annual health checkup recommended - many government hospitals offer free checkups for women.`,
  },
  {
    id: 'amma_017',
    tags: ['grocery', 'shopping', 'budget', 'save', 'kitchen', 'dal', 'rice'],
    content: `Smart grocery shopping tips: 1) Buy seasonal vegetables - cheapest and freshest 2) Buy dal, rice, oil in bulk for 10-15% savings 3) Compare prices at local mandi vs supermarket 3) Avoid pre-cut vegetables - they cost 2x more 4) Use loyalty cards at supermarkets for discounts 5) Shop in morning for freshest produce 6) Check MRP on packaged items - shopkeeper cannot charge more. Monthly grocery budget for family of 4: ₹3,000-5,000.`,
  },
  {
    id: 'amma_018',
    tags: ['community', 'shg', 'self-help', 'group', 'women', 'mahila', 'loan'],
    content: `Self Help Groups (SHGs) for women: SHGs let women pool savings together and access micro-loans at low interest. Benefits: 1) Borrow up to 4x your savings 2) Learn financial skills 3) Connect with government schemes 4) Build business together. Register your SHG at nearest bank or NGO. Under NRLM (National Rural Livelihoods Mission) SHGs get ₹10,000-15,000 revolving fund. Mahila Mandals provide skill training and income opportunities.`,
  },

  // ── Cooking & Recipes ──
  {
    id: 'amma_019',
    tags: ['recipe', 'cook', 'food', 'vegetable', 'dal', 'sabzi', 'curry'],
    content: `Quick healthy recipes for busy homemakers: Dal Tadka: Boil toor dal, temper with mustard seeds, cumin, garlic, tomato. Ready in 20 mins. Aloo Matar: Fry onion-tomato, add potatoes and peas with spices, 25 mins. Palak Paneer: Blanch spinach, blend, cook with paneer and cream, 20 mins. Tip: Batch cook dal and rice, refrigerate up to 3 days. Pressure cooker saves 60% cooking time and energy.`,
  },
  {
    id: 'amma_020',
    tags: ['form', 'fill', 'application', 'online', 'apply', 'digilocker'],
    content: `How to fill online government forms: Step 1: Keep Aadhaar, PAN, bank account details ready. Step 2: Use DigiLocker (digilocker.gov.in) to store digital copies of all documents. Step 3: For most schemes, go to official .gov.in website only. Step 4: Fill details carefully - name and DOB must exactly match Aadhaar. Step 5: Upload clear photos of documents (under 200KB usually required). Step 6: Save application number after submitting. Common State Portals: Maharashtra: mahadbt.gov.in, UP: sspy-up.gov.in, TN: tn.gov.in`,
  },
];

export default ammaKnowledge;
