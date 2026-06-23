// ─── Business Agent Knowledge Base ───────────────────────────────────────────

const businessKnowledge = [
  // ── GST ──
  {
    id: 'biz_001',
    tags: ['gst', 'registration', 'gstin', 'tax', 'register'],
    content: `GST Registration Guide for MSMEs: Mandatory if annual turnover exceeds ₹40 lakh (goods) or ₹20 lakh (services). Register at gst.gov.in. Documents: PAN, Aadhaar, bank account details, business address proof. You get GSTIN in 7-10 working days. Composition scheme: If turnover under ₹1.5 crore, pay 1-6% flat tax instead of regular GST. Benefits of GST registration: Input Tax Credit, wider customer base, government tenders eligibility, formal business identity.`,
  },
  {
    id: 'biz_002',
    tags: ['gstr', 'filing', 'return', 'monthly', 'deadline', 'penalty'],
    content: `GST Return Filing Calendar: GSTR-1 (outward supplies): 11th of next month. GSTR-3B (monthly summary): 20th of next month. GSTR-9 (annual return): 31st December. Late filing penalty: ₹50/day (₹20 for NIL returns). Interest on late payment: 18% per annum. Composition dealers file GSTR-4 quarterly. For small businesses: Clear Tax, Zoho Books, or TallyPrime simplify GST filing. Always reconcile GSTR-2A with purchase register before claiming ITC.`,
  },
  {
    id: 'biz_003',
    tags: ['itc', 'input-tax-credit', 'refund', 'claim', 'offset'],
    content: `Input Tax Credit (ITC) Guide: ITC lets you offset GST paid on purchases against GST collected on sales. Conditions: 1) You must have tax invoice 2) Supplier must have filed their return 3) Goods/services used for business only 4) Claim within 1 year. Blocked credits: Personal cars, food, beauty services cannot claim ITC. ITC refund: If exports exceed domestic sales, you can claim cash refund. Monthly savings from ITC can be 10-20% of purchase value.`,
  },

  // ── Business Loans ──
  {
    id: 'biz_004',
    tags: ['loan', 'mudra', 'msme', 'credit', 'bank', 'finance', 'capital'],
    content: `Business Loan Options for MSMEs: 1) PM Mudra Yojana: Shishu (up to ₹50K), Kishor (₹50K-5L), Tarun (₹5L-10L) - no collateral needed 2) MSME Loan in 59 minutes: psbloansin59minutes.com - quick processing 3) CGTMSE: Collateral-free loans up to ₹2 crore for MSMEs 4) Startup India Seed Fund: up to ₹20 lakh for early stage startups 5) State government schemes: Check your state's MSME portal. Tips to improve loan eligibility: Maintain 2+ years ITR, keep credit score above 700, have clear bank statements.`,
  },
  {
    id: 'biz_005',
    tags: ['startup', 'registration', 'company', 'proprietorship', 'llp', 'pvt-ltd'],
    content: `Business Structure Options in India: 1) Sole Proprietorship: Easiest, no registration needed, full control but unlimited liability 2) Partnership Firm: 2+ owners, register at Registrar of Firms 3) LLP: Limited Liability Partnership - combines flexibility with liability protection, register at mca.gov.in 4) Private Limited Company: Best for raising investment, minimum 2 directors, register at mca.gov.in. Startup India Registration: Free on startupindia.gov.in - benefits include tax exemption, easy compliance, funding access. Most small businesses start as proprietorship.`,
  },
  {
    id: 'biz_006',
    tags: ['marketing', 'social-media', 'digital', 'instagram', 'whatsapp', 'customer'],
    content: `Digital Marketing for Small Businesses: 1) WhatsApp Business: Free, set up catalog, broadcast messages to 256 customers at once 2) Google My Business: Free, essential for local search, get reviews 3) Instagram: Post product photos daily, use 15 local hashtags, reels get 5x more reach than photos 4) Facebook: Join local buy-sell groups, advertise for ₹200/day 5) Justdial/IndiaMart: List for free to get B2B inquiries. Content tips: Before/after photos, customer testimonials, behind-the-scenes work best. Post at 7-9 AM or 7-9 PM for highest engagement.`,
  },

  // ── Business Operations ──
  {
    id: 'biz_007',
    tags: ['invoice', 'billing', 'gst-invoice', 'payment', 'receivable'],
    content: `Invoice & Billing Best Practices: GST Invoice must include: GSTIN, invoice number, date, buyer details, HSN code, taxable value, GST rate and amount. Free invoice tools: Zoho Invoice (free up to 5 customers), Invoice Ninja, Vyapar app (India-specific). Credit policy: Give 30-day credit maximum to customers, offer 2% discount for advance payment. Follow up overdue payments after 7 days. Keep invoice copies for 7 years (GST requirement). Use accounting software from day 1 - manual records cause errors.`,
  },
  {
    id: 'biz_008',
    tags: ['profit', 'margin', 'pricing', 'revenue', 'cost', 'break-even'],
    content: `Pricing Strategy for Small Businesses: Cost-plus pricing: (Cost + Overhead) × 1.3 for 30% margin. Rules: 1) Know your break-even point (fixed costs ÷ contribution margin) 2) Never price below variable costs 3) Research competitor prices 4) Premium products can command 30-50% higher price with branding 5) Bundle products/services to increase average order value. For service businesses: hourly rate = desired annual income ÷ 1000 billable hours. Typical margins: Retail 20-30%, Services 40-60%, SaaS/Software 60-80%.`,
  },
  {
    id: 'biz_009',
    tags: ['customer', 'retention', 'crm', 'loyalty', 'repeat', 'satisfaction'],
    content: `Customer Retention Strategies: Acquiring new customers costs 5-7x more than retaining existing ones. 1) Follow up 3 days after purchase to check satisfaction 2) Birthday/anniversary discounts build loyalty 3) Referral program: Give 10% discount for referred customers 4) Collect WhatsApp numbers for broadcast lists 5) Solve complaints within 24 hours - 95% of unhappy customers stay if issue resolved quickly 6) Send monthly value content (tips, offers) not just promotions. NPS Question: "On a scale of 1-10, how likely are you to recommend us?" Score 9-10 = Promoters.`,
  },
  {
    id: 'biz_010',
    tags: ['inventory', 'stock', 'management', 'supply', 'shortage', 'waste'],
    content: `Inventory Management for Small Business: 1) ABC Analysis: A items (20% products = 80% revenue) need daily tracking. B items weekly. C items monthly. 2) Reorder point = Lead time days × average daily sales 3) Keep 2-4 weeks buffer stock 4) Use Vyapar or KhataBook app for free inventory tracking 5) Negotiate with 2-3 suppliers to avoid dependency 6) Monthly physical stock count is essential - prevents theft and errors. Excess inventory ties up capital - aim for inventory turnover ratio of 4-6x per year.`,
  },

  // ── Government Schemes for Businesses ──
  {
    id: 'biz_011',
    tags: ['udyam', 'msme-registration', 'udyog-aadhaar', 'certificate'],
    content: `Udyam Registration (MSME): Free registration at udyamregistration.gov.in. Benefits: 1) Priority lending from banks 2) Lower interest rates (1-1.5% less) 3) Government tender preference 4) Subsidies on technology, patents, quality certifications 5) Protection against delayed payments (45 day rule) 6) Electricity bill concessions in many states. Criteria: Micro enterprise: Investment under ₹1 crore, turnover under ₹5 crore. Small: Investment under ₹10 crore. Medium: Investment under ₹50 crore. Register using Aadhaar and PAN - process takes 15 minutes.`,
  },
  {
    id: 'biz_012',
    tags: ['export', 'import', 'foreign-trade', 'iec', 'dgft', 'international'],
    content: `Starting Export Business: Steps: 1) Register on DGFT portal (dgft.gov.in) for IEC (Import Export Code) - free 2) Open a current account with authorized dealer bank 3) Research target countries using India EXIM (Commerce Ministry data) 4) Connect with FIEO, APEDA, or relevant Export Promotion Council 5) List on Amazon Global Selling, Alibaba, or IndiaMART for international buyers. Government support: MEIS/RoDTEP scheme for export incentives, ECGC insurance for export credit risk. Start with neighboring countries - UAE, Bangladesh, Nepal are top markets.`,
  },
  {
    id: 'biz_013',
    tags: ['e-commerce', 'online-selling', 'amazon', 'flipkart', 'meesho', 'marketplace'],
    content: `Selling Online on Indian E-commerce Platforms: 1) Meesho: Best for beginners, zero commission for social commerce 2) Amazon India: Largest marketplace, FBA (fulfillment by Amazon) removes logistics headache 3) Flipkart: Strong in electronics, fashion, groceries 4) JioMart: Growing rapidly with Reliance backing 5) Nykaa/Myntra: Fashion and beauty vertical. Registration: GSTIN, bank account, business details required. Start with 5-10 products, build reviews, then scale. Photography tips: White background, multiple angles, lifestyle shots increase conversion by 30%. Shipping: Shiprocket aggregates multiple couriers at lowest rates.`,
  },

  // ── Financial Management ──
  {
    id: 'biz_014',
    tags: ['cash-flow', 'working-capital', 'finance', 'account', 'budget'],
    content: `Cash Flow Management: The #1 reason businesses fail is cash flow problems, not profitability. 1) Separate personal and business bank accounts from day 1 2) Create monthly cash flow projection 3) Get 30-day credit from suppliers, give maximum 15 days to customers 4) Keep 2 months operating expenses as emergency reserve 5) Use KhataBook or OkCredit for free digital ledger 6) Invoice on day of delivery, not end of month 7) Early payment discounts: Offer 2% discount for payment within 7 days. Rule of thumb: If cash inflow < cash outflow for 3 consecutive months, immediately take corrective action.`,
  },
  {
    id: 'biz_015',
    tags: ['growth', 'strategy', 'expand', 'scale', 'new-market', 'franchise'],
    content: `Business Growth Strategies for Indian MSMEs: 1) Geographic expansion: Start with 10km radius, then district, then state 2) Product expansion: Add complementary products (80% easier to sell to existing customers) 3) Digital presence: WhatsApp catalog + Google My Business = free online store 4) Franchise model: License your brand if system is proven 5) B2B pivot: 1 institutional customer = 100 retail customers in revenue 6) Government contracts: GeM portal (gem.gov.in) - government marketplace, over ₹1 lakh crore transactions. Key metric: Customer Acquisition Cost (CAC) should be less than 1/3 of Customer Lifetime Value (LTV).`,
  },
];

export default businessKnowledge;
