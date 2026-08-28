/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Heart, 
  Car, 
  Mail, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Download, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Share2,
  RefreshCw,
  Search
} from 'lucide-react';
import { DailyAnalyticsRecord, BlogPost, BookingRecord } from '../../types';
import { fetchDailyAnalytics, exportAnalyticsCsv } from '../../services/firebase';

interface AdminAnalyticsViewProps {
  posts: BlogPost[];
  bookings: BookingRecord[];
}

export default function AdminAnalyticsView({ posts, bookings }: AdminAnalyticsViewProps) {
  const [records, setRecords] = useState<DailyAnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await fetchDailyAnalytics();
    setRecords(data);
    if (data.length > 0 && !selectedDate) {
      setSelectedDate(data[0].date);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Filter records by selected time range
  const filteredRecords = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    return records.slice(0, days);
  }, [records, timeRange]);

  // Selected Day Record
  const activeRecord = useMemo(() => {
    return records.find((r) => r.date === selectedDate) || filteredRecords[0] || records[0];
  }, [records, selectedDate, filteredRecords]);

  // Summary Metrics over the active range
  const rangeSummary = useMemo(() => {
    const totalViews = filteredRecords.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
    const totalLikes = filteredRecords.reduce((acc, r) => acc + (r.likesCount || 0), 0);
    const totalBookings = filteredRecords.reduce((acc, r) => acc + (r.bookingsCount || 0), 0);
    const totalSubs = filteredRecords.reduce((acc, r) => acc + (r.subscribersCount || 0), 0);
    const avgDailyViews = filteredRecords.length > 0 ? Math.round(totalViews / filteredRecords.length) : 0;
    
    // Find highest peak day
    const peakRecord = [...filteredRecords].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))[0];

    return {
      totalViews,
      totalLikes,
      totalBookings,
      totalSubs,
      avgDailyViews,
      peakDate: peakRecord ? peakRecord.formattedDate : 'N/A',
      peakViews: peakRecord ? peakRecord.viewsCount : 0
    };
  }, [filteredRecords]);

  // Max views in the active range for chart bar scaling
  const maxViewsInRange = useMemo(() => {
    const max = Math.max(...filteredRecords.map((r) => r.viewsCount || 0), 100);
    return max;
  }, [filteredRecords]);

  // Search filtered table rows
  const tableRows = useMemo(() => {
    if (!searchQuery.trim()) return filteredRecords;
    const q = searchQuery.toLowerCase();
    return filteredRecords.filter(
      (r) =>
        r.date.includes(q) ||
        r.formattedDate.toLowerCase().includes(q) ||
        r.dayOfWeek.toLowerCase().includes(q)
    );
  }, [filteredRecords, searchQuery]);

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Top Header & Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-[#050548] text-white">
              <BarChart3 size={18} />
            </div>
            <span className="text-xs font-bold text-[#050548] uppercase tracking-widest font-mono">
              Live Telemetry &amp; Traffic Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
              ● Firestore Synced
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Daily Reader Traffic &amp; Route Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Browse day-by-day reader engagement, vehicle reservation conversion points, and peak reading hours across Edo State and highway corridors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Time Range Pills */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            {[
              { id: '7d', label: '7 Days' },
              { id: '14d', label: '14 Days' },
              { id: '30d', label: '30 Days' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? 'bg-white text-[#050548] shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => exportAnalyticsCsv(records)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#050548] hover:bg-[#0A0A78] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 font-mono"
            title="Download CSV report"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadAnalytics}
            className="p-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid for Selected Range */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Views in Period</span>
            <Eye size={16} className="text-[#050548]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {rangeSummary.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>Avg {rangeSummary.avgDailyViews.toLocaleString()} reads / day</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Peak Traffic Day</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-zinc-950 block truncate">
              {rangeSummary.peakDate}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono inline-block mt-1">
              {rangeSummary.peakViews.toLocaleString()} reads
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Fleet Inquiries</span>
            <Car size={16} className="text-blue-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {rangeSummary.totalBookings}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500 block mt-1">
              Across {filteredRecords.length} days
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Reader Claps</span>
            <Heart size={16} className="text-rose-500" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono block">
              {rangeSummary.totalLikes.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500 block mt-1">
              {Math.round((rangeSummary.totalLikes / Math.max(1, rangeSummary.totalViews)) * 100)}% engagement rate
            </span>
          </div>
        </div>

      </div>

      {/* Main Interactive Daily Traffic Visualizer & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Daily Bar & Trend Chart (Span 7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tight flex items-center gap-2">
                <span>Daily Traffic Timeline ({timeRange.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Click on any day bar to inspect its exact telemetry breakdown.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-zinc-400">
              Selected: <strong className="text-[#050548]">{activeRecord?.formattedDate}</strong>
            </span>
          </div>

          {/* Interactive Dynamic Bar Chart */}
          <div className="pt-8 pb-4">
            <div className="flex items-end justify-between gap-2 sm:gap-3 h-56 border-b border-zinc-200 pb-2 px-1">
              {filteredRecords.slice().reverse().map((rec) => {
                const heightPercent = Math.max(12, Math.round(((rec.viewsCount || 0) / maxViewsInRange) * 100));
                const isSelected = rec.date === selectedDate;
                return (
                  <div
                    key={rec.date}
                    onClick={() => setSelectedDate(rec.date)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-mono py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg mb-1">
                      {rec.viewsCount} reads
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[28px] h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#050548] shadow-md ring-2 ring-[#050548] ring-offset-2 scale-105'
                            : 'bg-zinc-200 group-hover:bg-[#050548]/50'
                        }`}
                      />
                    </div>

                    {/* Date Label */}
                    <span className={`text-[10px] font-mono transition-colors ${
                      isSelected ? 'font-black text-[#050548]' : 'text-zinc-400 group-hover:text-zinc-800'
                    }`}>
                      {rec.date.split('-').slice(1).join('/')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Strip for the active date range */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-zinc-50 rounded-2xl text-center border border-zinc-100">
              <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono block">Lowest Day</span>
              <span className="text-sm font-bold text-zinc-800 font-mono">
                {Math.min(...filteredRecords.map((r) => r.viewsCount || 0))} reads
              </span>
            </div>
            <div className="p-3.5 bg-zinc-50 rounded-2xl text-center border border-zinc-100">
              <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono block">Average Day</span>
              <span className="text-sm font-bold text-zinc-800 font-mono">
                {rangeSummary.avgDailyViews} reads
              </span>
            </div>
            <div className="p-3.5 bg-zinc-50 rounded-2xl text-center border border-zinc-100">
              <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono block">Peak Day</span>
              <span className="text-sm font-bold text-emerald-700 font-mono">
                {rangeSummary.peakViews} reads
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Detail Inspector Card (Span 5) - Clean White Mode */}
        {activeRecord && (
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-zinc-200 space-y-6">
            
            {/* Day Header with Royal Navy Accent */}
            <div className="bg-gradient-to-r from-[#050548] to-[#0A0A78] text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block font-bold">
                  {activeRecord.dayOfWeek} Telemetry
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeRecord.formattedDate}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white block">
                  {activeRecord.viewsCount.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-zinc-300 uppercase font-bold">Verified Reads</span>
              </div>
            </div>

            {/* Sub Metric Badges (White Mode) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <Car size={15} className="text-blue-700 mx-auto mb-1" />
                <span className="text-base font-black font-mono text-zinc-950 block">{activeRecord.bookingsCount}</span>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Inquiries</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <Heart size={15} className="text-rose-600 mx-auto mb-1" />
                <span className="text-base font-black font-mono text-zinc-950 block">{activeRecord.likesCount}</span>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Claps</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <Clock size={15} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-base font-black font-mono text-zinc-950 block">
                  {Math.floor((activeRecord.avgTimeOnSiteSeconds || 240) / 60)}m {(activeRecord.avgTimeOnSiteSeconds || 240) % 60}s
                </span>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Avg Dwell</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                <Mail size={15} className="text-amber-600 mx-auto mb-1" />
                <span className="text-base font-black font-mono text-zinc-950 block">{activeRecord.subscribersCount}</span>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Signups</span>
              </div>
            </div>

            {/* Device Traffic Breakdown (Clean White Mode) */}
            <div className="space-y-2.5 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-700 font-mono uppercase text-[11px]">Device Segmentation</span>
                <span className="text-zinc-500 text-[10px] font-mono">
                  {activeRecord.deviceBreakdown.mobile} Mobile / {activeRecord.deviceBreakdown.desktop} Desktop
                </span>
              </div>
              
              <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${Math.round((activeRecord.deviceBreakdown.mobile / Math.max(1, activeRecord.viewsCount)) * 100)}%` }} 
                  className="bg-emerald-500 h-full" 
                  title="Mobile"
                />
                <div 
                  style={{ width: `${Math.round((activeRecord.deviceBreakdown.desktop / Math.max(1, activeRecord.viewsCount)) * 100)}%` }} 
                  className="bg-blue-600 h-full" 
                  title="Desktop"
                />
                <div 
                  style={{ width: `${Math.round((activeRecord.deviceBreakdown.tablet / Math.max(1, activeRecord.viewsCount)) * 100)}%` }} 
                  className="bg-purple-600 h-full" 
                  title="Tablet"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Mobile ({Math.round((activeRecord.deviceBreakdown.mobile / Math.max(1, activeRecord.viewsCount)) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Desktop ({Math.round((activeRecord.deviceBreakdown.desktop / Math.max(1, activeRecord.viewsCount)) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Tablet ({Math.round((activeRecord.deviceBreakdown.tablet / Math.max(1, activeRecord.viewsCount)) * 100)}%)
                </span>
              </div>
            </div>

            {/* Top Articles Read on this day (White Mode) */}
            <div className="space-y-2.5 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <span className="text-[11px] font-mono uppercase text-zinc-700 font-bold block">
                Top Publications Read on {activeRecord.formattedDate.split(',')[0]}
              </span>
              <div className="space-y-2">
                {activeRecord.topPosts.map((post, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
                    <span className="truncate text-zinc-900 font-bold">{post.title}</span>
                    <span className="font-mono text-[#050548] font-black shrink-0 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      {post.views.toLocaleString()} reads
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Traffic Acquisition Channels (White Mode) */}
            <div className="space-y-2.5 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <span className="text-[11px] font-mono uppercase text-zinc-700 font-bold block">
                Acquisition Channels
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {activeRecord.referrers.map((ref, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between shadow-2xs">
                    <span className="text-[10px] text-zinc-500 truncate font-sans font-bold">{ref.source}</span>
                    <span className="text-zinc-950 font-black mt-1 text-[11px]">{ref.visits} visits ({ref.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Comprehensive Day-by-Day Historical Ledger Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-zinc-950 tracking-tight">
              Day-by-Day Historical Ledger
            </h3>
            <p className="text-xs text-zinc-500">
              Complete historical record of daily reads, orders, and reader engagement.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by date (YYYY-MM-DD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#050548]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                <th className="pb-3 pr-4">Date &amp; Day</th>
                <th className="pb-3 pr-4">Verified Reads</th>
                <th className="pb-3 pr-4">Inquiries</th>
                <th className="pb-3 pr-4">Claps</th>
                <th className="pb-3 pr-4">Subscribers</th>
                <th className="pb-3 pr-4">Top Read Article</th>
                <th className="pb-3 pr-4">Primary Channel</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium">
              {tableRows.map((rec) => {
                const isSelected = rec.date === selectedDate;
                return (
                  <tr 
                    key={rec.date} 
                    className={`hover:bg-zinc-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 pr-4 font-mono">
                      <span className="font-bold text-zinc-900 block">{rec.formattedDate}</span>
                      <span className="text-[10px] text-zinc-400">{rec.dayOfWeek}</span>
                    </td>
                    <td className="py-3.5 pr-4 font-mono font-bold text-[#050548]">
                      {rec.viewsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-4 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        rec.bookingsCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {rec.bookingsCount} orders
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-rose-700">
                      {rec.likesCount}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-amber-700">
                      {rec.subscribersCount}
                    </td>
                    <td className="py-3.5 pr-4 max-w-xs truncate text-zinc-700">
                      {rec.topPosts[0]?.title || 'Standard Catalog View'}
                    </td>
                    <td className="py-3.5 pr-4 text-zinc-500 text-[11px] font-mono">
                      {rec.referrers[0]?.source || 'Google Search'}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedDate(rec.date);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase font-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#050548] text-white'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {isSelected ? 'Inspecting' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
