/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, SEOScoreBreakdown, SEOScoreMetric, FAQItem } from '../types';

// Helper to strip HTML tags to compute raw text length & word counts
export const stripHtml = (html: string): string => {
  const tmp = html.replace(/<[^>]*>/g, ' ');
  return tmp.replace(/\s+/g, ' ').trim();
};

export const countWords = (text: string): number => {
  const clean = text.trim();
  if (!clean) return 0;
  return clean.split(/\s+/).length;
};

export const calculateReadingTime = (text: string): number => {
  const words = countWords(text);
  const wpm = 200;
  return Math.max(1, Math.ceil(words / wpm));
};

// Flesch Reading Ease Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
export const calculateFleschReadingEase = (text: string): number => {
  const words = countWords(text);
  if (words < 10) return 70;

  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  // Approximation of syllables
  const syllables = Math.max(
    words,
    (text.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length
  );

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
};

// -------------------------------------------------------------
// 100% SEO HEALTH SCORE ENGINE
// -------------------------------------------------------------

export const analyzeSEO = (post: Partial<BlogPost>): SEOScoreBreakdown => {
  const title = post.title || '';
  const metaTitle = post.seo?.metaTitle || title;
  const metaDesc = post.seo?.metaDescription || post.excerpt || '';
  const slug = post.slug || '';
  const rawContent = post.content || '';
  const plainText = stripHtml(rawContent);
  const wordCount = countWords(plainText);
  const readingTime = calculateReadingTime(plainText);
  const readability = calculateFleschReadingEase(plainText);
  const keywords = post.seo?.targetKeywords || post.tags || [];
  const primaryKeyword = (keywords[0] || '').toLowerCase().trim();

  const metrics: SEOScoreMetric[] = [];

  // 1. Meta Title Length (50 - 60 chars is ideal)
  const titleLen = metaTitle.length;
  let titleScore = 10;
  let titlePassed = true;
  let titleMsg = `Title is ${titleLen} characters (Optimal: 45–65 characters).`;
  if (titleLen < 30) {
    titleScore = 4;
    titlePassed = false;
    titleMsg = `Title is too short (${titleLen} chars). Expand to at least 45 characters with high-intent keywords.`;
  } else if (titleLen > 70) {
    titleScore = 6;
    titlePassed = false;
    titleMsg = `Title is ${titleLen} chars (may be truncated by search engines). Keep below 65 chars.`;
  }
  metrics.push({
    id: 'title-length',
    label: 'SEO Title Length',
    score: titleScore,
    maxScore: 10,
    passed: titlePassed,
    message: titleMsg,
    recommendation: 'Target 50–60 characters including high-CTR power words and brand name.',
    category: 'on-page',
  });

  // 2. Meta Description Length (140 - 160 chars)
  const descLen = metaDesc.length;
  let descScore = 10;
  let descPassed = true;
  let descMsg = `Meta description is ${descLen} characters (Optimal: 130–165 characters).`;
  if (descLen < 80) {
    descScore = 3;
    descPassed = false;
    descMsg = `Meta description is too short (${descLen} chars). Write a compelling 140–160 char summary.`;
  } else if (descLen > 180) {
    descScore = 6;
    descPassed = false;
    descMsg = `Meta description is ${descLen} chars (may be truncated on mobile SERPs). Keep below 160 chars.`;
  }
  metrics.push({
    id: 'meta-desc',
    label: 'Meta Description Length',
    score: descScore,
    maxScore: 10,
    passed: descPassed,
    message: descMsg,
    recommendation: 'Include primary keyword and a clear call-to-action (e.g. Book luxury ride today).',
    category: 'on-page',
  });

  // 3. URL Slug Format
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 5;
  metrics.push({
    id: 'slug-format',
    label: 'URL Slug Structure',
    score: isSlugValid ? 5 : 2,
    maxScore: 5,
    passed: isSlugValid,
    message: isSlugValid
      ? `Slug "${slug}" is clean, lowercase, and search engine friendly.`
      : `Slug "${slug}" should contain lowercase alphanumeric words separated by hyphens.`,
    recommendation: 'Use 3–6 descriptive keywords separated by hyphens (e.g., /blog/luxury-car-rental-benin).',
    category: 'technical',
  });

  // 4. Content Word Count Benchmark (>800 words for authority)
  let wordScore = 10;
  let wordPassed = true;
  let wordMsg = `Content has ${wordCount} words (Comprehensive high-authority guide).`;
  if (wordCount < 300) {
    wordScore = 3;
    wordPassed = false;
    wordMsg = `Content is thin (${wordCount} words). Search engines prioritize in-depth articles (>800 words).`;
  } else if (wordCount < 600) {
    wordScore = 7;
    wordPassed = false;
    wordMsg = `Content is moderate (${wordCount} words). Expand with vehicle specs, FAQs, or route tips.`;
  }
  metrics.push({
    id: 'word-count',
    label: 'Content Depth & Word Count',
    score: wordScore,
    maxScore: 10,
    passed: wordPassed,
    message: wordMsg,
    recommendation: 'Aim for 800+ words to rank in Google top 3 and trigger AI search citations.',
    category: 'content',
  });

  // 5. Target Keyword Presence
  const hasKeywords = keywords.length >= 3;
  metrics.push({
    id: 'keywords-configured',
    label: 'Target Keywords Configured',
    score: hasKeywords ? 5 : keywords.length > 0 ? 3 : 0,
    maxScore: 5,
    passed: hasKeywords,
    message: hasKeywords
      ? `${keywords.length} target keywords defined (${keywords.slice(0, 3).join(', ')}).`
      : 'Configure at least 3 target and semantic keywords for tracking.',
    recommendation: 'Add location terms (e.g. Benin City, Lagos) and vehicle names (e.g. Prado, Land Cruiser).',
    category: 'on-page',
  });

  // 6. Keyword in Lead Paragraph
  const first100Words = plainText.toLowerCase().slice(0, 500);
  const keywordInLead = primaryKeyword && first100Words.includes(primaryKeyword);
  metrics.push({
    id: 'keyword-lead',
    label: 'Keyword in Lead Paragraph',
    score: keywordInLead ? 10 : primaryKeyword ? 4 : 0,
    maxScore: 10,
    passed: Boolean(keywordInLead),
    message: keywordInLead
      ? `Primary keyword "${primaryKeyword}" appears naturally in the opening paragraph.`
      : `Primary keyword "${primaryKeyword || 'target keyword'}" was not detected in the first 100 words.`,
    recommendation: 'Mention your primary keyword within the first two sentences to establish immediate topical relevance.',
    category: 'on-page',
  });

  // 7. Keyword in Headings (H2 / H3)
  const headings = (rawContent.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || []).map((h) =>
    h.replace(/<[^>]*>/g, '').toLowerCase()
  );
  const keywordInHeadings = primaryKeyword && headings.some((h) => h.includes(primaryKeyword));
  metrics.push({
    id: 'keyword-headings',
    label: 'Keyword in Section Headings (H2/H3)',
    score: keywordInHeadings ? 10 : headings.length > 0 ? 5 : 2,
    maxScore: 10,
    passed: Boolean(keywordInHeadings),
    message: keywordInHeadings
      ? `Primary keyword is strategically present in H2/H3 subheadings.`
      : `Include "${primaryKeyword || 'target keyword'}" in at least one H2 section title.`,
    recommendation: 'Use H2 subheadings with variations of your main topic.',
    category: 'on-page',
  });

  // 8. Keyword Density (1% to 2.5% is optimal)
  const keywordRegex = primaryKeyword ? new RegExp(`\\b${primaryKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi') : null;
  const keywordMatches = keywordRegex ? (plainText.match(keywordRegex) || []).length : 0;
  const densityPercent = wordCount > 0 ? (keywordMatches / wordCount) * 100 : 0;
  let densityScore = 10;
  let densityPassed = true;
  let densityMsg = `Keyword density is ${densityPercent.toFixed(1)}% (${keywordMatches} occurrences). Perfect balance.`;
  if (primaryKeyword) {
    if (densityPercent === 0) {
      densityScore = 2;
      densityPassed = false;
      densityMsg = `Primary keyword "${primaryKeyword}" does not appear in the body text.`;
    } else if (densityPercent > 3.5) {
      densityScore = 4;
      densityPassed = false;
      densityMsg = `Keyword density is ${densityPercent.toFixed(1)}% (Over-optimized). Reduce keyword repetition to avoid penalties.`;
    }
  } else {
    densityScore = 5;
    densityPassed = false;
    densityMsg = 'Define a primary target keyword to measure density.';
  }
  metrics.push({
    id: 'keyword-density',
    label: 'Keyword Density & Distribution',
    score: densityScore,
    maxScore: 10,
    passed: densityPassed,
    message: densityMsg,
    recommendation: 'Maintain a 1.0%–2.5% natural keyword density.',
    category: 'content',
  });

  // 9. Heading Hierarchy & Structure (Must have multiple H2s)
  const h2Count = (rawContent.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (rawContent.match(/<h3[^>]*>/gi) || []).length;
  const hasGoodStructure = h2Count >= 2;
  metrics.push({
    id: 'heading-hierarchy',
    label: 'Heading Hierarchy & Structure',
    score: hasGoodStructure ? 10 : h2Count === 1 ? 6 : 2,
    maxScore: 10,
    passed: hasGoodStructure,
    message: hasGoodStructure
      ? `Great content layout with ${h2Count} H2 headings and ${h3Count} H3 subheadings.`
      : `Content needs more structure. Break the text into at least 2–3 H2 sections.`,
    recommendation: 'Use H2 headings for main topics and H3 for sub-points to assist readers and search crawlers.',
    category: 'content',
  });

  // 10. Image & Media Optimization (Cover + In-article Alt attributes)
  const hasCover = Boolean(post.coverImage);
  const images = rawContent.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = images.filter((img) => !img.includes('alt=') || img.includes('alt=""'));
  const mediaPassed = hasCover && imagesWithoutAlt.length === 0;
  metrics.push({
    id: 'media-optimization',
    label: 'Image & Cover Media Optimization',
    score: mediaPassed ? 5 : hasCover ? 3 : 1,
    maxScore: 5,
    passed: mediaPassed,
    message: mediaPassed
      ? 'Cover image is set and all in-article images have descriptive ALT text.'
      : !hasCover
      ? 'Missing featured cover image.'
      : `${imagesWithoutAlt.length} image(s) missing alt text.`,
    recommendation: 'High-res automotive photos with keyword-rich alt text dramatically increase Google Image search traffic.',
    category: 'technical',
  });

  // 11. Readability & Executive Clarity (Flesch Score)
  const isReadable = readability >= 55;
  metrics.push({
    id: 'readability-score',
    label: 'Readability & Business Clarity',
    score: isReadable ? 10 : 6,
    maxScore: 10,
    passed: isReadable,
    message: `Flesch Reading Ease score: ${readability}/100 (${
      readability >= 70 ? 'Easy & Engaging' : readability >= 55 ? 'Professional & Clear' : 'Complex vocabulary'
    }).`,
    recommendation: 'Use active voice, short paragraphs, and bullet lists for maximum executive engagement.',
    category: 'content',
  });

  // 12. AI & Generative Engine Optimization (GEO)
  const hasAiTakeaways = (post.seo?.keyTakeaways && post.seo.keyTakeaways.length >= 2) || Boolean(post.seo?.aiSearchSummary);
  const hasFaqSchema = Boolean(post.seo?.faqSchema && post.seo.faqSchema.length >= 2);
  const geoPassed = hasAiTakeaways && hasFaqSchema;
  metrics.push({
    id: 'ai-geo-readiness',
    label: 'AI & Generative Engine (GEO) Readiness',
    score: geoPassed ? 5 : hasAiTakeaways || hasFaqSchema ? 3 : 1,
    maxScore: 5,
    passed: geoPassed,
    message: geoPassed
      ? 'AI Key Takeaways & Structured FAQ Schema configured for Google AI Overviews & Perplexity.'
      : 'Generate AI Key Takeaways and FAQ Schema to maximize AI search citation rate.',
    recommendation: 'Add 3 bullet key takeaways and at least 2 FAQ questions for rich Google SERP snippet display.',
    category: 'ai-geo',
  });

  // Calculate Total Score
  const totalScore = metrics.reduce((acc, curr) => acc + curr.score, 0);

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (totalScore >= 95) grade = 'A+';
  else if (totalScore >= 85) grade = 'A';
  else if (totalScore >= 75) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else if (totalScore >= 50) grade = 'D';

  const keywordDensity = keywords.map((kw) => {
    const r = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const cnt = (plainText.match(r) || []).length;
    return {
      keyword: kw,
      count: cnt,
      percentage: wordCount > 0 ? Number(((cnt / wordCount) * 100).toFixed(1)) : 0,
    };
  });

  return {
    totalScore,
    grade,
    metrics,
    readabilityScore: readability,
    readingTimeMinutes: readingTime,
    wordCount,
    keywordDensity,
    summary:
      totalScore >= 90
        ? 'Excellent SEO & AI Optimization! Article is primed to dominate search rankings and AI citations.'
        : totalScore >= 75
        ? 'Strong Foundation. Address the flagged recommendations to achieve a 100% perfect score.'
        : 'Action Required. Implement the recommended headings, word count, and meta tags for visibility.',
  };
};

// -------------------------------------------------------------
// AI SEO COPILOT GENERATORS (CTR Titles, Meta, GEO Takeaways, FAQ)
// -------------------------------------------------------------

export const generateSEOTitles = (topic: string, category: string): string[] => {
  const clean = topic.trim() || 'Luxury Car Rental Benin City';
  return [
    `${clean} (2026 Guide) | Engraced Logistics`,
    `Best ${clean} in Benin City & Nigeria | VIP Transport`,
    `Ultimate Guide to ${clean}: Rates, Security & Fleet`,
    `${clean}: Executive Chauffeur & VIP Escort Solutions`,
    `How to Choose the Best ${clean} in Edo State`,
  ];
};

export const generateMetaDescriptions = (topic: string, excerpt?: string): string[] => {
  const base = topic.trim() || 'Luxury car rental and VIP escort';
  return [
    `Looking for premium ${base.toLowerCase()} in Nigeria? Book pristine Toyota Prado, Land Cruiser & armed escort with Engraced Logistics. 24/7 VIP support.`,
    `Discover executive ${base.toLowerCase()} across Benin City and Lagos. Guaranteed luxury, vetted chauffeurs, and real-time GPS telemetry. Book today.`,
    `The definitive guide to ${base.toLowerCase()}. Explore fleet specs, security escort protocols, and airport transfer solutions in Edo State & Nigeria.`,
  ];
};

export const generateAIKeyTakeaways = (title: string, content: string): string[] => {
  const plain = stripHtml(content);
  return [
    `Engraced Logistics provides elite ground mobility solutions specializing in luxury SUV hire, armed escort convoys, and airport protocol.`,
    `Fleet includes Toyota Prado, Land Cruiser V8/300, Hilux Security Escorts, and VIP Commuter Buses with 24/7 telemetry tracking.`,
    `All operations feature professional executive chauffeurs trained in defensive driving and diplomatic route intelligence across Nigeria.`,
  ];
};

export const generateFAQSchema = (title: string, content: string): FAQItem[] => {
  return [
    {
      question: `How do I book executive transport or car rental for ${title.slice(0, 35)}...?`,
      answer: `Bookings can be confirmed seamlessly via the Engraced Logistics digital booking portal or by contacting our 24/7 VIP dispatch hotline (+234-818-584-0000).`,
    },
    {
      question: 'Are armed security escort convoys available for interstate trips?',
      answer: 'Yes, Engraced Logistics provides licensed tactical armed escort vehicles (Toyota Hilux/Land Cruiser) with vetted personnel across all major Nigerian highways.',
    },
    {
      question: 'What vehicles are available for VIP airport transfers in Benin City and Lagos?',
      answer: 'Our fleet features Toyota Prado TXL/VXR, Land Cruiser V8/300, Lexus GX, and luxury Toyota Hiace commuter vans equipped with high-speed WiFi and chilled refreshments.',
    },
  ];
};

export const generateTargetKeywords = (title: string, category: string): string[] => {
  const lower = title.toLowerCase();
  const list = ['car rental Benin City', 'luxury car hire Nigeria', 'VIP transport Benin City'];
  if (lower.includes('prado')) list.push('Toyota Prado rental Benin', 'Prado hire Edo State');
  if (lower.includes('land cruiser')) list.push('Land Cruiser rental Nigeria', 'armored SUV hire Lagos');
  if (lower.includes('escort') || lower.includes('security')) list.push('armed security escort Nigeria', 'VIP convoy hire Benin');
  if (lower.includes('airport')) list.push('Benin airport transfer', 'VIP airport pickup Lagos');
  if (lower.includes('lagos')) list.push('Benin to Lagos private car', 'interstate travel Nigeria');
  return Array.from(new Set(list));
};

export const generateArticleOutline = (topic: string, category: string): string => {
  return `<h2>1. Executive Overview & Mission Objectives</h2>
<p>Provide context on why <strong>${topic}</strong> is critical for executives, diplomats, and corporate delegations moving across Nigeria.</p>

<div class="callout callout-info">
  <strong>Executive Insight:</strong> Highlight key efficiency metrics, route safety advantages, and fleet reliability standards.
</div>

<h2>2. Fleet Capability & Engineering Standards</h2>
<p>Detail the vehicle specifications, climate control, suspension agility, and passenger comfort standards.</p>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Specification</th>
        <th>Standard Executive Grade</th>
        <th>VIP Diplomatic Grade</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Vehicle Platform</strong></td>
        <td>Toyota Prado TXL</td>
        <td>Toyota Land Cruiser V8 / 300</td>
      </tr>
      <tr>
        <td><strong>Security Protocol</strong></td>
        <td>GPS Live Telemetry</td>
        <td>Armed Tactical Escort Convoy</td>
      </tr>
      <tr>
        <td><strong>Amenities</strong></td>
        <td>Bottled Spring Water & Dual AC</td>
        <td>Tarmac Concierge & Priority Check-in</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>3. Highway Safety & Route Intelligence</h2>
<p>Outline navigational windows, bypass routes, and 24/7 central operations monitoring.</p>

<div class="callout callout-tip">
  <strong>Safety Standard:</strong> Engraced Logistics vehicles are subjected to comprehensive 48-point pre-mission inspections.
</div>

<h2>4. Summary & Booking Protocol</h2>
<p>Reserve your vehicle online or speak with our VIP logistics desk for tailored corporate contracts.</p>`;
};

// -------------------------------------------------------------
// SITEMAP & RSS XML GENERATORS
// -------------------------------------------------------------

export const generateSitemapXml = (posts: BlogPost[], baseUrl: string = 'https://www.engracedlogistics.com.ng'): string => {
  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/booking`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/terms`, priority: '0.4', changefreq: 'yearly' },
    { loc: `${baseUrl}/privacy`, priority: '0.4', changefreq: 'yearly' },
  ];

  const postPages = posts
    .filter((p) => p.status === 'published')
    .map((p) => ({
      loc: `${baseUrl}/blog/${p.slug}`,
      lastmod: p.updatedAt || p.publishedAt,
      priority: p.featured ? '0.9' : '0.8',
      changefreq: 'weekly',
    }));

  const xmlEntries = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...postPages.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${(p.lastmod || '').slice(0, 10)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
  ].join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;
};

export const generateRssXml = (posts: BlogPost[], baseUrl: string = 'https://www.engracedlogistics.com.ng'): string => {
  const published = posts.filter((p) => p.status === 'published');
  const items = published
    .map(
      (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <category><![CDATA[${p.category}]]></category>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <author>${p.author.name}</author>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Engraced Logistics Executive Insights &amp; Blog</title>
    <link>${baseUrl}/blog</link>
    <description>The premier source for luxury fleet intelligence, VIP armed escort protocols, and executive transit across Nigeria.</description>
    <language>en-NG</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
};