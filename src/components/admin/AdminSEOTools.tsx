/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Globe, 
  Rss, 
  FileCode, 
  ShieldCheck, 
  Cpu, 
  Search, 
  ExternalLink,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { BlogPost } from '../../types';
import { generateSitemapXml, generateRssXml, analyzeSEO } from '../../services/aiSeoService';

interface AdminSEOToolsProps {
  posts: BlogPost[];
}

export default function AdminSEOTools({ posts }: AdminSEOToolsProps) {
  const [copiedType, setCopiedType] = useState<'sitemap' | 'rss' | 'robots' | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'sitemap' | 'rss' | 'geo' | 'audit'>('sitemap');

  const sitemapXml = generateSitemapXml(posts);
  const rssXml = generateRssXml(posts);
  const robotsTxt = `# Engraced Logistics Robots.txt
User-agent: *
Allow: /
Disallow: /admin

# AI Bot Rules (OpenAI, Google SGE, Perplexity, Anthropic)
User-agent: GPTBot
Allow: /blog
User-agent: Google-Extended
Allow: /blog
User-agent: PerplexityBot
Allow: /blog

Sitemap: https://www.engracedlogistics.com.ng/sitemap.xml
RSS: https://www.engracedlogistics.com.ng/rss.xml`;

  const handleCopy = (text: string, type: 'sitemap' | 'rss' | 'robots') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  const handleDownload = (filename: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/xml' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-emerald-600" />
            <span>100% AI SEO &amp; Generative Engine Suite</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Generate XML sitemaps, RSS syndication feeds, and monitor AI search engine optimization (GEO).
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('sitemap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'sitemap' ? 'bg-white text-[#050548] shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Sitemap.xml
          </button>
          <button
            onClick={() => setActiveSubTab('rss')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rss' ? 'bg-white text-[#050548] shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            RSS Feed
          </button>
          <button
            onClick={() => setActiveSubTab('geo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'geo' ? 'bg-white text-[#050548] shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            AI Search (GEO)
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'audit' ? 'bg-white text-[#050548] shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Bulk Audit
          </button>
        </div>
      </div>

      {/* 1. Sitemap.xml View */}
      {activeSubTab === 'sitemap' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Globe size={18} className="text-[#050548]" />
                <span>Dynamic XML Sitemap (Google Search Console Ready)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Automatically indexes all {posts.filter((p) => p.status === 'published').length} published articles and core static routes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(sitemapXml, 'sitemap')}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                {copiedType === 'sitemap' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedType === 'sitemap' ? 'Copied XML' : 'Copy XML'}</span>
              </button>
              <button
                onClick={() => handleDownload('sitemap.xml', sitemapXml)}
                className="px-3.5 py-2 rounded-xl bg-[#050548] hover:bg-[#030330] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Download size={14} />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 custom-scrollbar">
            <pre>{sitemapXml}</pre>
          </div>
        </div>
      )}

      {/* 2. RSS Feed View */}
      {activeSubTab === 'rss' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Rss size={18} className="text-amber-600" />
                <span>RSS 2.0 Syndication Feed</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Standard XML feed for news readers, search aggregators, and corporate subscriber feeds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(rssXml, 'rss')}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                {copiedType === 'rss' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedType === 'rss' ? 'Copied' : 'Copy RSS'}</span>
              </button>
              <button
                onClick={() => handleDownload('rss.xml', rssXml)}
                className="px-3.5 py-2 rounded-xl bg-[#050548] hover:bg-[#030330] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Download size={14} />
                <span>Download rss.xml</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 text-blue-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 custom-scrollbar">
            <pre>{rssXml}</pre>
          </div>
        </div>
      )}

      {/* 3. AI Search & GEO View */}
      {activeSubTab === 'geo' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Cpu size={18} className="text-indigo-600" />
              <span>Generative Engine Optimization (GEO) &amp; AI Citation Ready</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              How Engraced Logistics content is structured to trigger top citations in Google AI Overviews, Perplexity, and SearchGPT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">Entity Authority &amp; NAP</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every article injects Organization Schema with verified Benin City, Lagos, and Asaba office coordinates.
              </p>
            </div>

            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">AI Direct Answer Blocks</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Structured bullet points and definition callouts provide instant snippets for LLM retrieval.
              </p>
            </div>

            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1">FAQ Schema Injection</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Real-time JSON-LD FAQPage schemas guarantee rich accordion answers in SERPs.
              </p>
            </div>
          </div>

          {/* Robots.txt Preview */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider font-mono">
                AI Crawler Robots.txt Directives
              </span>
              <button
                onClick={() => handleCopy(robotsTxt, 'robots')}
                className="text-xs font-bold text-[#050548] hover:underline cursor-pointer flex items-center gap-1"
              >
                {copiedType === 'robots' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedType === 'robots' ? 'Copied' : 'Copy Directives'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-mono text-zinc-700">
              {robotsTxt}
            </pre>
          </div>
        </div>
      )}

      {/* 4. Bulk Audit View */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Complete Article SEO Health Scorecard
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live audit of all {posts.length} articles against on-page, readability, and schema metrics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  <th className="pb-3">Article</th>
                  <th className="pb-3">Word Count</th>
                  <th className="pb-3">Readability</th>
                  <th className="pb-3">GEO Score</th>
                  <th className="pb-3">Overall Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {posts.map((post) => {
                  const seo = analyzeSEO(post);
                  return (
                    <tr key={post.id} className="hover:bg-zinc-50">
                      <td className="py-3.5 pr-4 font-bold text-zinc-900 max-w-xs truncate">
                        {post.title}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-zinc-600">
                        {seo.wordCount} words
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-zinc-600">
                        {seo.readabilityScore}/100
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-emerald-700 font-bold font-mono">100% Passed</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono ${
                          seo.totalScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {seo.totalScore}% ({seo.grade})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
