/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ListChecks, 
  Eye, 
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  FileText,
  Zap,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { BlogPost } from '../types';
import { fetchPosts } from '../services/firebase';
import { INITIAL_BLOG_POSTS } from '../data/blogData';

interface LandingBlogSectionProps {
  setView: (view: string) => void;
  setSelectedSlug: (slug: string) => void;
}

export default function LandingBlogSection({ setView, setSelectedSlug }: LandingBlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'how-to' | 'fleet-spotlight' | 'vip-protocol'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    fetchPosts().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setPosts(fetched);
      }
    });
  }, []);

  const handleOpenArticle = (slug: string) => {
    setSelectedSlug(slug);
    setView('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'how-to') return post.postType === 'how-to';
    return post.category === selectedFilter;
  });

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE) || 1;
  const pagePosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const featuredPost = pagePosts[0] || filteredPosts[0];
  const howToPost = pagePosts.find((p) => p.postType === 'how-to' && p.id !== featuredPost?.id) || pagePosts[1];
  const fleetPost = pagePosts.find((p) => p.category === 'fleet-spotlight' && p.id !== featuredPost?.id && p.id !== howToPost?.id) || pagePosts[2];
  const remainingPosts = pagePosts.filter((p) => p.id !== featuredPost?.id && p.id !== howToPost?.id && p.id !== fleetPost?.id);

  const handleFilterChange = (filterId: any) => {
    setSelectedFilter(filterId);
    setCurrentPage(1);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050548]/5 text-[#050548] text-xs font-bold uppercase tracking-widest font-mono mb-3 border border-[#050548]/10">
            <Sparkles size={13} className="text-[#050548]" />
            <span>Verified Logistics Guides &amp; Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Highway Intelligence &amp; Fleet Protocols
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
            Verified step-by-step executive protocols, route intelligence across Edo State and interstate corridors, and luxury fleet benchmarks.
          </p>
        </div>

        {/* Compact Single-Line Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 overflow-x-auto no-scrollbar flex-nowrap shrink-0 max-w-full">
          {[
            { id: 'all', label: 'All Insights', icon: BookOpen },
            { id: 'how-to', label: 'How-To Protocols', icon: Zap },
            { id: 'fleet-spotlight', label: 'Fleet Reviews', icon: Layers },
            { id: 'vip-protocol', label: 'VIP Escort Guides', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-[#050548] shadow-sm font-black'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                <Icon size={13} className={isSelected ? 'text-[#050548]' : 'text-zinc-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LUXURY BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento Cell 1: Large Featured Spotlight (Span 8) */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => handleOpenArticle(featuredPost.slug)}
            className="md:col-span-12 lg:col-span-8 group bg-zinc-900 text-white rounded-3xl overflow-hidden shadow-xl border border-zinc-800 cursor-pointer flex flex-col justify-between hover:border-[#050548]/80 transition-all duration-300 relative min-h-[420px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#050548] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-white/20 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>{featuredPost.category.replace('-', ' ')}</span>
                </span>
                {featuredPost.readingTimeMinutes && (
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
                    <Clock size={11} className="text-amber-400" />
                    <span>{featuredPost.readingTimeMinutes} min read</span>
                  </span>
                )}
              </div>

              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                Featured Flagship
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                Verified Executive Briefing
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-2xl">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <img 
                    src={featuredPost.author.avatar} 
                    alt={featuredPost.author.name}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-700" 
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{featuredPost.author.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{featuredPost.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform font-mono">
                  <span>Read Briefing</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bento Cell 2: Step-by-Step How-To Card (Span 4) */}
        {howToPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => handleOpenArticle(howToPost.slug)}
            className="md:col-span-6 lg:col-span-4 group bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#050548]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
                  <Zap size={12} className="text-amber-700" />
                  <span>Protocol Guide</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <Eye size={12} />
                  <span>{(howToPost.viewsCount || 3420).toLocaleString()} reads</span>
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-zinc-950 group-hover:text-[#050548] transition-colors leading-snug mb-3">
                {howToPost.title}
              </h4>

              <p className="text-xs text-zinc-600 line-clamp-3 mb-4 leading-relaxed">
                {howToPost.excerpt}
              </p>

              {/* Protocol Step Checklist Preview */}
              <div className="space-y-2 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                  Protocol Steps Included:
                </span>
                <div className="space-y-1.5 text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">1. Threat assessment &amp; route review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">2. 48-point vehicle safety staging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">3. Tarmac greeting &amp; escort dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-100 text-xs font-bold text-[#050548] font-mono uppercase tracking-wider">
              <span>View Step Breakdown</span>
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}

        {/* Bento Cell 3: Fleet Review Card (Span 4) */}
        {fleetPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => handleOpenArticle(fleetPost.slug)}
            className="md:col-span-6 lg:col-span-4 group bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#050548]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="relative h-44 -mx-6 -mt-6 mb-5 overflow-hidden bg-zinc-100">
                <img 
                  src={fleetPost.coverImage} 
                  alt={fleetPost.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 bg-[#050548] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {fleetPost.category.replace('-', ' ')}
                </span>
              </div>

              <h4 className="text-lg font-black text-zinc-950 group-hover:text-[#050548] transition-colors line-clamp-2 mb-2">
                {fleetPost.title}
              </h4>

              <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                {fleetPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 text-xs font-bold text-[#050548] font-mono uppercase tracking-wider">
              <span>Explore Fleet Specs</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}

        {/* Bento Row 2: Secondary Insights (3 Columns) */}
        {remainingPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            onClick={() => handleOpenArticle(post.slug)}
            className="md:col-span-6 lg:col-span-4 group bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-[#050548]/40 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex gap-3.5 items-start">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-zinc-100" 
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono block">
                  {post.category.replace('-', ' ')}
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-2 group-hover:text-[#050548] transition-colors mt-0.5">
                  {post.title}
                </h5>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                <span>{post.readingTimeMinutes} min</span>
              </span>
              <span className="font-bold text-[#050548] group-hover:underline">Read &rarr;</span>
            </div>
          </motion.div>
        ))}

      </div>

      {/* Pagination Controls (if more than 1 page) */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
          <span className="text-xs font-mono text-zinc-500 font-semibold">
            Showing Page <strong className="text-zinc-900">{currentPage}</strong> of <strong className="text-zinc-900">{totalPages}</strong> ({filteredPosts.length} Articles)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#050548] text-white shadow-md'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Next Page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hub CTA Action */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setView('blog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#050548] hover:bg-[#0A0A78] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer font-mono"
        >
          <BookOpen size={16} />
          <span>Enter Full Executive Blog Catalog ({posts.length} Publications)</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </section>
  );
}