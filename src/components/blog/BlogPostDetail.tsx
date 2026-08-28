/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Eye, 
  Share2, 
  Check, 
  Bookmark, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Car,
  ChevronRight,
  Heart,
  Volume2,
  Play,
  Pause,
  Maximize2,
  X,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ListOrdered,
  Lightbulb
} from 'lucide-react';
import { BlogPost, BlogComment } from '../../types';
import { 
  fetchPostBySlug, 
  fetchPosts, 
  incrementPostViews, 
  addComment, 
  likePost, 
  toggleBookmarkSlug, 
  getBookmarkedSlugs 
} from '../../services/firebase';
import { stripHtml } from '../../services/aiSeoService';
import BlogSEOMeta from './BlogSEOMeta';

interface BlogPostDetailProps {
  slug: string;
  setView: (view: string) => void;
  setSelectedSlug: (slug: string) => void;
}

export default function BlogPostDetail({ slug, setView, setSelectedSlug }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  // Likes and Bookmarks
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Audio Text-to-Speech narration
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState<boolean>(false);

  // Lightbox Zoom
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Interactive Route & Cost Estimator widget state
  const [estimatorOrigin, setEstimatorOrigin] = useState('Benin City');
  const [estimatorDest, setEstimatorDest] = useState('Lagos');
  const [estimatorVehicle, setEstimatorVehicle] = useState('toyota_prado');
  const [estimatorEscort, setEstimatorEscort] = useState(true);

  // Comments state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // FAQ Accordion open states
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  // How-To Protocol checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadPost = async () => {
      setLoading(true);
      const [currentPost, allPosts] = await Promise.all([
        fetchPostBySlug(slug),
        fetchPosts(),
      ]);

      if (mounted) {
        if (currentPost) {
          setPost(currentPost);
          setLikes(currentPost.likesCount || 0);
          incrementPostViews(currentPost.id || currentPost.slug);

          const bookmarked = getBookmarkedSlugs().includes(currentPost.slug);
          setIsBookmarked(bookmarked);

          const related = allPosts
            .filter((p) => p.slug !== currentPost.slug && p.status === 'published')
            .slice(0, 3);
          setRelatedPosts(related);
        }
        setLoading(false);
      }
    };

    loadPost();

    return () => {
      mounted = false;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slug]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / (windowHeight || 1);
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract Table of Contents from H2 in post content
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    const h2Matches = post.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi);
    const toc: { id: string; text: string }[] = [];
    for (const match of h2Matches) {
      const text = match[1].replace(/<[^>]*>/g, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      toc.push({ id, text });
    }
    return toc;
  }, [post?.content]);

  // Process HTML content to inject IDs into H2 tags for anchor jumping
  const processedContent = useMemo(() => {
    if (!post?.content) return '';
    return post.content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attr, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h2 id="${id}" ${attr}>${text}</h2>`;
    });
  }, [post?.content]);

  // Audio Speech synthesis toggle
  const toggleAudioNarration = () => {
    if (!speechSynthesisAvailable || !post) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = `${post.title}. ${post.excerpt}. ${stripHtml(post.content)}`;
      const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 4000));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    setHasLiked(true);
    const newLikes = await likePost(post.id);
    setLikes(newLikes);
  };

  const handleBookmarkToggle = () => {
    if (!post) return;
    const newState = toggleBookmarkSlug(post.slug);
    setIsBookmarked(newState);
    setBookmarkToast(newState ? 'Saved to your Reading List!' : 'Removed from Reading List');
    setTimeout(() => setBookmarkToast(null), 3000);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const titleText = post?.title || 'Engraced Logistics Executive Blog';

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(titleText + ' - ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(titleText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authorName || !commentText || !post) return;
    setSubmittingComment(true);

    const newComment = await addComment(post.id, {
      authorName,
      authorEmail,
      content: commentText,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
    });

    setPost((prev) => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null);
    setAuthorName('');
    setAuthorEmail('');
    setCommentText('');
    setSubmittingComment(false);
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 5000);
  };

  // Estimate Calculation
  const estimatedCost = useMemo(() => {
    let base = 85000;
    if (estimatorVehicle === 'land_cruiser') base = 160000;
    if (estimatorVehicle === 'hilux_escort') base = 120000;
    if (estimatorVehicle === 'toyota_hiace') base = 110000;

    let distanceMultiplier = 1;
    if (estimatorOrigin !== estimatorDest) distanceMultiplier = 1.6;
    if (estimatorEscort) base += 75000;

    return Math.round(base * distanceMultiplier);
  }, [estimatorOrigin, estimatorDest, estimatorVehicle, estimatorEscort]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#050548] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-semibold font-mono text-xs uppercase tracking-wider">Loading Executive Insight...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Article Not Found</h2>
        <p className="text-zinc-500 text-sm mb-6">The executive insight or route intelligence piece you requested may have been archived.</p>
        <button
          onClick={() => setView('blog')}
          className="bg-[#050548] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
        >
          Return to Blog Hub
        </button>
      </div>
    );
  }

  return (
    <>
      <BlogSEOMeta post={post} />

      {/* Reading Progress Indicator Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#050548] via-[#0A0A78] to-blue-500 z-[60] transition-all duration-150"
        style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
      />

      <article className="pt-32 sm:pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen text-left font-sans">
        
        {/* Breadcrumb Navigation & Top Tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b border-zinc-100">
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
            <button onClick={() => setView('home')} className="hover:text-zinc-900 cursor-pointer">Home</button>
            <span>/</span>
            <button onClick={() => setView('blog')} className="hover:text-zinc-900 cursor-pointer">Blog</button>
            <span>/</span>
            <span className="text-[#050548] font-bold truncate max-w-xs">{post.category.replace('-', ' ')}</span>
          </nav>

          <div className="flex items-center gap-3">
            {/* Audio Reader Button */}
            {speechSynthesisAvailable && (
              <button
                onClick={toggleAudioNarration}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
                title="Listen to this article with AI voice narration"
              >
                {isPlayingAudio ? <Pause size={13} /> : <Volume2 size={13} />}
                <span>{isPlayingAudio ? 'Pause Audio' : 'Listen with AI'}</span>
              </button>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
              title="Save to Reading List"
            >
              <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Header Metadata & Title */}
        <header className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-zinc-500 mb-4">
            <span className="bg-[#050548]/10 text-[#050548] px-3.5 py-1 rounded-full uppercase tracking-wider">
              {post.category.replace('-', ' ')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {post.readingTimeMinutes} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye size={13} /> {post.viewsCount.toLocaleString()} reads
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-zinc-600 text-lg sm:text-xl leading-relaxed mb-8 font-sans">
            {post.excerpt}
          </p>

          {/* Author Badge & Fast Social Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-zinc-200">
            <div className="flex items-center gap-3.5">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#050548]/20" 
              />
              <div>
                <span className="text-sm font-bold text-zinc-900 block">{post.author.name}</span>
                <span className="text-xs text-zinc-500 block">{post.author.role}</span>
              </div>
            </div>

            {/* Quick Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1">Share:</span>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm text-xs font-bold"
                title="Share on WhatsApp"
              >
                WA
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all cursor-pointer shadow-sm text-xs font-bold"
                title="Share on X"
              >
                X
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all cursor-pointer shadow-sm text-xs font-bold"
                title="Share on LinkedIn"
              >
                in
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center gap-1.5 hover:bg-[#050548] hover:text-white hover:border-[#050548] transition-all cursor-pointer shadow-sm text-xs font-bold"
                title="Copy link"
              >
                {copied ? <Check size={13} /> : <Share2 size={13} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image with Zoom Trigger */}
        <div 
          onClick={() => setLightboxImage(post.coverImage)}
          className="max-w-4xl mx-auto mb-14 rounded-3xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-100 h-80 sm:h-[480px] relative group cursor-zoom-in"
        >
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={13} />
            <span>Click to Expand</span>
          </div>
        </div>

        {/* Article Body & Sticky Sidebar Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            
            {/* AI Search & Generative Engine Summary Box */}
            {post.seo?.keyTakeaways && post.seo.keyTakeaways.length > 0 && (
              <div className="mb-10 bg-gradient-to-br from-[#050548]/5 via-[#0A0A78]/5 to-transparent border border-[#050548]/20 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#050548] mb-3 font-mono">
                  <Sparkles size={16} className="text-[#050548]" />
                  <span>AI Executive Summary &amp; Key Takeaways</span>
                </div>
                <ul className="space-y-2 text-sm text-zinc-700 leading-relaxed list-disc list-inside">
                  {post.seo.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="font-medium">{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* INTERACTIVE HOW-TO PROTOCOL STEPS CHECKLIST */}
            {post.postType === 'how-to' && post.howToSteps && post.howToSteps.length > 0 && (
              <div className="mb-12 bg-gradient-to-br from-blue-50/50 via-white to-white border-2 border-blue-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header with Progress Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#050548] font-mono mb-1">
                      <ListOrdered size={16} />
                      <span>Step-by-Step Protocol Checklist</span>
                    </div>
                    <h3 className="text-xl font-black text-zinc-950">
                      Sequential Execution Checklist
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-zinc-200 shadow-xs font-mono text-xs">
                    <span className="font-bold text-[#050548]">
                      {Object.values(completedSteps).filter(Boolean).length} of {post.howToSteps.length} Steps Done
                    </span>
                  </div>
                </div>

                {/* Requirements info banner */}
                {(post.totalDuration || (post.prerequisites && post.prerequisites.length > 0)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-xs">
                    {post.totalDuration && (
                      <div className="flex items-center gap-2 text-zinc-700">
                        <Clock size={14} className="text-[#050548] shrink-0" />
                        <span><strong>Total Duration:</strong> {post.totalDuration}</span>
                      </div>
                    )}
                    {post.prerequisites && post.prerequisites.length > 0 && (
                      <div className="flex items-center gap-2 text-zinc-700">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Prerequisites:</strong> {post.prerequisites.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Steps List with Interactive Checkbox */}
                <div className="space-y-4">
                  {post.howToSteps.map((step, idx) => {
                    const isDone = completedSteps[idx] || false;
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : 'bg-white border-zinc-200 shadow-xs hover:border-[#050548]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all cursor-pointer ${
                                isDone 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'bg-[#050548] text-white shadow-xs hover:bg-[#0A0A78]'
                              }`}
                              title={isDone ? 'Mark as incomplete' : 'Mark step completed'}
                            >
                              {isDone ? <Check size={14} /> : String(idx + 1).padStart(2, '0')}
                            </button>
                            <div>
                              <h4 className={`font-bold text-sm sm:text-base ${isDone ? 'line-through text-zinc-500' : 'text-zinc-950'}`}>
                                {step.title}
                              </h4>
                            </div>
                          </div>

                          {step.duration && (
                            <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg shrink-0">
                              ⏱️ {step.duration}
                            </span>
                          )}
                        </div>

                        <p className={`text-xs sm:text-sm leading-relaxed pl-10 ${isDone ? 'text-zinc-400' : 'text-zinc-700'}`}>
                          {step.description}
                        </p>

                        {/* Step Sub-Checklist */}
                        {step.checklist && step.checklist.length > 0 && (
                          <div className="mt-3 ml-10 space-y-1.5 bg-zinc-50/80 p-3 rounded-xl border border-zinc-200">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                              Action Items:
                            </span>
                            {step.checklist.map((item, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2 text-xs text-zinc-700">
                                <span className="w-4 h-4 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                                <span className={isDone ? 'line-through text-zinc-400' : ''}>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.tip && (
                          <div className="mt-3 ml-10 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                            <Lightbulb size={14} className="text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Pro-Tip:</strong> {step.tip}</span>
                          </div>
                        )}

                        {step.image && (
                          <div className="mt-3 ml-10 rounded-xl overflow-hidden border border-zinc-200 max-w-md">
                            <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                            {step.imageCaption && (
                              <div className="p-2 bg-zinc-50 text-[11px] text-zinc-500 italic border-t border-zinc-200">
                                {step.imageCaption}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rich Article Prose Body */}
            <div 
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Interactive In-Article Rental Cost & Route Estimator */}
            <div className="my-12 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#050548] mb-2 font-mono">
                <Calculator size={16} />
                <span>Executive Trip Cost &amp; Fleet Estimator</span>
              </div>
              <h3 className="text-xl font-black text-zinc-900 mb-2">Estimate Your Route Logistics Rate</h3>
              <p className="text-xs text-zinc-500 mb-6">Calculate estimated pricing for Prado, Land Cruiser, and armed tactical escort convoys.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Departure Corridor</label>
                  <select
                    value={estimatorOrigin}
                    onChange={(e) => setEstimatorOrigin(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800"
                  >
                    <option value="Benin City">Benin City (GRA / Airport)</option>
                    <option value="Lagos">Lagos (VI / Ikeja / Airport)</option>
                    <option value="Asaba">Asaba (Delta State)</option>
                    <option value="Abuja">Abuja (FCT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Destination</label>
                  <select
                    value={estimatorDest}
                    onChange={(e) => setEstimatorDest(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800"
                  >
                    <option value="Benin City">Benin City Intra-City</option>
                    <option value="Lagos">Lagos Expressway Corridor</option>
                    <option value="Asaba">Asaba / Onitsha Hub</option>
                    <option value="Abuja">Abuja Interstate Route</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Vehicle Platform</label>
                  <select
                    value={estimatorVehicle}
                    onChange={(e) => setEstimatorVehicle(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800"
                  >
                    <option value="toyota_prado">Toyota Prado TXL (Executive)</option>
                    <option value="land_cruiser">Toyota Land Cruiser V8 (Presidential)</option>
                    <option value="hilux_escort">Toyota Hilux 4x4 Escort Detail</option>
                    <option value="toyota_hiace">Toyota Hiace VIP Commuter</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-200 self-end">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Include Armed Escort</span>
                    <span className="text-[10px] text-zinc-400">Tactical convoy protection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={estimatorEscort}
                    onChange={(e) => setEstimatorEscort(e.target.checked)}
                    className="w-4 h-4 text-[#050548] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Estimated Rate / Day</span>
                  <div className="text-2xl font-black text-[#050548] font-mono">
                    ₦{estimatedCost.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setView('booking')}
                  className="bg-[#050548] hover:bg-[#0A0A78] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Reserve This Ride in Booking Desk &rarr;
                </button>
              </div>
            </div>

            {/* Likes / Claps & Topic Tags Bar */}
            <div className="pt-8 mt-10 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
              {/* Like / Claps Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                  hasLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105 shadow-sm' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                <span className="text-xs font-bold font-mono">{likes} Likes</span>
              </button>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-[#050548]/10 hover:text-[#050548] px-3 py-1 rounded-lg transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Accordion Section */}
            {post.seo?.faqSchema && post.seo.faqSchema.length > 0 && (
              <section className="mt-14 pt-10 border-t border-zinc-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#050548] mb-2 font-mono">
                  <HelpCircle size={16} />
                  <span>Executive FAQ</span>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-6">Frequently Asked Questions</h3>

                <div className="space-y-3">
                  {post.seo.faqSchema.map((faq, idx) => {
                    const isOpen = openFaqs[idx] ?? (idx === 0);
                    return (
                      <div 
                        key={idx} 
                        className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-zinc-900 hover:text-[#050548] transition-colors cursor-pointer text-sm sm:text-base"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp size={18} className="text-[#050548] shrink-0" /> : <ChevronDown size={18} className="text-zinc-400 shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-zinc-600 text-sm leading-relaxed border-t border-zinc-100 bg-zinc-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Author Spotlight Bio Card */}
            <div className="mt-14 p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" 
              />
              <div>
                <span className="text-[11px] font-bold text-[#050548] uppercase tracking-wider block mb-1 font-mono">Author Spotlight</span>
                <h4 className="text-lg font-black text-zinc-900 mb-1">{post.author.name}</h4>
                <p className="text-xs font-semibold text-zinc-500 mb-2">{post.author.role}</p>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {post.author.bio || 'Logistics and tactical protocol specialist at Engraced Logistics, providing security and corporate fleet leadership across Nigeria.'}
                </p>
              </div>
            </div>

            {/* Interactive Comments Section */}
            <section className="mt-16 pt-10 border-t border-zinc-200">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={20} className="text-[#050548]" />
                <h3 className="text-2xl font-black text-zinc-900">
                  Executive Discussion ({post.comments?.length || 0})
                </h3>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-10">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#050548]/10 text-[#050548] font-bold flex items-center justify-center text-xs font-mono">
                            {comment.authorName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-zinc-900">{comment.authorName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pl-10">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 text-xs sm:text-sm italic py-4">
                    No comments posted yet. Be the first executive to join the discussion.
                  </p>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-3xl">
                <h4 className="text-base font-bold text-zinc-900 mb-4">Leave a Comment / Inquiry</h4>
                
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#050548] font-sans"
                    />
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="Corporate Email (Optional)"
                      className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#050548] font-sans"
                    />
                  </div>

                  <textarea
                    required
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your feedback or operational inquiry regarding this guide..."
                    className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-xs sm:text-sm focus:outline-none focus:border-[#050548] font-sans"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-sans">
                      Comments are verified by our moderation team.
                    </span>

                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="bg-[#050548] hover:bg-[#030330] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Send size={13} />
                      <span>{submittingComment ? 'Posting...' : 'Submit Comment'}</span>
                    </button>
                  </div>

                  {commentSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                      <Check size={15} />
                      <span>Your comment has been submitted and published!</span>
                    </div>
                  )}
                </form>
              </div>
            </section>

          </div>

          {/* Sticky Sidebar Column (Table of Contents & Booking CTA) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Sticky Table of Contents Container */}
            {tableOfContents.length > 0 && (
              <div className="sticky top-28 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#050548] font-mono">
                    Table of Contents
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">{tableOfContents.length} Sections</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
                  {tableOfContents.map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block py-1 hover:text-[#050548] hover:translate-x-1 transition-all"
                      >
                        <span className="text-zinc-400 mr-2 font-mono">{idx + 1}.</span>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Direct Vehicle Booking Quick Action */}
                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <div className="p-4 bg-gradient-to-br from-[#050548] to-[#030330] rounded-2xl text-white text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
                      <Car size={14} />
                      <span>Need This Vehicle?</span>
                    </div>
                    <h5 className="font-bold text-sm mb-2">Book Executive Chauffeur &amp; Escort</h5>
                    <p className="text-[11px] text-zinc-300 mb-4 leading-relaxed">
                      Instant reservation for Prado, Land Cruiser &amp; tactical convoys across Benin City &amp; Nigeria.
                    </p>
                    <button
                      onClick={() => setView('booking')}
                      className="w-full bg-white text-[#050548] hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl text-center cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      Open Booking Desk
                    </button>
                  </div>
                </div>
              </div>
            )}

          </aside>

        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-14 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#050548] uppercase tracking-widest font-mono block">Recommended Reading</span>
                <h3 className="text-2xl font-black text-zinc-900">Related Executive Insights</h3>
              </div>

              <button
                onClick={() => setView('blog')}
                className="text-xs font-bold uppercase tracking-wider text-[#050548] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Articles</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  onClick={() => {
                    setSelectedSlug(rPost.slug);
                    window.scrollTo({ top: 0, behavior: 'instant' as any });
                  }}
                  className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-lg transition-all p-4 cursor-pointer group flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="h-40 rounded-xl overflow-hidden mb-3 bg-zinc-100">
                      <img src={rPost.coverImage} alt={rPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#050548] bg-[#050548]/10 px-2 py-0.5 rounded-md">
                      {rPost.category.replace('-', ' ')}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-900 mt-2 line-clamp-2 group-hover:text-[#050548] transition-colors">
                      {rPost.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <span>{rPost.readingTimeMinutes} min read</span>
                    <span className="text-[#050548] font-bold group-hover:translate-x-1 transition-transform">Read &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </article>

      {/* Lightbox Zoom Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={lightboxImage} alt="Expanded Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert for Bookmarks */}
      {bookmarkToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050548] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slide-up border border-[#050548]/30">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{bookmarkToast}</span>
        </div>
      )}
    </>
  );
}
