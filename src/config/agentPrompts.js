// ─── Agent Prompts Config ─────────────────────────────────────────────────────
// This file re-exports agent info from agentRouter for backward compatibility.
// Components that imported personaPrompts can now import from here.

import { AGENTS } from '../services/agentRouter.js';

// Legacy format — keeps old code working
const personaPrompts = {
  amma: {
    systemPrompt: AGENTS.amma.systemPrompt,
    templates: {
      recipe: 'Give me a simple Indian recipe using {ingredients}. Explain step-by-step for a beginner.',
      schemes: 'Explain {scheme_name} in very simple language. What are the benefits and how can a homemaker apply?',
      reminder: 'Create a family reminder for {event}. Make it warm and caring.',
      scam: 'Analyze this message for scam: {message}. Is it safe? Explain in simple language.',
    },
    suggestedPrompts: {
      en: [
        'PM-Kisan scheme ke baare mein batao',
        'UPI se paise bhejne ka tarika',
        'Ghar par healthy recipe batao',
        'Suspicious SMS check karo',
        'Jan Dhan account kaise kholuun?',
      ],
      hi: [
        'पीएम किसान योजना के बारे में बताओ',
        'यूपीआई से पैसे कैसे भेजें',
        'स्वस्थ खाने की रेसिपी बताओ',
        'संदिग्ध SMS की जांच करो',
        'जन धन खाता कैसे खोलें?',
      ],
    },
  },

  student: {
    systemPrompt: AGENTS.student.systemPrompt,
    templates: {
      career: 'What career paths suit students interested in {field}? Required skills and salary range?',
      scholarship: 'What scholarships are available for {category} students? Give application steps.',
      study: 'Create study notes for {topic} in {subject}. Include key concepts and practice questions.',
      resume: 'Review this resume summary: {summary}. How can I improve it for {role}?',
    },
    suggestedPrompts: {
      en: [
        'Best career after BCA in AI?',
        'How to crack JEE in 6 months?',
        'Top scholarships for engineering students',
        'How to get internship at Google?',
        'Build resume with no experience',
      ],
      hi: [
        'BCA के बाद AI में career कैसे बनाएं?',
        '6 महीने में JEE कैसे crack करें?',
        'Engineering students के लिए scholarships',
        'Google में internship कैसे पाएं?',
        'बिना experience के resume कैसे बनाएं?',
      ],
    },
  },

  business: {
    systemPrompt: AGENTS.business.systemPrompt,
    templates: {
      gst: 'Explain GST {topic} in simple steps for a small business owner.',
      marketing: 'Create a digital marketing strategy for {business_type} targeting {audience}.',
      loan: 'What are the best loan options for a {business_type} with {revenue} monthly revenue?',
      growth: 'Give 5 specific growth strategies for {business_type} in India.',
    },
    suggestedPrompts: {
      en: [
        'How to file GSTR-3B correctly?',
        'Best marketing for my local shop',
        'How to get Mudra loan?',
        'Pricing strategy for my product',
        'How to sell on Amazon India?',
      ],
      hi: [
        'GSTR-3B सही तरीके से कैसे file करें?',
        'Local shop के लिए best marketing',
        'Mudra loan कैसे प्राप्त करें?',
        'अपने product की pricing strategy',
        'Amazon India पर कैसे बेचें?',
      ],
    },
  },

  senior: {
    systemPrompt: AGENTS.senior.systemPrompt,
    templates: {
      health: 'Explain {condition} in simple words. What should a senior citizen do about it?',
      pension: 'How can I check my {pension_type} pension? Step-by-step, very simple.',
      safety: 'I received a suspicious call about {topic}. Is it a scam? What should I do?',
      smartphone: 'How do I {task} on WhatsApp? Explain very simply, step-by-step.',
    },
    suggestedPrompts: {
      en: [
        'How to check my EPF pension?',
        'Someone called asking for OTP - is it a scam?',
        'How to make WhatsApp video call?',
        'What benefits do I get after age 70?',
        'Medicine reminder kaise set karein?',
      ],
      hi: [
        'अपनी EPF पेंशन कैसे check करें?',
        'किसी ने OTP मांगा - क्या यह scam है?',
        'WhatsApp video call कैसे करें?',
        '70 साल के बाद कौन से लाभ मिलते हैं?',
        'दवाई की reminder कैसे set करें?',
      ],
    },
  },
};

// New agent config (colors, display info)
const personaConfig = {
  amma: {
    name: AGENTS.amma.name,
    color: AGENTS.amma.color,
    emoji: '🏡',
    accent: 'rose',
    avatar: '👩‍🍳',
    features: ['Government Schemes', 'Recipes', 'Banking Guide', 'Scam Shield', 'Community'],
    tools: AGENTS.amma.tools,
  },
  student: {
    name: AGENTS.student.name,
    color: AGENTS.student.color,
    emoji: '🎓',
    accent: 'purple',
    avatar: '👨‍🎓',
    features: ['Career Roadmap', 'Scholarships', 'Study Planner', 'Internships', 'Resume Builder'],
    tools: AGENTS.student.tools,
  },
  business: {
    name: AGENTS.business.name,
    color: AGENTS.business.color,
    emoji: '💼',
    accent: 'navy',
    avatar: '👨‍💼',
    features: ['GST Guidance', 'Business Loans', 'Digital Marketing', 'CRM', 'Analytics'],
    tools: AGENTS.business.tools,
  },
  senior: {
    name: AGENTS.senior.name,
    color: AGENTS.senior.color,
    emoji: '🌟',
    accent: 'sky',
    avatar: '👴',
    features: ['Scam Protection', 'Pension Guide', 'Health Tips', 'Smartphone Help', 'Emergency SOS'],
    tools: AGENTS.senior.tools,
  },
};

export { personaPrompts, personaConfig };
export default personaPrompts;
