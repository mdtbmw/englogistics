/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  CheckCircle, 
  Sparkles, 
  Star, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../types';
import { analyzeSEO } from '../../services/aiSeoService';

interface AdminArticleListProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onNewArticle: () => void;
  onEditArticle: (post: BlogPost) => void;
  onDeleteArticle: (id: string) => void;
  onTogglePublish: (post: BlogPost) => void;
  onToggleFeatured: (post: BlogPost) => void;
  onDuplicateArticle: (post: BlogPost) => void;
  onPreviewPost: (slug: string) => void;
}

export default function AdminArticleList({
  posts,
  categories,
  onNewArticle,
  onEditArticle,
  onDeleteArticle,
  onTogglePublish,
  onToggleFeatured,
  onDuplicateArticle,
  onPreviewPost,
}: AdminArticleListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q);
      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            Articles &amp; Publications Manager
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Create, edit, duplicate, and publish high-authority logistics insights.
          </p>
        </div>

        <button
          onClick={onNewArticle}
          className="bg-[#050548] hover:bg-[#030330] text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Create New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              statusFilter === 'all'
                ? 'bg-[#050548] text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Published ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Drafts ({posts.filter((p) => p.status === 'draft').length})
          </button>
        </div>

        {/* Search & Category Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex-grow md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548] transition-all font-sans"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-700 uppercase tracking-wider focus:outline-none focus:border-[#050548] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c.slug !== 'all').map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <p className="text-sm font-semibold mb-2">No articles match the current filter.</p>
            <button
              onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#050548] hover:underline uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">SEO Health</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {filteredPosts.map((post) => {
                  const seo = analyzeSEO(post);
                  return (
                    <tr key={post.id} className="hover:bg-zinc-50/60 transition-colors group">
                      
                      {/* Title & Cover */}
                      <td className="py-4 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                          />
                          <div>
                            <span 
                              onClick={() => onEditArticle(post)}
                              className="font-bold text-zinc-900 group-hover:text-[#050548] transition-colors block line-clamp-1 cursor-pointer"
                            >
                              {post.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                              <span>By {post.author.name}</span>
                              <span>•</span>
                              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="bg-[#050548]/10 text-[#050548] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {post.category.replace('-', ' ')}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onTogglePublish(post)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleFeatured(post)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            post.featured ? 'text-amber-500 bg-amber-50' : 'text-zinc-300 hover:text-zinc-500'
                          }`}
                          title="Toggle Hero Featured Post"
                        >
                          <Star size={16} fill={post.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      {/* SEO Score Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                            seo.totalScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : seo.totalScore >= 75
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {seo.totalScore}% {seo.grade}
                          </span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-zinc-600 font-bold">
                        {post.viewsCount?.toLocaleString() || 0}
                      </td>

                      {/* Row Action Buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewPost(post.slug)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                            title="Preview on Public Website"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button
                            onClick={() => onDuplicateArticle(post)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                            title="Duplicate Article"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => onEditArticle(post)}
                            className="p-1.5 rounded-lg bg-[#050548] hover:bg-[#030330] text-white transition-colors cursor-pointer"
                            title="Edit in Visual Studio"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-zinc-200 shadow-2xl text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mb-2">Delete Article?</h3>
            <p className="text-xs sm:text-sm text-zinc-600 mb-6">
              Are you sure you want to permanently delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteArticle(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}