/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import RouteMarquee from './components/RouteMarquee';
import ServicesSection from './components/ServicesSection';
import MetricsSection from './components/MetricsSection';
import CoverageSimulation from './components/CoverageSimulation';
import FleetSection from './components/FleetSection';
import VehicleShowcase from './components/VehicleShowcase';
import ProtocolTimeline from './components/ProtocolTimeline';
import AdvantageSection from './components/AdvantageSection';
import ClientsSection from './components/ClientsSection';
import ReviewsSection from './components/ReviewsSection';
import BookingPortal from './components/BookingPortal';
import Footer from './components/Footer';
import AboutUsPanel from './components/AboutUsPanel';
import TermsPanel from './components/TermsPanel';
import PrivacyPanel from './components/PrivacyPanel';
import WhatsAppChat from './components/WhatsAppChat';
import VehicleProfile from './components/VehicleProfile';
import BlogCatalog from './components/blog/BlogCatalog';
import BlogPostDetail from './components/blog/BlogPostDetail';
import AdminPortal from './components/admin/AdminPortal';
import LandingBlogSection from './components/LandingBlogSection';
import { useSessionTracker } from './hooks/useSessionTracker';
import { motion, AnimatePresence } from 'motion/react';

const GlobalStyles = () => (
  <style>{`
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: 200%;
      animation: marquee 35s linear infinite;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    /* Hide scrollbar completely on mobile */
    @media (max-width: 1023px) {
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
      }
    }
    /* Customized scrollbar all over the system on desktop */
    @media (min-width: 1024px) {
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(240, 240, 240, 0.4);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb {
        background: #d4d4d8;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #050548;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(24, 24, 27, 0.4);
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #050548;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #0A0A78;
      }
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #050548 rgba(24, 24, 27, 0.4);
      }
    }
    body {
      -webkit-tap-highlight-color: transparent;
      overflow-x: hidden;
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Outfit', sans-serif;
    }
    @keyframes fillProgress {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    .animate-progress {
      animation: fillProgress 6s linear forwards;
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 16s linear infinite;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.85); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .animate-pulse-ring::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: #050548;
      animation: pulse-ring 2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    }
    @keyframes radar-sweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-radar {
      background: conic-gradient(from 0deg, transparent 65%, rgba(15, 43, 94, 0.35) 100%);
      border-radius: 50%;
      animation: radar-sweep 5s linear infinite;
    }
    .smooth-scroll {
      scroll-behavior: smooth;
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Luxury Editorial Typography for Blog Prose */
    .blog-prose {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #374151;
    }
    .blog-prose h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 800;
      color: #050548;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
      line-height: 1.3;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(5, 5, 72, 0.08);
    }
    .blog-prose h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #18181b;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
      letter-spacing: -0.01em;
    }
    .blog-prose p {
      margin-bottom: 1.25rem;
    }

    /* Unique Branded Luxury Bullets */
    .blog-prose ul {
      list-style: none !important;
      padding-left: 0 !important;
      margin-bottom: 1.5rem;
    }
    .blog-prose ul > li {
      position: relative;
      padding-left: 2rem;
      margin-bottom: 0.85rem;
      line-height: 1.7;
    }
    .blog-prose ul > li::before {
      content: '';
      position: absolute;
      left: 0.35rem;
      top: 0.6rem;
      width: 0.55rem;
      height: 0.55rem;
      background: linear-gradient(135deg, #050548, #2563eb);
      border-radius: 0.15rem;
      transform: rotate(45deg);
      box-shadow: 0 2px 6px rgba(5, 5, 72, 0.25);
    }

    /* Unique Branded Luxury Numbered Counters */
    .blog-prose ol {
      counter-reset: blog-step;
      list-style: none !important;
      padding-left: 0 !important;
      margin-bottom: 1.5rem;
    }
    .blog-prose ol > li {
      counter-increment: blog-step;
      position: relative;
      padding-left: 3.25rem;
      margin-bottom: 1.25rem;
      line-height: 1.75;
    }
    .blog-prose ol > li::before {
      content: counter(blog-step, decimal-leading-zero);
      position: absolute;
      left: 0;
      top: 0.15rem;
      width: 2.25rem;
      height: 2.25rem;
      background: linear-gradient(135deg, #050548, #0A0A78);
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(5, 5, 72, 0.2);
    }

    .blog-prose strong {
      color: #050548;
      font-weight: 700;
    }
    .blog-prose blockquote {
      border-left: 4px solid #050548;
      padding: 1.25rem 1.5rem;
      font-style: italic;
      color: #374151;
      margin: 1.75rem 0;
      background: #f8fafc;
      border-radius: 0 1.25rem 1.25rem 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    /* Callouts */
    .blog-prose .callout {
      padding: 1.25rem 1.5rem;
      border-radius: 1.25rem;
      margin: 1.75rem 0;
      font-size: 0.95rem;
      line-height: 1.65;
    }
    .blog-prose .callout-info {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e3a8a;
    }
    .blog-prose .callout-warning {
      background-color: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }
    .blog-prose .callout-tip {
      background-color: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }

    /* In-Article Figures & Images */
    .blog-figure {
      margin: 2rem 0;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
      background: #f9fafb;
    }
    .blog-figure-full {
      width: 100%;
    }
    .blog-figure-left {
      float: left;
      width: 48%;
      margin-right: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .blog-figure-right {
      float: right;
      width: 48%;
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .blog-in-article-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      max-height: 440px;
    }
    .blog-figcaption {
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      color: #6b7280;
      text-align: center;
      background: #ffffff;
      border-top: 1px solid #f3f4f6;
      letter-spacing: 0.02em;
    }

    /* Comparison Spec Tables */
    .blog-prose .table-wrapper {
      overflow-x: auto;
      margin: 2rem 0;
      border-radius: 1.25rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    }
    .blog-prose table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .blog-prose th {
      background-color: #f8fafc;
      padding: 0.85rem 1.25rem;
      font-weight: 800;
      color: #050548;
      border-bottom: 2px solid #e2e8f0;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
    }
    .blog-prose td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      color: #374151;
    }
    .blog-prose tr:hover td {
      background-color: #fafbfc;
    }
    .blog-prose tr:last-child td {
      border-bottom: none;
    }
  `}</style>
);

