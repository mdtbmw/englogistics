/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { BlogPost, FAQItem } from '../types';

const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client', e);
    return null;
  }
};

/**
 * Generate full blog post article draft with Gemini AI
 */
export const generateAIBlogDraft = async (
  topic: string,
  category: string,
  postType: 'how-to' | 'editorial' = 'editorial'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readingTimeMinutes: number;
  howToSteps?: Array<{ stepNumber: number; title: string; description: string; checklist?: string[] }>;
}> => {
  const ai = getGeminiClient();
  
  if (ai) {
    try {
      const prompt = `You are the Chief Editorial Intelligence Officer for "Engraced Logistics", Nigeria's premier luxury executive ground transport and VIP escort company based in Benin City and serving Edo State, Lagos, and Abuja.
Write an authoritative, high-converting ${postType === 'how-to' ? 'step-by-step protocol guide' : 'executive intelligence briefing'} on the topic: "${topic}" in category "${category}".

Return valid JSON ONLY with this exact schema:
{
  "title": "Compelling luxury executive title",
  "excerpt": "2-sentence executive summary highlighting fleet standards and protocol",
  "content": "Rich HTML content with <h2>, <p>, <blockquote>, and structured sections",
  "tags": ["3-5 relevant tags"],
  "readingTimeMinutes": 5,
  ${postType === 'how-to' ? '"howToSteps": [{"stepNumber": 1, "title": "Step title", "description": "Step details", "checklist": ["Item 1", "Item 2"]}]' : ''}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          title: parsed.title || topic,
          excerpt: parsed.excerpt || `Executive guide to ${topic} by Engraced Logistics.`,
          content: parsed.content || `<p>Comprehensive briefing on ${topic}.</p>`,
          tags: parsed.tags || [category, 'Executive Logistics', 'VIP Transport'],
          readingTimeMinutes: parsed.readingTimeMinutes || 6,
          howToSteps: parsed.howToSteps,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using built-in generator fallback', err);
    }
  }

  // High-Grade Fallback
  const fallbackSteps = postType === 'how-to' ? [
    {
      stepNumber: 1,
      title: 'Initial Itinerary & Security Level Assessment',
      description: 'Review mission routes, airport arrival manifests, and security threat levels across destination corridors.',
      checklist: ['Verify flight arrival time', 'Confirm escort security tier', 'Assign dedicated executive chauffeur']
    },
    {
      stepNumber: 2,
      title: 'Fleet Staging & 48-Point Safety Inspection',
      description: 'Stage chosen vehicle platform (Toyota Prado/Land Cruiser) with dual-zone climate control, chilled refreshments, and GPS transponder verification.',
      checklist: ['Tire pressure & armor check', 'Refreshment bar restocked', 'Telemetry live tracking active']
    },
    {
      stepNumber: 3,
      title: 'Tarmac Reception & Executive Escort Dispatch',
      description: 'Chauffeur executes seamless VIP baggage handling and private tarmac transit directly to executive destination.',
      checklist: ['VIP greeting protocol completed', 'Live route bypass monitoring', 'Destination clearance confirmed']
    }
  ] : undefined;

  return {
    title: `${topic}: The Executive Logistics Standard (2026 Guide)`,
    excerpt: `Discover the operational standards and fleet capabilities required for seamless ${topic.toLowerCase()} across Benin City, Lagos, and Nigeria.`,
    content: `<h2>1. Executive Overview & Mission Objectives</h2>
<p>Corporate delegations, expatriates, and VIP principals navigating Nigeria require dependable, high-security mobility solutions. When planning <strong>${topic}</strong>, vehicle agility and route intelligence make all the difference.</p>

<div class="callout callout-info">
  <strong>Executive Insight:</strong> Engraced Logistics operates a pristine fleet of Toyota Prado TXLs, Land Cruisers, and armed tactical escort convoys with 24/7 telemetry monitoring.
</div>

<h2>2. Fleet Engineering & Safety Protocol</h2>
<p>Each mission is supported by vetted chauffeurs trained in defensive driving, evasive maneuvering, and discreet executive protocol.</p>

<h2>3. Reservation Protocol</h2>
<p>Confirm your booking online or consult our 24/7 VIP desk for dedicated corporate retainers.</p>`,
    tags: [category, 'Executive Mobility', 'VIP Escort', 'Nigeria Logistics'],
    readingTimeMinutes: 5,
    howToSteps: fallbackSteps,
  };
};

/**
 * Generate AI SEO Metadata (Titles, Descriptions, FAQs)
 */
export const generateAISeoEnhancements = async (
  title: string,
  content: string
): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faqs: FAQItem[];
}> => {
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a search engine optimization expert specializing in luxury automotive logistics in Nigeria.
For the publication titled "${title}", generate high-ranking SEO metadata.

Return JSON ONLY:
{
  "metaTitle": "SEO title under 60 chars ending in | Engraced Logistics",
  "metaDescription": "SEO meta description under 155 chars with high CTA",
  "keywords": ["5 target long-tail keywords"],
  "faqs": [
    {"question": "FAQ Question 1", "answer": "Clear concise answer"},
    {"question": "FAQ Question 2", "answer": "Clear concise answer"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          metaTitle: parsed.metaTitle || `${title} | Engraced Logistics`,
          metaDescription: parsed.metaDescription || `Executive logistics and luxury car rental guide for ${title}.`,
          keywords: parsed.keywords || ['luxury car rental Nigeria', 'VIP transport Benin City'],
          faqs: parsed.faqs || [],
        };
      }
    } catch (e) {
      console.warn('Gemini SEO call fallback', e);
    }
  }

  // Deterministic Fallback
  return {
    metaTitle: `${title.slice(0, 45)} | Engraced Logistics`,
    metaDescription: `Discover executive transport and luxury vehicle hire in Nigeria for ${title.slice(0, 50)}. Real-time GPS tracking and 24/7 VIP support.`,
    keywords: ['car rental Benin City', 'VIP escort Nigeria', 'luxury SUV hire', 'airport transfer Benin'],
    faqs: [
      {
        question: `How do I book executive transport for ${title.slice(0, 30)}?`,
        answer: 'You can book directly via the Engraced Logistics digital booking desk or contact our 24/7 dispatch hotline.',
      },
      {
        question: 'Are armed escort convoys provided for interstate transit?',
        answer: 'Yes, licensed armed escort units are available for executive delegations across Edo State, Lagos, and highway corridors.',
      }
    ]
  };
};
