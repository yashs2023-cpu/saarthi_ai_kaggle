// ─── Student Agent Knowledge Base ────────────────────────────────────────────

const studentKnowledge = [
  // ── Career Paths ──
  {
    id: 'stu_001',
    tags: ['software', 'coding', 'programming', 'developer', 'it', 'engineer', 'job'],
    content: `Software Development Career Path: Start with Python or JavaScript. Roadmap: 1) Learn programming basics (3-6 months) 2) Build 3 projects for portfolio 3) Learn Git, databases, APIs 4) Apply for internships on LinkedIn/Internshala. Top companies: TCS, Infosys, Google, Amazon, startups. Salary: ₹3.5-6 LPA fresher, ₹15-40 LPA with 5 years experience. Best free resources: freeCodeCamp, CS50 Harvard (free on edX), The Odin Project.`,
  },
  {
    id: 'stu_002',
    tags: ['data-science', 'ai', 'ml', 'machine-learning', 'analytics', 'python'],
    content: `Data Science & AI Career Path: Most in-demand field. Learn: Python → NumPy/Pandas → Machine Learning (sklearn) → Deep Learning (TensorFlow) → Projects. Best certifications: Google Data Analytics (Coursera, free audit), IBM Data Science Professional Certificate, Andrew Ng's ML course. Salary: ₹6-12 LPA fresher, ₹20-50 LPA senior. Apply on: LinkedIn, Naukri, AngelList for startups. Kaggle competitions build real portfolio.`,
  },
  {
    id: 'stu_003',
    tags: ['upsc', 'civil-services', 'ias', 'ips', 'government', 'exam'],
    content: `UPSC Civil Services Exam Guide: Preliminary exam (June) → Mains exam (Sept) → Interview. Syllabus: GS Paper 1-4 + Optional subject + Essay. Success rate: 0.1-0.2%. Preparation time: minimum 1-2 years. Best strategy: 1) Complete NCERT 6-12 first 2) Read The Hindu newspaper daily 3) Vision IAS or Vajiram for coaching 4) Practice previous year papers. Free resources: INSIGHTS IAS website, Unacademy free lectures. Age limit: 21-32 years (Gen), 21-35 (OBC), 21-37 (SC/ST).`,
  },
  {
    id: 'stu_004',
    tags: ['ca', 'chartered-accountant', 'finance', 'accounts', 'tax', 'audit'],
    content: `Chartered Accountancy (CA) Career: CA Foundation → CA Intermediate → CA Final → Articleship (3 years). Duration: 4.5-5 years total. ICAI is the governing body. Salary: ₹7-10 LPA fresher, ₹25-50 LPA Big 4 firms. Skills needed: Accounting, taxation, audit, GST, company law. Registration at icaiexam.icai.org. CA is one of the highest paid professional degrees in India.`,
  },
  {
    id: 'stu_005',
    tags: ['neet', 'medical', 'doctor', 'mbbs', 'biology', 'medicine'],
    content: `NEET & Medical Admission Guide: NEET is mandatory for MBBS/BDS/Ayush admission. Eligibility: 17+ years, 50% in Physics+Chemistry+Biology. Exam: 180 questions, 720 marks, 3 hours. Top government medical colleges: AIIMS, JIPMER, BHU. Application: neet.nta.nic.in. Preparation tips: NCERT is the bible for NEET - read 5-6 times. Practice 10 years papers. Coaching: Allen, Aakash, Resonance. NEET score required: 600+ for government colleges.`,
  },

  // ── Scholarships ──
  {
    id: 'stu_006',
    tags: ['scholarship', 'money', 'free', 'education', 'fees', 'nsp', 'national'],
    content: `National Scholarship Portal (NSP): scholarships.gov.in has 50+ central government scholarships. Top ones: 1) Central Sector Scheme of Scholarships (CSSS): ₹10,000-20,000/year for 12th passouts 2) Post Matric Scholarship for SC/ST: full fees + maintenance allowance 3) Merit cum Means Scholarship for minorities: up to ₹30,000/year. Application window: July-November each year. Required: Aadhaar, bank account, income certificate, marksheet.`,
  },
  {
    id: 'stu_007',
    tags: ['tata', 'trust', 'private-scholarship', 'foundation', 'ngo'],
    content: `Top Private Scholarships in India: 1) Tata Trusts Scholarship: up to ₹2L/year for deserving students, apply at tatatrusts.org 2) Reliance Foundation Scholarship: ₹4L for UG students in STEM/humanities 3) HDFC Educational Crisis Scholarship: for students facing financial crisis 4) Infosys Foundation Scholarship: for tech students 5) Buddy4Study platform aggregates 5000+ scholarships - apply at buddy4study.com. Also check your state government portal for state-specific scholarships.`,
  },
  {
    id: 'stu_008',
    tags: ['internship', 'experience', 'work', 'intern', 'stipend', 'company'],
    content: `Finding Internships in India: Best platforms: 1) Internshala.com - largest internship platform 2) LinkedIn - set job alerts for internships 3) LetsIntern.com 4) Forage - virtual internships from global companies (free). Government internships: PM Internship Scheme 2024 (pmInternship.mca.gov.in) - ₹5,000/month stipend. Tips: Start applying in 2nd year of college. Build GitHub profile. Cold email companies directly - 80% of jobs are never posted. Attend college placement drives.`,
  },
  {
    id: 'stu_009',
    tags: ['resume', 'cv', 'job-application', 'interview', 'placement'],
    content: `Resume Building Tips for Students: 1) Keep to 1 page max 2) Use ATS-friendly format (no tables, no graphics) 3) Start bullet points with action verbs: Developed, Led, Designed, Increased 4) Quantify achievements: "Increased traffic by 40%" not "improved traffic" 5) Add: Projects (most important for freshers), Skills, Education, Certifications 6) Free tools: Novoresume, Canva, Zety. Always tailor resume for each job. LinkedIn profile should mirror resume. Get resume reviewed by seniors or use AI tools like Resume.io.`,
  },

  // ── Study Techniques ──
  {
    id: 'stu_010',
    tags: ['study', 'tips', 'exam', 'memory', 'focus', 'concentration', 'learn'],
    content: `Proven Study Techniques: 1) Pomodoro Technique: 25 min study + 5 min break, repeat 4 times then take 30 min break 2) Active Recall: After reading, close book and write everything you remember 3) Spaced Repetition: Review notes after 1 day, 3 days, 1 week, 1 month 4) Feynman Technique: Explain concept in simple words as if teaching a child 5) Mind Mapping: Draw connections between concepts visually. Best apps: Anki (flashcards), Forest (focus), Notion (notes). Study in 90-minute focused blocks - matches brain's natural ultradian rhythm.`,
  },
  {
    id: 'stu_011',
    tags: ['board', 'class-10', 'class-12', 'cbse', 'icse', 'state-board', 'marks'],
    content: `Board Exam Strategy: CBSE Class 10/12: 1) First 3 months: Complete NCERT thoroughly 2) Next 2 months: Previous year papers (last 10 years) 3) Last month: Revise formulas and key points only. Marks distribution matters - check CBSE marking scheme. For CBSE: Maths - practice all NCERT examples. Science - diagrams carry marks. English - follow letter/essay format strictly. Sample papers: cbseacademic.nic.in. Mock test series helps identify weak areas.`,
  },
  {
    id: 'stu_012',
    tags: ['jee', 'iit', 'engineering', 'entrance', 'physics', 'chemistry', 'maths'],
    content: `JEE Preparation Guide: JEE Main (NTA) → JEE Advanced (IITs). JEE Main: 90 questions, 4 hours, 300 marks. Cutoff for JEE Advanced: ~90 percentile. Best books: Physics - HC Verma, Chemistry - NCERT + JD Lee, Maths - Cengage/Arihant. Strategy: 1) Strong NCERT base first 2) Topic-wise practice from Year 1 3) Full mock tests from Year 2 4) Revise weak areas. Top coaching: FIITJEE, Allen, Resonance, Aakash. Online free: Unacademy, Vedantu. JEE Main held twice - Jan and April.`,
  },
  {
    id: 'stu_013',
    tags: ['hackathon', 'competition', 'coding', 'prize', 'tech-fest', 'project'],
    content: `Hackathons and Competitions for Students: 1) Smart India Hackathon (SIH) - government problems, ₹1 lakh prize 2) Google Solution Challenge - global, solve UN SDGs 3) Microsoft Imagine Cup - global tech competition 4) Flipkart GRiD - e-commerce challenge with PPO opportunities 5) Unstop (unstop.com) - lists all college and corporate hackathons. Tips: Focus on problem statement, not just tech. MVP in 24 hours is the goal. Team of 4-6 with mixed skills is ideal. Hackathon wins are gold on resume.`,
  },
  {
    id: 'stu_014',
    tags: ['certification', 'course', 'online', 'skill', 'free', 'coursera', 'udemy'],
    content: `Best Free Certifications for Students: 1) Google Digital Garage - Digital Marketing (free certificate) 2) Google IT Support - Coursera (financial aid available = free) 3) AWS Cloud Practitioner - Free training on aws.training 4) Meta Frontend Developer - Coursera with financial aid 5) Cisco Networking Basics - free on netacad.com 6) HubSpot Academy - Marketing, Sales, CRM (free). LinkedIn Learning: Free with student email at many colleges. Coursera: Audit any course free (no certificate but learn). GitHub Student Pack: $200+ worth of free tools.`,
  },

  // ── Mental Health & Motivation ──
  {
    id: 'stu_015',
    tags: ['stress', 'anxiety', 'mental-health', 'pressure', 'motivation', 'burnout'],
    content: `Managing Student Stress: Academic pressure is real. 1) Break big goals into daily micro-goals 2) Exercise 30 min/day - proven to reduce anxiety by 48% 3) Sleep 7-8 hours - non-negotiable for memory consolidation 4) Talk to someone - iCall (9152987821) is free counseling for students 5) Celebrate small wins 6) Compare yourself only to yesterday's you, not to peers. Exam anxiety tips: Deep breathing (4-7-8 technique) before exam. Read all questions first, start with easiest. Remember: one exam does not define your life.`,
  },
  {
    id: 'stu_016',
    tags: ['gap-year', 'dropout', 'failure', 'second-chance', 'reset'],
    content: `If you failed or took a gap year: It is completely normal. Many successful people failed exams. Options after gap: 1) Private college admission (COMEDK, management quota) 2) Diploma courses - good alternative path 3) Vocational training - ITI, Polytechnic 4) Start with skill courses and build portfolio 5) Entrepreneurship - many successful startups were started by dropouts. Albert Einstein failed school. Steve Jobs dropped out. Your story is not over. Use gap year productively with certifications and projects.`,
  },

  // ── Career Tools ──
  {
    id: 'stu_017',
    tags: ['linkedin', 'networking', 'profile', 'job-search', 'connect'],
    content: `LinkedIn Profile Optimization for Students: 1) Professional photo (not selfie, not group photo) 2) Headline: "Computer Science Student | Python | Web Dev | Looking for Internships" 3) About section: 3-5 sentences about your goals and skills 4) Add ALL projects with GitHub links 5) Connect with professors, alumni, and seniors 6) Post once a week about what you are learning 7) Join groups related to your field 8) Message seniors for informational interviews. LinkedIn is the #1 job finding platform in India. 500+ connections make you visible to recruiters.`,
  },
];

export default studentKnowledge;