const ADMIN_VAULT_SLUG = import.meta.env.VITE_ADMIN_VAULT_SLUG || 'eng-protocol-vault-7892';

export default function App() {
  useSessionTracker();
  const [view, setView] = useState('home');
  const [selectedFleetId, setSelectedFleetId] = useState<string>('toyota_prado');
  const [selectedSlug, setSelectedSlug] = useState<string>('luxury-car-rental-benin-city-guide');

  // Check URL parameters / hash on mount & on hashchange
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = window.location.pathname.replace(/^\//, '');
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal');
      const articleParam = params.get('article');

      if (
        hash === 'admin' || 
        hash === 'admin-cms' || 
        path === 'admin' || 
        path === 'admin-cms' || 
        hash === ADMIN_VAULT_SLUG || 
        path === ADMIN_VAULT_SLUG || 
        portalParam === 'admin' || 
        portalParam === ADMIN_VAULT_SLUG
      ) {
        setView('admin-cms');
        return;
      }

      if (hash.startsWith('blog/') || path.startsWith('blog/') || articleParam) {
        const targetSlug = articleParam || hash.replace(/^blog\//, '') || path.replace(/^blog\//, '');
        if (targetSlug && targetSlug !== 'blog') {
          setSelectedSlug(targetSlug);
          setView('blog-post');
          return;
        } else {
          setView('blog');
          return;
        }
      }

      if (hash === 'blog' || path === 'blog') {
        setView('blog');
        return;
      }
      if (hash === 'booking' || path === 'booking') {
        setView('booking');
        return;
      }
      if (hash === 'about' || path === 'about') {
        setView('about');
        return;
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  // Automatically scroll to the top of the viewport when changing pages for premium single page transition UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [view]);

  // If viewing Admin CMS, render dedicated Admin Portal
  if (view === 'admin-cms') {
    return (
      <>
        <GlobalStyles />
        <AdminPortal setView={setView} setSelectedSlug={setSelectedSlug} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-[#050548] selection:text-white smooth-scroll flex flex-col justify-between">
        
        {/* Persistent Premium Navbar */}
        <Navbar currentView={view} setView={setView} />
        
        {/* Multi-view Interactive Layout Page Stream */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <HeroSlider setView={setView} />
                <RouteMarquee />
                <ServicesSection setView={setView} />
                <MetricsSection />
                <CoverageSimulation />
                <FleetSection setView={setView} setSelectedFleetId={setSelectedFleetId} />
                <VehicleShowcase setView={setView} setSelectedFleetId={setSelectedFleetId} />
                <ProtocolTimeline />
                <AdvantageSection setView={setView} />
                <LandingBlogSection setView={setView} setSelectedSlug={setSelectedSlug} />
                <ClientsSection />
                <ReviewsSection />
              </motion.div>
            )}

            {view === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <BlogCatalog setView={setView} setSelectedSlug={setSelectedSlug} />
              </motion.div>
            )}

            {view === 'blog-post' && (
              <motion.div
                key="blog-post"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <BlogPostDetail slug={selectedSlug} setView={setView} setSelectedSlug={setSelectedSlug} />
              </motion.div>
            )}

            {view === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <AboutUsPanel setView={setView} />
              </motion.div>
            )}

            {view === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookingPortal initialVehicleId={selectedFleetId} setView={setView} />
              </motion.div>
            )}

            {view === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <TermsPanel setView={setView} />
              </motion.div>
            )}

            {view === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <PrivacyPanel setView={setView} />
              </motion.div>
            )}

            {view === 'vehicle-detail' && (
              <motion.div
                key="vehicle-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <VehicleProfile vehicleId={selectedFleetId} setView={setView} setSelectedFleetId={setSelectedFleetId} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Persistent Premium Footer */}
        <Footer setView={setView} />

        {/* Floating WhatsApp Chat */}
        <WhatsAppChat />

      </div>
    </>
  );
}
