/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Lightbulb, 
  Tag, 
  Search, 
  ExternalLink, 
  Sliders, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert,
  Check, 
  Image as ImageIcon, 
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { 
  BlogPost, 
  BlogCategory, 
  PostType, 
  HowToStep,
  BlogAuthor
} from '../../types';
import { DEFAULT_AUTHORS } from '../../data/blogData';
import { 
  analyzeSEO, 
  calculateReadingTime, 
  generateSEOTitles, 
  generateMetaDescriptions, 
  generateTargetKeywords, 
  generateAIKeyTakeaways, 
  generateFAQSchema, 
  generateArticleOutline 
} from '../../services/aiSeoService';
import { compressImageToBase64, createInArticleImageHtml } from '../../services/imageService';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface AdminBlogStudioProps {
  initialPost?: BlogPost | null;
  categories: BlogCategory[];
  onSave: (post: BlogPost) => Promise<void>;
  onCancel: () => void;
  onPreviewPublic?: (slug: string) => void;
}

export default function AdminBlogStudio({
  initialPost,
  categories,
  onSave,
  onCancel,
  onPreviewPublic,
}: AdminBlogStudioProps) {
  // Post Type
  const [postType, setPostType] = useState<PostType>(initialPost?.postType || 'how-to');

  // Shared Core Meta
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [category, setCategory] = useState(initialPost?.category || (categories[0]?.slug || 'logistics-guides'));
  const [tagsInput, setTagsInput] = useState(initialPost?.tags ? initialPost.tags.join(', ') : 'Benin City, VIP Escort, Executive Chauffeur');
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>(initialPost?.status || 'published');
  const [featured, setFeatured] = useState<boolean>(initialPost?.featured || false);
  
  // Author State with Brand Logo defaults
  const [authorList, setAuthorList] = useState<BlogAuthor[]>(() => {
    if (initialPost?.author && !DEFAULT_AUTHORS.some(a => a.name === initialPost.author.name)) {
      return [initialPost.author, ...DEFAULT_AUTHORS];
    }
    return DEFAULT_AUTHORS;
  });
  
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(
    initialPost?.author?.id || DEFAULT_AUTHORS[0].id
  );
  const [authorName, setAuthorName] = useState(initialPost?.author?.name || DEFAULT_AUTHORS[0].name);
  const [authorRole, setAuthorRole] = useState(initialPost?.author?.role || DEFAULT_AUTHORS[0].role);
  const [authorAvatar, setAuthorAvatar] = useState(initialPost?.author?.avatar || '/favicon.svg');
  const [isAddingNewAuthor, setIsAddingNewAuthor] = useState(false);
  const [newAuthorNameInput, setNewAuthorNameInput] = useState('');
  const [newAuthorRoleInput, setNewAuthorRoleInput] = useState('');

  const handleSelectAuthor = (authorId: string) => {
    setSelectedAuthorId(authorId);
    const found = authorList.find(a => a.id === authorId);
    if (found) {
      setAuthorName(found.name);
      setAuthorRole(found.role);
      setAuthorAvatar(found.avatar || '/favicon.svg');
    }
  };

  const handleCreateNewAuthor = () => {
    if (!newAuthorNameInput.trim()) return;
    const newAuth: BlogAuthor = {
      id: `author-${Date.now()}`,
      name: newAuthorNameInput.trim(),
      role: newAuthorRoleInput.trim() || 'Operations & Protocol Intelligence',
      avatar: '/favicon.svg', // Always brand with official Engraced logo by default
    };
    setAuthorList([newAuth, ...authorList]);
    setSelectedAuthorId(newAuth.id);
    setAuthorName(newAuth.name);
    setAuthorRole(newAuth.role);
    setAuthorAvatar(newAuth.avatar);
    setNewAuthorNameInput('');
    setNewAuthorRoleInput('');
    setIsAddingNewAuthor(false);
  };

  // ==========================================
  // 📘 1. HOW-TO PROTOCOL FORM STATE
  // ==========================================
  const [howToIntro, setHowToIntro] = useState(
    initialPost?.postType === 'how-to' && initialPost?.content
      ? initialPost.content
      : 'Benin City and Edo State serve as primary commercial transit hubs in Southern Nigeria. Whether arriving for high-level summits, corporate project inspections, or executive family occasions, following a structured security and vehicle booking protocol ensures seamless mobility.'
  );
  const [howToSummary, setHowToSummary] = useState(initialPost?.excerpt || 'A complete step-by-step protocol for reserving luxury chauffeured SUVs, dual armed police escorts, and airport tarmac VIP transfers across Nigeria.');
  const [totalDuration, setTotalDuration] = useState(initialPost?.totalDuration || '15 min');
  const [prerequisitesInput, setPrerequisitesInput] = useState(
    initialPost?.prerequisites ? initialPost.prerequisites.join(', ') : 'Valid Flight Code or Hotel Address, Identity Verification, Convoy Entourage Count'
  );
  const [howToSteps, setHowToSteps] = useState<HowToStep[]>(initialPost?.howToSteps || [
    {
      stepNumber: 1,
      title: 'Select Destination Corridor & Vehicle Platform',
      description: 'Choose your desired vehicle platform (Toyota Prado TXL, Land Cruiser V8, or Hilux) based on your route terrain and entourage size.',
      duration: '3 min',
      tip: 'For interstate corridors like Benin-Lagos, 4x4 SUVs with run-flat capability are strongly advised.',
      checklist: ['Evaluate entourage luggage and passenger count', 'Choose between Prado TXL and Land Cruiser V8']
    },
    {
      stepNumber: 2,
      title: 'Specify Flight Details for Tarmac VIP Greeting',
      description: 'If arriving through Benin Airport (BNI), enter your flight code so our uniformed chauffeur is stationed at the VIP arrival lounge with advance placard protocol.',
      duration: '2 min',
      tip: 'Flight arrival tracking is synchronized automatically by our dispatch desk.',
      checklist: ['Provide flight tail / commercial flight code', 'Specify arrival terminal and VIP luggage tags']
    },
    {
      stepNumber: 3,
      title: 'Configure Armed Escort & Protocol Level',
      description: 'Select unarmed executive chauffeur, dual armed police escort, or full tactical close-protection convoy.',
      duration: '5 min',
      tip: 'Armed escort units include dedicated satellite telemetry synchronization and encrypted VHF radios.',
      checklist: ['Determine armed escort detail requirements', 'Confirm clearance manifests for cross-state transit']
    },
    {
      stepNumber: 4,
      title: 'Receive Cryptographic Manifest & Chauffeur Contact',
      description: 'Your booking confirmation generates a unique reference number (ENG-XXXXXX) along with driver credentials and vehicle license verification.',
      duration: 'Instant',
      tip: 'Keep your digital manifest handy for swift airport gate clearance.',
      checklist: ['Download digital cryptographic confirmation code', 'Verify chauffeur identification upon staging']
    }
  ]);

  // ==========================================
  // 📑 2. EDITORIAL SPECIFIC FORM STATE
  // ==========================================
  const [editorialExcerpt, setEditorialExcerpt] = useState(initialPost?.excerpt || '');
  const [editorialContent, setEditorialContent] = useState(initialPost?.content || '');
  const [inArticleImageCaption, setInArticleImageCaption] = useState('');
  const [inArticleImageLayout, setInArticleImageLayout] = useState<'full' | 'left' | 'right'>('full');

  // SEO Meta
  const [metaTitle, setMetaTitle] = useState(initialPost?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.seo?.metaDescription || '');
  const [targetKeywordsInput, setTargetKeywordsInput] = useState(
    initialPost?.seo?.targetKeywords ? initialPost.seo.targetKeywords.join(', ') : 'luxury car rental benin city, vip escort service, toyota prado rental'
  );
  const [aiSearchSummary, setAiSearchSummary] = useState(initialPost?.seo?.aiSearchSummary || '');
  const [keyTakeawaysInput, setKeyTakeawaysInput] = useState(
    initialPost?.seo?.keyTakeaways ? initialPost.seo.keyTakeaways.join('\n') : 'Direct executive airport pickup available 24/7 at Benin City Airport.\nAll luxury SUVs include vetted professional protocol chauffeurs.\nArmed escort backup units available for interstate highway travel.'
  );

  // Studio UI
  const [isSaving, setIsSaving] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [activeStepIndexForImage, setActiveStepIndexForImage] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inArticleFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const stepImageInputRef = useRef<HTMLInputElement>(null);

  // Auto-sync slug
  useEffect(() => {
    if (!initialPost && title) {
      setSlug(slugify(title));
    }
  }, [title, initialPost]);

  const targetKeywords = targetKeywordsInput.split(',').map((k) => k.trim()).filter(Boolean);
  const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
  const parsedTakeaways = keyTakeawaysInput.split('\n').map((t) => t.trim()).filter(Boolean);
  const parsedPrerequisites = prerequisitesInput.split(',').map((p) => p.trim()).filter(Boolean);
  const finalContent = postType === 'how-to' ? howToIntro : editorialContent;

  const currentBlogPostMock: BlogPost = {
    id: initialPost?.id || 'temp-id',
    slug: slug || slugify(title || 'article'),
    title: title || (postType === 'how-to' ? 'Untitled Protocol Guide' : 'Untitled Publication'),
    excerpt: postType === 'how-to' ? howToSummary : editorialExcerpt,
    content: finalContent,
    category,
    tags: parsedTags,
    author: {
      id: selectedAuthorId || 'author-1',
      name: authorName,
      role: authorRole,
      avatar: authorAvatar || '/favicon.svg',
    },
    coverImage,
    postType,
    totalDuration: postType === 'how-to' ? totalDuration : undefined,
    prerequisites: postType === 'how-to' ? parsedPrerequisites : undefined,
    howToSteps: postType === 'how-to' ? howToSteps : undefined,
    status,
    featured,
    publishedAt: initialPost?.publishedAt || new Date().toISOString(),
    readingTimeMinutes: calculateReadingTime(finalContent),
    viewsCount: initialPost?.viewsCount || 0,
    likesCount: initialPost?.likesCount || 0,
    comments: initialPost?.comments || [],
    seo: {
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || (postType === 'how-to' ? howToSummary : editorialExcerpt),
      targetKeywords,
      canonicalUrl: `https://engracedlogistics.com/blog/${slug || slugify(title || 'article')}`,
      ogTitle: metaTitle || title,
      ogDescription: metaDescription || (postType === 'how-to' ? howToSummary : editorialExcerpt),
      ogImage: coverImage,
      twitterCard: 'summary_large_image',
      aiSearchSummary: aiSearchSummary || (postType === 'how-to' ? howToSummary : editorialExcerpt),
      keyTakeaways: parsedTakeaways,
      schemaType: 'Article',
    },
  };

  const seoScore = analyzeSEO(currentBlogPostMock);

  const handleSavePost = async () => {
    if (!title.trim()) {
      alert('Please enter a title for this publication.');
      return;
    }
    setIsSaving(true);
    const finalPost: BlogPost = {
      ...currentBlogPostMock,
      id: initialPost?.id || `post-${Date.now()}`,
      slug: slug || slugify(title),
      status,
      updatedAt: new Date().toISOString(),
    };
    await onSave(finalPost);
    setIsSaving(false);
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCompressingImage(true);
      const b64 = await compressImageToBase64(e.target.files[0], 1400, 900, 0.85);
      setCoverImage(b64);
      setCompressingImage(false);
    }
  };

  const handleStepImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && activeStepIndexForImage !== null) {
      setCompressingImage(true);
      const b64 = await compressImageToBase64(e.target.files[0], 900, 600, 0.8);
      setHowToSteps(prev => prev.map((s, i) => i === activeStepIndexForImage ? { ...s, image: b64 } : s));
      setCompressingImage(false);
      setActiveStepIndexForImage(null);
    }
  };

  const handleInArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCompressingImage(true);
      const b64 = await compressImageToBase64(e.target.files[0], 1200, 800, 0.82);
      const html = createInArticleImageHtml(b64, 'Engraced Logistics VIP Transport', inArticleImageCaption || undefined, inArticleImageLayout);
      setEditorialContent(prev => prev + '\n' + html);
      setCompressingImage(false);
      setInArticleImageCaption('');
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...howToSteps];
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    setHowToSteps(newSteps.map((s, i) => ({ ...s, stepNumber: i + 1 })));
  };

  const insertEditorialFormatting = (open: string, close: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editorialContent;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + open + (selected || 'Text') + close + text.substring(end);
    setEditorialContent(newText);
  };

  const handleAiMetaGenerate = () => {
    const contextContent = postType === 'how-to' 
      ? `How to guide for ${title}. Steps: ${howToSteps.map(s => s.title).join(', ')}`
      : editorialContent;
    const metaDescriptions = generateMetaDescriptions(title, contextContent);
    const primaryDesc = metaDescriptions[0] || 'Executive transport solutions in Nigeria.';
    const takeaways = generateAIKeyTakeaways(title, contextContent);
    if (!metaTitle) setMetaTitle(`${title} | Engraced Logistics`.slice(0, 65));
    setMetaDescription(primaryDesc);
    setAiSearchSummary(primaryDesc);
    setKeyTakeawaysInput(takeaways.join('\n'));
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleCoverImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={stepImageInputRef}
        onChange={handleStepImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={inArticleFileInputRef}
        onChange={handleInArticleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Studio Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Back to Articles"
          >
            <X size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#050548] font-mono">
                {postType === 'how-to' ? 'How-To Protocol Studio' : 'Executive Editorial Studio'}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${
                status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-950 truncate max-w-md">
              {title || (postType === 'how-to' ? 'New Step-by-Step Protocol' : 'New Executive Editorial')}
            </h2>
          </div>
        </div>

        {/* Format Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Format Switcher Pill */}
          <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setPostType('how-to')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'how-to'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <ListOrdered size={13} />
              <span>How-To Steps</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('standard')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                postType === 'standard'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <FileText size={13} />
              <span>Editorial Prose</span>
            </button>
          </div>

          {initialPost && onPreviewPublic && (
            <button
              type="button"
              onClick={() => onPreviewPublic(slug)}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <ExternalLink size={14} />
              <span>Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              handleSavePost();
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-mono disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => {
              setStatus('published');
              handleSavePost();
            }}
            disabled={isSaving}
            className="px-5 py-2 bg-[#050548] text-white hover:bg-[#0A0A78] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#050548]/20 active:scale-95 transition-all cursor-pointer font-mono disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Studio Forms (8 cols) + Right Metadata/SEO (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Dynamic Forms (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* ============================================================ */}
          {/* 📘 FORM A: STEP-BY-STEP HOW-TO PROTOCOL STUDIO */}
          {/* ============================================================ */}
          {postType === 'how-to' && (
            <div className="space-y-6">
              
              {/* 1. Guide Overview & Objective Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#050548] flex items-center justify-center font-bold">
                      <ListOrdered size={16} />
                    </span>
                    <div>
                      <h3 className="text-base font-black text-zinc-950">Protocol Guide Overview</h3>
                      <p className="text-xs text-zinc-500">Define the objective, estimated time, and prerequisites.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-[#050548] px-2.5 py-1 rounded-full border border-blue-100">
                    Step-by-Step Mode
                  </span>
                </div>

                {/* Guide Title */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5 font-mono">
                    Protocol Guide Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to Book an Executive VIP Convoy & Airport Tarmac Protocol in Benin City"
                    className="w-full text-base font-bold text-zinc-900 border border-zinc-200 rounded-2xl p-3.5 focus:outline-none focus:border-[#050548]"
                  />
                </div>

                {/* Duration & Prerequisites Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono flex items-center gap-1.5">
                      <Clock size={13} className="text-[#050548]" />
                      <span>Total Estimated Duration</span>
                    </label>
                    <input
                      type="text"
                      value={totalDuration}
                      onChange={(e) => setTotalDuration(e.target.value)}
                      placeholder="e.g. 15 min or 4.5 Hours Transit"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1 font-mono flex items-center gap-1.5">
                      <FileText size={13} className="text-[#050548]" />
                      <span>Prerequisites / Required Items (Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={prerequisitesInput}
                      onChange={(e) => setPrerequisitesInput(e.target.value)}
                      placeholder="e.g. Flight Code, Photo ID, Entourage Count"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
                    />
                  </div>
                </div>

                {/* Executive Summary / Lead */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1 font-mono">
                    Protocol Objective &amp; Executive Summary
                  </label>
                  <textarea
                    rows={2}
                    value={howToSummary}
                    onChange={(e) => setHowToSummary(e.target.value)}
                    placeholder="Provide a high-impact executive summary of the protocol objectives..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 focus:bg-white focus:outline-none focus:border-[#050548]"
                  />
                </div>

                {/* Guide Background / Intro Content */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1 font-mono">
                    Guide Introduction / Highway Context
                  </label>
                  <textarea
                    rows={3}
                    value={howToIntro}
                    onChange={(e) => setHowToIntro(e.target.value)}
                    placeholder="Introductory remarks explaining why this operational protocol is essential for VIPs..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 focus:bg-white focus:outline-none focus:border-[#050548]"
                  />
                </div>
              </div>

              {/* 2. DYNAMIC STEP-BY-STEP BUILDER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-zinc-950 flex items-center gap-2">
                      <span>Sequential Action Steps</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#050548] text-xs font-mono font-bold">
                        {howToSteps.length} Steps
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500">Each step below has its own dedicated form, instructions, duration, checklist, and photo.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = howToSteps.length + 1;
                      setHowToSteps([
                        ...howToSteps,
                        {
                          stepNumber: nextNum,
                          title: `Step ${nextNum}: Action Headline`,
                          description: 'Provide detailed instructions for this operational step...',
                          duration: '3 min',
                          checklist: ['Action item 1', 'Action item 2']
                        }
                      ]);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer font-mono"
                  >
                    <Plus size={14} />
                    <span>Add Step</span>
                  </button>
                </div>

                {/* Individual Step Cards */}
                <div className="space-y-5">
                  {howToSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border-2 border-zinc-200 hover:border-blue-300 p-5 sm:p-6 shadow-sm space-y-4 transition-all relative overflow-hidden text-left"
                    >
                      {/* Step Header Bar */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#050548] to-[#0A0A78] text-white flex items-center justify-center font-black text-sm font-mono shadow-md shadow-[#050548]/20">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Step {idx + 1} of {howToSteps.length}</span>
                            <h4 className="text-sm font-bold text-zinc-900 truncate max-w-xs sm:max-w-md">
                              {step.title || `Untitled Step ${idx + 1}`}
                            </h4>
                          </div>
                        </div>

                        {/* Reorder and Delete Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveStep(idx, 'up')}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 cursor-pointer"
                            title="Move Step Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === howToSteps.length - 1}
                            onClick={() => moveStep(idx, 'down')}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 cursor-pointer"
                            title="Move Step Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={howToSteps.length <= 1}
                            onClick={() => {
                              if (confirm(`Remove Step ${idx + 1}?`)) {
                                setHowToSteps(howToSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 })));
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-30 cursor-pointer"
                            title="Delete Step"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Step Title & Duration Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1 font-mono">
                            Step Headline / Action Title *
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHowToSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, title: val } : s)));
                            }}
                            placeholder="e.g. Specify Flight Details for Tarmac VIP Greeting"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1 font-mono flex items-center gap-1">
                            <Clock size={12} className="text-[#050548]" />
                            <span>Estimated Time</span>
                          </label>
                          <input
                            type="text"
                            value={step.duration || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHowToSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, duration: val } : s)));
                            }}
                            placeholder="e.g. 3 min or Instant"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
                          />
                        </div>
                      </div>

                      {/* Step Detailed Description / Instructions */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1 font-mono">
                          Step Instructions &amp; Tactical Guidance *
                        </label>
                        <textarea
                          rows={3}
                          value={step.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setHowToSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, description: val } : s)));
                          }}
                          placeholder="Explain exactly what the traveler or dispatcher does in this step..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 focus:bg-white focus:outline-none focus:border-[#050548]"
                        />
                      </div>

                      {/* Step Checklist Sub-Items */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 font-mono flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-blue-600" />
                            <span>Step Checklist Sub-Tasks</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const existing = step.checklist || [];
                              setHowToSteps((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, checklist: [...existing, ''] } : s))
                              );
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                          >
                            <Plus size={11} />
                            <span>Add Sub-Task</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(step.checklist || []).map((checkItem, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2">
                              <span className="text-xs text-blue-600 font-bold font-mono">✓</span>
                              <input
                                type="text"
                                value={checkItem}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...(step.checklist || [])];
                                  updated[cIdx] = val;
                                  setHowToSteps((prev) =>
                                    prev.map((s, i) => (i === idx ? { ...s, checklist: updated } : s))
                                  );
                                }}
                                placeholder="Sub-task item (e.g. Verify driver ID badge)"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#050548]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (step.checklist || []).filter((_, ci) => ci !== cIdx);
                                  setHowToSteps((prev) =>
                                    prev.map((s, i) => (i === idx ? { ...s, checklist: updated } : s))
                                  );
                                }}
                                className="p-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                                title="Remove item"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step Pro-Tip Callout Field */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1 font-mono flex items-center gap-1">
                          <Lightbulb size={12} className="text-amber-500" />
                          <span>Pro-Tip &amp; Advisory Note (Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={step.tip || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setHowToSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, tip: val } : s)));
                          }}
                          placeholder="e.g. For cross-state journeys, always confirm 4x4 platform clearance with our dispatch team."
                          className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 focus:bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Step Image Attachment Form */}
                      <div className="pt-2 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 font-mono flex items-center gap-1">
                            <ImageIcon size={12} className="text-blue-600" />
                            <span>Step Photo Attachment (Base64 in Document)</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveStepIndexForImage(idx);
                              stepImageInputRef.current?.click();
                            }}
                            className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer font-mono"
                          >
                            <Upload size={12} />
                            <span>Upload Step Photo</span>
                          </button>
                        </div>

                        {step.image ? (
                          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 max-h-48 group">
                            <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setHowToSteps((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, image: undefined } : s))
                                );
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-xl transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 italic bg-zinc-50 border border-dashed border-zinc-200 p-3 rounded-xl text-center">
                            No photo attached to Step {idx + 1}. Click "Upload Step Photo" to add one.
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Bottom Add Step Button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = howToSteps.length + 1;
                    setHowToSteps([
                      ...howToSteps,
                      {
                        stepNumber: nextNum,
                        title: `Step ${nextNum}: Action Headline`,
                        description: 'Provide detailed instructions for this operational step...',
                        duration: '3 min',
                        checklist: ['Action item 1', 'Action item 2']
                      }
                    ]);
                  }}
                  className="w-full py-4 border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/40 hover:bg-blue-50 text-blue-700 rounded-3xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Next Step (Step {howToSteps.length + 1})</span>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 📑 FORM B: EXECUTIVE EDITORIAL & ANALYSIS STUDIO */}
          {/* ============================================================ */}
          {postType === 'standard' && (
            <div className="space-y-6">
              {/* Editorial Title & Lead Excerpt */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5 font-mono">
                    Editorial Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Toyota Prado TXL vs Land Cruiser V8: Presidential Fleet Analysis"
                    className="w-full text-base font-bold text-zinc-900 border border-zinc-200 rounded-2xl p-3.5 focus:outline-none focus:border-[#050548]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5 font-mono">
                    Executive Lead Excerpt (1-2 sentences)
                  </label>
                  <textarea
                    rows={2}
                    value={editorialExcerpt}
                    onChange={(e) => setEditorialExcerpt(e.target.value)}
                    placeholder="Provide a high-impact opening summary for executive readers and search snippets..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 focus:bg-white focus:outline-none focus:border-[#050548]"
                  />
                </div>
              </div>

              {/* Editorial Visual Prose Editor */}
              <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden text-left">
                {/* Editor Toolbar */}
                <div className="p-3 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<h2>', '</h2>')}
                    className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 font-bold cursor-pointer"
                  >
                    H2 Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<h3>', '</h3>')}
                    className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 font-bold cursor-pointer"
                  >
                    H3 Subheading
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<strong>', '</strong>')}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 font-bold cursor-pointer"
                    title="Bold"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<em>', '</em>')}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 italic cursor-pointer"
                    title="Italic"
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<ul>\n  <li>', '</li>\n  <li>Feature 2</li>\n</ul>')}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 cursor-pointer"
                    title="Bullet List"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<ol>\n  <li>', '</li>\n  <li>Numbered Item 2</li>\n</ol>')}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 cursor-pointer"
                    title="Numbered List"
                  >
                    <ListOrdered size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<div class="callout callout-info"><strong>Strategic Note:</strong> ', '</div>')}
                    className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-[#050548] rounded-lg font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Lightbulb size={12} className="text-blue-600" />
                    <span>Info Box</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertEditorialFormatting('<div class="callout callout-warning"><strong>Highway Advisory:</strong> ', '</div>')}
                    className="px-2.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-bold cursor-pointer flex items-center gap-1"
                  >
                    <ShieldAlert size={12} className="text-amber-600" />
                    <span>Warning Box</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => inArticleFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#050548] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ml-auto font-mono text-[11px]"
                  >
                    <Upload size={12} />
                    <span>Insert Floating Image</span>
                  </button>
                </div>

                {/* Textarea Content */}
                <div className="p-4">
                  <textarea
                    ref={textareaRef}
                    rows={16}
                    value={editorialContent}
                    onChange={(e) => setEditorialContent(e.target.value)}
                    placeholder="Write your longform journalism, executive briefing, or fleet comparison using headings, bullet points, and callouts..."
                    className="w-full text-sm leading-relaxed text-zinc-900 font-sans border-0 focus:outline-none resize-y p-2"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Shared Meta, Cover Image, Live 12-Point SEO Engine (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Cover Image Card */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">
                Featured Cover Image
              </label>
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="text-xs font-bold text-[#050548] hover:underline flex items-center gap-1 cursor-pointer font-mono"
              >
                <Upload size={12} />
                <span>Upload New</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 h-44 group">
              <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-zinc-900 rounded-xl text-xs font-bold font-mono shadow-md cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 font-mono">
                Image Direct URL (or Base64)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-mono text-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Author & Display Attributions */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
                <User size={14} className="text-[#050548]" />
                <span>Author &amp; Attributions</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingNewAuthor(!isAddingNewAuthor)}
                className="text-[11px] font-bold text-[#050548] hover:underline flex items-center gap-1 cursor-pointer font-mono"
              >
                <Plus size={12} />
                <span>{isAddingNewAuthor ? 'Cancel' : 'New Author'}</span>
              </button>
            </div>

            {/* Active Author Preview Badge */}
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={authorAvatar || '/favicon.svg'}
                  alt="Author Avatar"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-zinc-900 truncate block">
                  {authorName || 'Unnamed Author'}
                </span>
                <span className="text-[10px] text-zinc-500 truncate block font-mono">
                  {authorRole || 'Official Protocol'}
                </span>
              </div>
            </div>

            {/* Add New Author Form */}
            {isAddingNewAuthor && (
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#050548] font-mono block">
                  Create New Author Profile
                </span>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 font-mono block mb-1">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Mobility Officer"
                    value={newAuthorNameInput}
                    onChange={(e) => setNewAuthorNameInput(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs font-semibold text-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 font-mono block mb-1">
                    Role / Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tactical Escort Command"
                    value={newAuthorRoleInput}
                    onChange={(e) => setNewAuthorRoleInput(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs font-semibold text-zinc-900 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateNewAuthor}
                  disabled={!newAuthorNameInput.trim()}
                  className="w-full py-2 bg-[#050548] hover:bg-[#0A0A78] text-white rounded-xl text-xs font-bold font-mono transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Save &amp; Select Author
                </button>
              </div>
            )}

            {/* Select Existing Preset Author */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1 font-mono">
                Select Author Preset
              </label>
              <select
                value={selectedAuthorId}
                onChange={(e) => handleSelectAuthor(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
              >
                {authorList.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            {/* Edit Selected Author Name & Role */}
            <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-zinc-100">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 font-mono">
                  Edit Display Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-bold text-zinc-900 focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 font-mono">
                  Edit Role / Title
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs text-zinc-800 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Taxonomy & Permalinks */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">
              Taxonomy &amp; Permalink
            </h4>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1 font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1 font-mono">
                URL Slug
              </label>
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono text-zinc-600">
                <span className="text-zinc-400 select-none">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent text-zinc-900 font-bold focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1 font-mono">
                Corridor Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-800 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Live 12-Point SEO Engine & Google Preview */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#050548]" />
                <span>Live SEO Health Engine</span>
              </h4>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                seoScore.totalScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {seoScore.totalScore}/100 Grade {seoScore.grade}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAiMetaGenerate}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-blue-600" />
              <span>1-Click AI SEO Optimizer</span>
            </button>

            {/* Google SERP Snippet Preview */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 block truncate">
                https://engracedlogistics.com &rsaquo; blog &rsaquo; {slug || 'slug'}
              </span>
              <div className="text-xs font-bold text-blue-800 line-clamp-1">
                {metaTitle || title || 'Engraced Logistics Blog'}
              </div>
              <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed">
                {metaDescription || (postType === 'how-to' ? howToSummary : editorialExcerpt) || 'Executive convoy and luxury transport protocols in Nigeria.'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Direct Compression Notice */}
      {compressingImage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#050548] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold font-mono border border-blue-400">
          <Clock size={16} className="animate-spin text-yellow-300" />
          <span>Compressing &amp; storing Base64 photo in document...</span>
        </div>
      )}
    </div>
  );
}
