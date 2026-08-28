/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Search, 
  Clock, 
  Eye, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft,
  Mail, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  BookmarkCheck,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, BlogCategory } from '../../types';
import { fetchPosts, fetchCategories, subscribeNewsletter, getBookmarkedSlugs } from '../../services/firebase';
import BlogSEOMeta from './BlogSEOMeta';

interface BlogCatalogProps {
  setView: (view: string) => void;
  setSelectedSlug: (slug: string) => void;
}

export default function BlogCatalog({ setView, setSelectedSlug }: BlogCatalogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'readingTime'>('latest');
  const [readTimeFilter, setReadTimeFilter] = useState<'all' | 'quick' | 'deep'>('all');
  const [activeArchetypeFilter, setActiveArchetypeFilter] = useState<'all' | 'how-to' | 'comparison' | 'case-study' | 'standard'>('all');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [fetchedPosts, fetchedCats] = await Promise.all([
        fetchPosts(),
        fetchCategories(),
      ]);
      setPosts(fetchedPosts.filter((p) => p.status === 'published'));
      setCategories(fetchedCats);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    const res = await subscribeNewsletter(newsletterEmail);
    if (res.success) {
      setNewsletterStatus('success');
      setNewsletterMsg(res.message);
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
      setNewsletterMsg(res.message);
    }
  };

  const bookmarkedSlugs = useMemo(() => {
    return getBookmarkedSlugs();
  }, [posts]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 10);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (showOnlyBookmarks && !bookmarkedSlugs.includes(post.slug)) {
          return false;
        }

        const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
        const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
        
        let matchesArchetype = true;
        if (activeArchetypeFilter !== 'all') {
          matchesArchetype = (post.postType || 'standard') === activeArchetypeFilter;
        }

        let matchesReadTime = true;
        if (readTimeFilter === 'quick') matchesReadTime = (post.readingTimeMinutes || 4) <= 4;
        if (readTimeFilter === 'deep') matchesReadTime = (post.readingTimeMinutes || 4) > 4;

        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags?.some((t) => t.toLowerCase().includes(q)) ||
          post.author.name.toLowerCase().includes(q);

        return matchesCategory && matchesTag && matchesArchetype && matchesReadTime && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
        if (sortBy === 'readingTime') return (b.readingTimeMinutes || 0) - (a.readingTimeMinutes || 0);
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [posts, activeCategory, selectedTag, activeArchetypeFilter, readTimeFilter, showOnlyBookmarks, searchQuery, sortBy, bookmarkedSlugs]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const POSTS_PER_PAGE = 6;

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedTag, activeArchetypeFilter, readTimeFilter, showOnlyBookmarks, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage, POSTS_PER_PAGE]);

  const sliderPosts = useMemo(() => {
    return posts.filter((p) => p.featured).concat(posts.filter((p) => !p.featured)).slice(0, 4);
  }, [posts]);

  const currentCategoryObj = categories.find((c) => c.slug === activeCategory);

  const openPost = (slug: string) => {
    setSelectedSlug(slug);
    setView('blog-post');
  };

  const nextSlide = () => {
    if (sliderPosts.length > 0) {
      setActiveSlideIndex((prev) => (prev + 1) % sliderPosts.length);
    }
  };

  const prevSlide = () => {
    if (sliderPosts.length > 0) {
      setActiveSlideIndex((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length);
    }
  };

  // Auto slide timer
  useEffect(() => {
    if (sliderPosts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % sliderPosts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderPosts]);

  return (
    <>
      <BlogSEOMeta isCatalog={true} categoryName={currentCategoryObj?.name} />

      <div className="pt-32 sm:pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen font-sans">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050548]/10 text-[#050548] text-xs font-bold uppercase tracking-widest mb-4 font-mono border border-[#050548]/15">
            <Sparkles size={14} className="text-[#050548]" />
            <span>Executive Insights &amp; Logistics Protocols</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight mb-4">
            Executive Travel, Security &amp; <span className="text-[#050548]">Fleet Intelligence</span>
          </h1>
          
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            The authoritative intelligence source for corporate delegations, diaspora executives, and luxury travelers navigating Benin City, Lagos, Abuja, and Nigerian corridors.
          </p>
        </div>

        {/* Interactive Featured Stories Slider / Carousel */}
        {sliderPosts.length > 0 && activeCategory === 'all' && !searchQuery && !selectedTag && !showOnlyBookmarks && (
          <div className="mb-14 relative group">
            {sliderPosts.map((post, idx) => {
              if (idx !== activeSlideIndex) return null;
              return (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl border border-zinc-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => openPost(post.slug)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden bg-zinc-900">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                      <div className="absolute top-4 left-4 bg-[#050548] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 font-mono">
                        <Zap size={13} className="text-amber-400" />
                        <span>Featured Briefing #{idx + 1}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white text-left">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 mb-3">
                          <span className="bg-[#050548]/10 text-[#050548] px-3 py-1 rounded-full uppercase tracking-wider font-bold font-mono">
                            {post.category.replace('-', ' ')}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock size={12} /> {post.readingTimeMinutes} min read
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Eye size={12} /> {post.viewsCount.toLocaleString()} views
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight mb-4 group-hover:text-[#050548] transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#050548]/20" 
                          />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">{post.author.name}</span>
                            <span className="text-[11px] text-zinc-500 font-mono block">{post.author.role}</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#050548] group-hover:translate-x-1 transition-transform font-mono">
                          <span>Read Full Briefing</span>
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Carousel Navigation Arrows & Dots */}
            {sliderPosts.length > 1 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                  {sliderPosts.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex(dotIdx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeSlideIndex === dotIdx
                          ? 'w-8 bg-[#050548]'
                          : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                      title={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 shadow-sm cursor-pointer transition-colors"
                    title="Previous Slide"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 shadow-sm cursor-pointer transition-colors"
                    title="Next Slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Controls & Search Bar */}
        <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, routes, fleet..."
              className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#050548] transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Toggles (Bookmarks & Read Length) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            
            {/* Bookmarks Filter */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                showOnlyBookmarks 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Show only bookmarked reading list"
            >
              <Bookmark size={13} fill={showOnlyBookmarks ? 'currentColor' : 'none'} />
              <span>Saved ({bookmarkedSlugs.length})</span>
            </button>

            {/* Read Length Filter */}
            <div className="flex items-center bg-white border border-zinc-200 p-1 rounded-xl">
              <button
                onClick={() => setReadTimeFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                  readTimeFilter === 'all' ? 'bg-[#050548] text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setReadTimeFilter('quick')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                  readTimeFilter === 'quick' ? 'bg-[#050548] text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                &le; 4m
              </button>
              <button
                onClick={() => setReadTimeFilter('deep')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                  readTimeFilter === 'deep' ? 'bg-[#050548] text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                5m+
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 uppercase tracking-wider focus:outline-none focus:border-[#050548] cursor-pointer shadow-sm font-mono"
            >
              <option value="latest">Latest Published</option>
              <option value="views">Most Viewed</option>
              <option value="readingTime">In-Depth Guides</option>
            </select>
          </div>
        </div>

        {/* Compact Single-Line Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar flex-nowrap scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); setSelectedTag(null); }}
              className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer relative shrink-0 ${
                activeCategory === cat.slug && !selectedTag
                  ? 'bg-[#050548] text-white shadow-md shadow-[#050548]/20 font-black'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Compact Single-Line Post Format Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar flex-nowrap scroll-smooth">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-1">
            Format:
          </span>
          {[
            { id: 'all', label: 'All Publications' },
            { id: 'how-to', label: 'How-To Protocols' },
            { id: 'standard', label: 'Executive Editorials' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setActiveArchetypeFilter(fmt.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeArchetypeFilter === fmt.id
                  ? 'bg-[#050548] text-white shadow-sm font-black'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Hot Topic Tags Chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-10 text-xs text-zinc-500">
            <span className="font-bold text-[11px] uppercase tracking-wider font-mono text-zinc-400 mr-1">Hot Topics:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag 
                    ? 'bg-[#050548] text-white' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer ml-1"
              >
                Clear Tag Filter
              </button>
            )}
          </div>
        )}

        {/* Article Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#050548] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Loading Executive Insights...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-300 p-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-zinc-200 rounded-2xl flex items-center justify-center text-zinc-500">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 mb-1">No Articles Found</h3>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto mb-5">
              We couldn't find any articles matching your search criteria.
            </p>
            <button 
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedTag(null); setShowOnlyBookmarks(false); setReadTimeFilter('all'); }}
              className="bg-[#050548] text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer text-left"
                  onClick={() => openPost(post.slug)}
                >
                  <div>
                    {/* Image container */}
                    <div className="relative h-52 overflow-hidden bg-zinc-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-white/95 backdrop-blur-sm text-[#050548] text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm font-mono">
                          {post.category.replace('-', ' ')}
                        </span>
                        {post.postType && post.postType !== 'standard' && (
                          <span className="bg-[#050548]/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm font-mono flex items-center gap-1">
                            {post.postType === 'how-to' ? (
                              <>
                                <Zap size={11} className="text-amber-400" />
                                <span>How-To</span>
                              </>
                            ) : post.postType === 'comparison' ? (
                              <>
                                <SlidersHorizontal size={11} className="text-blue-300" />
                                <span>Comparison</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={11} className="text-emerald-300" />
                                <span>Case Study</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body container */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.readingTimeMinutes}m read
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-zinc-900 leading-snug mb-2.5 group-hover:text-[#050548] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Tags preview */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] bg-zinc-100 text-zinc-600 font-medium px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer bar */}
                  <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-7 h-7 rounded-full object-cover border border-zinc-200" 
                      />
                      <span className="text-xs font-semibold text-zinc-700 truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#050548] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-50 border border-zinc-200/80 rounded-3xl mb-16">
                <div className="text-xs font-mono text-zinc-500 font-semibold text-left">
                  Showing <strong className="text-zinc-900">{(currentPage - 1) * POSTS_PER_PAGE + 1}</strong> to <strong className="text-zinc-900">{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)}</strong> of <strong className="text-zinc-900">{filteredPosts.length}</strong> articles
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
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
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Executive Newsletter Subscription Hub */}
        <div className="bg-gradient-to-br from-[#050548] to-[#030330] rounded-3xl p-8 sm:p-12 text-white text-left relative overflow-hidden shadow-2xl mb-16">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-[#0A0A78]/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4 font-mono">
              <Mail size={13} />
              <span>Executive Briefing</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
              Get Highway Security &amp; Fleet Intelligence Delivered
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
              Subscribe to Engraced Executive Briefs for monthly route safety updates, presidential convoy insights, and exclusive corporate charter privileges.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your executive email address"
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-white focus:bg-white/20 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="bg-white text-[#050548] hover:bg-zinc-100 text-xs sm:text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 shadow-lg"
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Join Registry'}
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 size={16} />
                <span>{newsletterMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Fast Links & Admin CMS Prompt */}
        <div className="text-center pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <span>&copy; {new Date().getFullYear()} ENGRACED LOGISTICS EDITORIAL &amp; FLEET DESK</span>
          <button
            onClick={() => setView('admin-cms')}
            className="text-[#050548] font-bold hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck size={14} />
            <span>Admin Studio &amp; CMS Login</span>
          </button>
        </div>

      </div>
    </>
  );
}
