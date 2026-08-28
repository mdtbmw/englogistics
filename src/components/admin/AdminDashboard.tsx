/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Sliders,
  Flame,
  Car,
  Mail,
  Heart,
  MessageSquare,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { BlogPost, AdminStats, BookingRecord } from '../../types';
import { analyzeSEO } from '../../services/aiSeoService';

interface AdminDashboardProps {
  posts: BlogPost[];
  bookings?: BookingRecord[];
  subscribers?: string[];
  onUpdateBookingStatus?: (id: string, status: BookingRecord['status']) => Promise<void>;
  onNewArticle: () => void;
  onEditArticle: (post: BlogPost) => void;
  onNavigateTab: (tab: string) => void;
  onViewPublicSite: () => void;
  onSeedDatabase: () => void;
}

export default function AdminDashboard({
  posts,
  bookings = [],
  subscribers = [],
  onUpdateBookingStatus,
  onNewArticle,
  onEditArticle,
  onNavigateTab,
  onViewPublicSite,
  onSeedDatabase,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'bookings' | 'subscribers'>('articles');

  const stats: AdminStats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;
    const views = posts.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const likes = posts.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);
    const comments = posts.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);
    const totalSeo = posts.length > 0
      ? Math.round(posts.reduce((acc, p) => acc + analyzeSEO(p).totalScore, 0) / posts.length)
      : 100;

    return {
      totalArticles: total,
      publishedCount: published,
      draftCount: drafts,
      totalViews: views,
      totalLikes: likes,
      totalComments: comments,
      totalBookings: bookings.length,
      totalSubscribers: subscribers.length,
      averageSeoScore: totalSeo,
    };
  }, [posts, bookings, subscribers]);

  const recentPosts = useMemo(() => {
    return [...posts].slice(0, 5);
  }, [posts]);

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-[#050548] via-[#0A0A78] to-[#050548] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Engraced Command Studio • Live Database Connected</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Executive Content &amp; Logistics Command Hub
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage enterprise logistics publications, incoming booking inquiries, newsletter subscribers, and 100% SEO JSON-LD schemas synced with Firebase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('analytics')}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer font-mono"
          >
            <TrendingUp size={15} />
            <span>Daily Traffic &amp; Stats</span>
          </button>
          <button
            onClick={onNewArticle}
            className="bg-white text-[#050548] hover:bg-zinc-100 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>New Article Studio</span>
          </button>
          <button
            onClick={onViewPublicSite}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>Public Reader</span>
          </button>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <FileText size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-400">Total</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {stats.totalArticles}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">Articles in DB</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-[#050548]/40 hover:shadow-md transition-all cursor-pointer group"
          title="Click to inspect daily traffic breakdown"
        >
          <div className="flex items-center justify-between mb-3 text-emerald-600">
            <Eye size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Daily Stats &rarr;
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block group-hover:text-[#050548] transition-colors">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">Verified Reads</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-rose-600">
            <Heart size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Audience
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {stats.totalLikes.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">Article Claps</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-blue-600">
            <Car size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Orders
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {stats.totalBookings}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">Fleet Inquiries</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-amber-600">
            <Mail size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Subscribers
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {stats.totalSubscribers}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">VIP Registry</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-purple-600">
            <Sparkles size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              A+ Rating
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-purple-900 font-mono block">
              {stats.averageSeoScore}%
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">AI SEO Health</span>
          </div>
        </div>

      </div>

      {/* Switcher Tab between Recent Articles & Live Booking Inquiries */}
      <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl max-w-full overflow-x-auto no-scrollbar flex-nowrap border border-zinc-200">
        <button
          onClick={() => setActiveSubTab('articles')}
          className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'articles' ? 'bg-white text-[#050548] shadow-sm font-black' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Recent Articles ({posts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'bookings' ? 'bg-white text-[#050548] shadow-sm font-black' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Fleet Inquiries &amp; Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('subscribers')}
          className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'subscribers' ? 'bg-white text-[#050548] shadow-sm font-black' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Newsletter VIPs ({subscribers.length})
        </button>
      </div>

      {/* TAB 1: Recent Publications Table */}
      {activeSubTab === 'articles' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tight">Recent Enterprise Publications</h3>
              <p className="text-xs text-zinc-500">Live feed of active logistics guides and protocol documents.</p>
            </div>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-bold text-[#050548] hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>View All Articles &rarr;</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  <th className="pb-3 pr-4">Article</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Views</th>
                  <th className="pb-3 pr-4">Published</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={post.coverImage} alt={post.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-zinc-900 line-clamp-1 max-w-xs block">{post.title}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">/blog/{post.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md uppercase text-[10px] font-bold">
                        {post.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-mono font-bold text-zinc-700">
                      {post.viewsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-4 text-zinc-400 font-mono text-[11px]">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onEditArticle(post)}
                        className="px-3 py-1.5 bg-[#050548] text-white rounded-xl font-bold uppercase text-[11px] hover:bg-[#0A0A78] transition-colors cursor-pointer"
                      >
                        Edit in Studio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Live Inquiries & Bookings Table */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tight">Live Fleet Booking Inquiries</h3>
              <p className="text-xs text-zinc-500">Real-time incoming reservations from the booking portal &amp; route calculators.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs italic">
              No bookings recorded yet. New reservations made via the Booking Desk will appear here live.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                    <th className="pb-3 pr-4">Reference</th>
                    <th className="pb-3 pr-4">Client</th>
                    <th className="pb-3 pr-4">Vehicle &amp; Route</th>
                    <th className="pb-3 pr-4">Security Level</th>
                    <th className="pb-3 pr-4">Estimated Rate</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-[#050548]">
                        {booking.id}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-zinc-900 block">{booking.clientName}</span>
                        <span className="text-[11px] text-zinc-400 font-mono">{booking.clientPhone}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-zinc-800 block">{booking.vehicleType}</span>
                        <span className="text-[11px] text-zinc-500">{booking.pickupLocation} &rarr; {booking.dropoffLocation}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded uppercase text-[10px] font-bold">
                          {booking.securityLevel}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-emerald-700">
                        ₦{booking.totalCost?.toLocaleString() || 'Custom'}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {onUpdateBookingStatus && (
                          <select
                            value={booking.status}
                            onChange={(e) => onUpdateBookingStatus(booking.id, e.target.value as any)}
                            className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-800 uppercase focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Subscribers Table */}
      {activeSubTab === 'subscribers' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-zinc-950 tracking-tight">Executive Newsletter Registry</h3>
            <p className="text-xs text-zinc-500">Corporate subscriber list for intelligence briefs and route updates.</p>
          </div>

          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs italic">
              No newsletter subscribers recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subscribers.map((email, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-2.5 text-xs font-mono">
                  <Mail size={14} className="text-[#050548] shrink-0" />
                  <span className="truncate font-semibold text-zinc-800">{email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
