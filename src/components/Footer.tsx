/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Globe, Briefcase, MapPin } from 'lucide-react';
import LogoIcon from './LogoIcon';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-[#0F0F8B] to-[#080870] text-white pt-24 pb-28 md:pb-24 px-6 md:px-12 relative overflow-hidden border-t border-[#0F0F8B]/20 text-left">
      {/* Background Subtle Ambient Light Orb */}
      <div className="absolute left-1/3 top-0 -translate-y-1/2 w-96 h-96 bg-[#0000FD]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-20">
          
          {/* Col 1: Brand Info & Status */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <div className="flex items-center gap-2.5 mb-6">
              <LogoIcon className="w-10 h-10" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold tracking-widest text-xs uppercase font-mono text-white">ENGRACED</span>
                <span className="font-bold text-white tracking-widest text-xs uppercase font-mono">LOGISTICS</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-sm">
              Engineered for reliable and professional logistics and transport services across Nigeria. Premium car rentals, chauffeur services, and mobility solutions.
            </p>
            
          </div>

          {/* Col 2: Navigation (Company Desk) */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Company Desk</span>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => setView('home')} className="text-[11px] text-zinc-400 hover:text-[#0000FD] cursor-pointer text-left transition-colors font-sans hover:translate-x-1 duration-200">Overview Hub</button>
              <button onClick={() => setView('about')} className="text-[11px] text-zinc-400 hover:text-[#0000FD] cursor-pointer text-left transition-colors font-sans hover:translate-x-1 duration-200">About Us</button>
              <button onClick={() => setView('booking')} className="text-[11px] text-zinc-400 hover:text-[#0000FD] cursor-pointer text-left transition-colors font-sans hover:translate-x-1 duration-200">Booking Desk</button>
            </div>
          </div>

          {/* Col 3: Legal & Policy */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Legal Desk</span>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => setView('terms')} className="text-[11px] text-zinc-400 hover:text-[#0000FD] cursor-pointer text-left transition-colors font-sans hover:translate-x-1 duration-200">Terms of Service</button>
              <button onClick={() => setView('privacy')} className="text-[11px] text-zinc-400 hover:text-[#0000FD] cursor-pointer text-left transition-colors font-sans hover:translate-x-1 duration-200">Privacy Policy</button>
            </div>
          </div>

          {/* Col 4: Newsletter Sign-up */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Operations Registry</span>
            <p className="text-[12.5px] text-zinc-400 leading-relaxed font-sans">
              Subscribe to obtain direct route safety reports, tactical updates, and fleet protocol briefs.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-1">
              <input 
                type="email" 
                placeholder="Enter corporate email" 
                className="w-full bg-[#0A0A78] border border-[#0F0F8B]/30 rounded-xl px-3.5 py-2 text-[12.5px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#0F0F8B]/50 transition-colors font-sans"
              />
              <button 
                type="submit" 
                className="bg-[#0F0F8B] hover:bg-[#0A0A78] text-white font-bold uppercase tracking-widest text-[11.5px] px-3.5 py-2 rounded-xl cursor-pointer active:scale-95 transition-all shrink-0"
              >
                Sub
              </button>
            </form>
          </div>

        </div>

        {/* Coordinated Branch Info (Lagos, Benin, Abuja) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 pb-8 border-t border-[#0F0F8B]/20 text-left text-zinc-400 text-[12px] font-mono uppercase tracking-wider relative z-20">
          <div className="flex items-center gap-3">
            <MapPin size={12} className="text-[#0000FD] shrink-0" />
            <div>
              <span className="text-white font-bold block">HQ Benin Desk</span>
              17 Upper Adesuwa Road, GRA, Benin City
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={12} className="text-[#0000FD] shrink-0" />
            <div>
              <span className="text-white font-bold block">Lagos Operations</span>
              Victoria Island, Lagos, Nigeria
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={12} className="text-[#0000FD] shrink-0" />
            <div>
              <span className="text-white font-bold block">Operational Contact</span>
              info@engracedlogistics.com.ng<br />
              Call: (+234) 818 584 0000
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright and icons */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#0F0F8B]/20 gap-6 relative z-20">
          <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest font-mono text-center md:text-left">
            &copy; {new Date().getFullYear()} Engraced Logistics. All Rights Reserved.
          </p>
          <div className="flex gap-3">
             <div onClick={() => setView('home')} className="w-8 h-8 rounded-full bg-[#0A0A78] border border-[#0F0F8B]/30 flex items-center justify-center hover:bg-[#0F0F8B] hover:text-white hover:border-[#0000FD]/30 transition-all duration-300 cursor-pointer text-zinc-400 shadow-sm" title="Overview Hub"><Globe size={13}/></div>
             <div onClick={() => setView('about')} className="w-8 h-8 rounded-full bg-[#0A0A78] border border-[#0F0F8B]/30 flex items-center justify-center hover:bg-[#0F0F8B] hover:text-white hover:border-[#0000FD]/30 transition-all duration-300 cursor-pointer text-zinc-400 shadow-sm" title="About Us">
                <span className="font-mono text-[11px] font-bold">US</span>
             </div>
             <div onClick={() => setView('terms')} className="w-8 h-8 rounded-full bg-[#0A0A78] border border-[#0F0F8B]/30 flex items-center justify-center hover:bg-[#0F0F8B] hover:text-white hover:border-[#0000FD]/30 transition-all duration-300 cursor-pointer text-zinc-400 shadow-sm" title="Terms"><span className="font-mono text-[11px] font-bold">TS</span></div>
          </div>
        </div>
      </div>

      {/* Massive Bold Iconic Watermark */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 md:translate-y-16 select-none pointer-events-none text-[13vw] font-black uppercase tracking-[0.15em] text-center leading-none whitespace-nowrap font-mono opacity-60"
        style={{
          WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.05)',
          color: 'transparent'
        }}
      >
        ENGRACED
      </div>
    </footer>
  );
}
