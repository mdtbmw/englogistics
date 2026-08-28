/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3,
  FileText, 
  Edit3, 
  Sparkles, 
  Database, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Check, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { BlogPost, BlogCategory, BookingRecord, PostType } from '../../types';
import { 
  fetchPosts, 
  fetchCategories, 
  savePost, 
  deletePost, 
  fetchBookings, 
  updateBookingStatus, 
  fetchSubscribers,
  logoutAdmin,
  onAdminAuthStateChanged
} from '../../services/firebase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminAnalyticsView from './AdminAnalyticsView';
import AdminArticleList from './AdminArticleList';
import AdminBlogStudio from './AdminBlogStudio';
import AdminSEOTools from './AdminSEOTools';
import PostTypeModal from './PostTypeModal';
import LogoIcon from '../LogoIcon';

interface AdminPortalProps {
  setView: (view: string) => void;
  setSelectedSlug: (slug: string) => void;
}

export default function AdminPortal({ setView, setSelectedSlug }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eng_admin_auth') === 'true';
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'articles' | 'studio' | 'seo'>('dashboard');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<BlogPost | null>(null);
  const [isArchetypeModalOpen, setIsArchetypeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        sessionStorage.setItem('eng_admin_auth', 'true');
      } else {
        const localAuth = sessionStorage.getItem('eng_admin_auth') === 'true';
        setIsAuthenticated(localAuth);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    const [fetchedPosts, fetchedCats, fetchedBookings, fetchedSubs] = await Promise.all([
      fetchPosts(),
      fetchCategories(),
      fetchBookings(),
      fetchSubscribers(),
    ]);
    setPosts(fetchedPosts);
    setCategories(fetchedCats);
    setBookings(fetchedBookings);
    setSubscribers(fetchedSubs);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    showToast('Authenticated as Executive Administrator');
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    showToast('Signed out of Admin Vault');
    setView('home');
    if (window.location.hash) {
      window.location.hash = '';
    }
  };

  const handleNewArticle = () => {
    setIsArchetypeModalOpen(true);
  };

  const handleSelectArchetype = (type: PostType) => {
    const templatePost: BlogPost = {
      id: `post-${Date.now()}`,
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      category: 'logistics-guides',
      tags: ['Benin City', 'VIP Escort', 'Executive Transit'],
      author: {
        id: 'cpo-1',
        name: 'Chief Protocol Officer',
        role: 'Head of Fleet Logistics, Engraced',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      postType: type,
      status: 'published',
      featured: false,
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: 5,
      viewsCount: 0,
      likesCount: 0,
      comments: [],
      seo: {
        metaTitle: '',
        metaDescription: '',
        targetKeywords: ['luxury car rental benin city', 'vip escort service'],
        schemaType: 'Article',
      }
    };
    setSelectedPostForEdit(templatePost);
    setActiveTab('studio');
    setIsArchetypeModalOpen(false);
  };

  const handleEditArticle = (post: BlogPost) => {
    setSelectedPostForEdit(post);
    setActiveTab('studio');
  };

  const handleSaveArticle = async (post: BlogPost) => {
    await savePost(post);
    await loadData();
    showToast(`Publication "${post.title.slice(0, 30)}..." saved live to Firebase!`);
    setActiveTab('articles');
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Permanently delete this publication from the database?')) {
      await deletePost(id);
      await loadData();
      showToast('Publication deleted.');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await savePost({ ...post, status: newStatus });
    await loadData();
    showToast(`Publication status set to ${newStatus}.`);
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    await savePost({ ...post, featured: !post.featured });
    await loadData();
    showToast(`Publication featured status updated.`);
  };

  const handleDuplicateArticle = async (post: BlogPost) => {
    const duplicated: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      slug: `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      title: `${post.title} (Copy)`,
      status: 'draft',
      publishedAt: new Date().toISOString(),
      viewsCount: 0,
      likesCount: 0,
      comments: [],
    };
    await savePost(duplicated);
    await loadData();
    showToast('Article duplicated as Draft.');
  };

  const handlePreviewPost = (slug: string) => {
    setSelectedSlug(slug);
    setView('blog-post');
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingRecord['status']) => {
    await updateBookingStatus(id, status);
    await loadData();
    showToast(`Booking ${id} status updated to ${status}.`);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} onCancel={() => setView('home')} />;
  }

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Daily Traffic & Stats', icon: BarChart3 },
    { id: 'articles', label: 'Publications', icon: FileText, count: posts.length },
    { id: 'studio', label: 'Blog Studio', icon: Edit3 },
    { id: 'seo', label: '100% AI SEO', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/70 font-sans text-zinc-900 selection:bg-[#050548] selection:text-white flex flex-col justify-between">
      
      {/* Top Fixed Admin Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Desk Badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <LogoIcon className="w-10 h-10" />
              <div className="text-left leading-none">
                <span className="font-black text-xs uppercase tracking-widest text-[#050548] block" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                  ENGRACED
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Admin Vault &amp; Studio
                </span>
              </div>
            </button>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Firebase Synced
            </span>
          </div>

          {/* Navigation Tab Pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl flex-nowrap shrink-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'studio' && activeTab !== 'studio') {
                      setSelectedPostForEdit(null);
                    }
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-[#050548] shadow-sm font-black' 
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#050548]' : 'text-zinc-400'} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#050548]/10 text-[#050548]' : 'bg-zinc-200 text-zinc-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Fast Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setView('blog')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Globe size={13} />
              <span>Public Blog</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Horizontal Single-Line Tab Bar */}
        <div className="lg:hidden mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'studio' && activeTab !== 'studio') {
                    setSelectedPostForEdit(null);
                  }
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-[#050548] text-white shadow-sm font-black' 
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-white' : 'text-zinc-400'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Body Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-grow">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            posts={posts}
            bookings={bookings}
            subscribers={subscribers}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onNewArticle={handleNewArticle}
            onEditArticle={handleEditArticle}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onViewPublicSite={() => setView('blog')}
            onSeedDatabase={loadData}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsView
            posts={posts}
            bookings={bookings}
          />
        )}

        {activeTab === 'articles' && (
          <AdminArticleList
            posts={posts}
            categories={categories}
            onNewArticle={handleNewArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
            onTogglePublish={handleTogglePublish}
            onToggleFeatured={handleToggleFeatured}
            onDuplicateArticle={handleDuplicateArticle}
            onPreviewPost={handlePreviewPost}
          />
        )}

        {activeTab === 'studio' && (
          <AdminBlogStudio
            initialPost={selectedPostForEdit}
            categories={categories}
            onSave={handleSaveArticle}
            onCancel={() => setActiveTab('articles')}
            onPreviewPublic={handlePreviewPost}
          />
        )}

        {activeTab === 'seo' && (
          <AdminSEOTools posts={posts} />
        )}
      </main>

      {/* Post Archetype Selection Modal */}
      <PostTypeModal
        isOpen={isArchetypeModalOpen}
        onClose={() => setIsArchetypeModalOpen(false)}
        onSelectType={handleSelectArchetype}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slide-up border border-zinc-800">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
