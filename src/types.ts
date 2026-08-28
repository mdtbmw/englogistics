/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FleetItem {
  id: string;
  name: string;
  image: string;
  images?: string[];
  cutout?: string;
  specs: {
    pax: string;
    luggage: string;
    type: string;
  };
  desc: string;
  pricePerDay: number;
  category: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  features: string[];
  bestFor: string[];
  faq: { q: string; a: string }[];
}

export interface ServiceItem {
  name: string;
  desc: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string; // Dynamic icon rendering name
  items: ServiceItem[];
}

export interface Booking {
  id: string;
  vehicleType: string;
  serviceType: 'chauffeur' | 'vip-protocol';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  securityLevel: 'standard' | 'armed-escort' | 'covert';
  durationDays: number;
  totalCost: number;
  status: 'pending' | 'active' | 'completed';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface TrackingMission {
  id: string;
  driverName: string;
  vehicleName: string;
  status: 'In Transit' | 'Departed' | 'Arrived' | 'Standby';
  route: string;
  speed: number;
  fuelLevel: number;
  coordinates: { x: number; y: number };
  telemetryLog: string[];
}

// -------------------------------------------------------------
// BLOG, CMS, AI SEO & FIREBASE TYPINGS
// -------------------------------------------------------------

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  avatar?: string;
  approved?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  targetKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  aiSearchSummary?: string; // Optimized for Google SGE, Perplexity, SearchGPT
  keyTakeaways?: string[]; // Quick bullet summaries for AI crawlers
  faqSchema?: FAQItem[]; // Injected into JSON-LD FAQPage Schema
  schemaType?: 'BlogPosting' | 'Article' | 'NewsArticle';
}

export type PostType = 'how-to' | 'standard';

export interface HowToStep {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
  image?: string;
  imageCaption?: string;
  duration?: string;
  checklist?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown rich text
  category: string;
  tags: string[];
  author: BlogAuthor;
  coverImage: string;
  postType?: PostType;
  totalDuration?: string;
  prerequisites?: string[];
  howToSteps?: HowToStep[];
  status: 'published' | 'draft' | 'scheduled';
  featured?: boolean;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  viewsCount: number;
  likesCount: number;
  comments: BlogComment[];
  seo: SEOMetadata;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount?: number;
}

export interface SEOScoreMetric {
  id: string;
  label: string;
  score: number; // 0 to 10
  maxScore: number;
  passed: boolean;
  message: string;
  recommendation?: string;
  category: 'on-page' | 'technical' | 'content' | 'ai-geo';
}

export interface SEOScoreBreakdown {
  totalScore: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: SEOScoreMetric[];
  readabilityScore: number; // Flesch Reading Ease
  readingTimeMinutes: number;
  wordCount: number;
  keywordDensity: { keyword: string; count: number; percentage: number }[];
  summary: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConnected: boolean;
  usingMock: boolean;
}

export interface BookingRecord {
  id: string;
  vehicleType: string;
  serviceType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  securityLevel: string;
  durationDays: number;
  totalCost: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  branch?: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdminStats {
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalBookings: number;
  totalSubscribers: number;
  averageSeoScore: number;
  avgTimeOnSiteSeconds: number;
  activeVisitorsCount: number;
}

export interface DailyAnalyticsRecord {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "Aug 28, 2026"
  dayOfWeek: string; // e.g. "Friday"
  viewsCount: number;
  likesCount: number;
  bookingsCount: number;
  subscribersCount: number;
  sharesCount: number;
  avgTimeOnSiteSeconds: number;
  activeVisitorsCount: number;
  topPosts: { slug: string; title: string; views: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  hourlyDistribution: number[]; // 24 hours (0-23)
  referrers: { source: string; visits: number; percentage: number }[];
}
