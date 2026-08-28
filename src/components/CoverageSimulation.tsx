/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  ShieldCheck, 
  MapPin, 
  Cpu, 
  Activity, 
  Radio, 
  Wifi, 
  Gauge, 
  Compass, 
  PhoneCall, 
  ArrowRight,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

interface CoverageSimulationProps {
  setView?: (view: string) => void;
}

export default function CoverageSimulation({ setView }: CoverageSimulationProps) {
  const [activeCorridor, setActiveCorridor] = useState<'BEN' | 'LAG' | 'ASB' | 'ABJ'>('BEN');
  const [isPinging, setIsPinging] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState('Just now (100ms)');
  const [liveSpeed, setLiveSpeed] = useState(78);

  // Live speed oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 6;
        return Math.min(115, Math.max(65, Math.round(prev + delta)));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const corridorData = {
    BEN: {
      tag: "BENIN HQ & AIRPORT TARMAC",
      city: "Benin City Central Command",
      office: "17 Upper Adesuwa Road, GRA, Benin City",
      phone: "+234 818 584 0000",
      gps: "6.3350° N, 5.6037° E",
      convoyStatus: "Secured & Operational",
      activeUnits: "14 SUVs & Tactical Escorts",
      leadDistance: "35m Tight Envelope",
      telemetrySignal: "99.9% Dual-Band Sat",
      satellites: "14/16 Locked",
      mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
      routes: [
        "Benin City Airport ↔ GRA Executive Suites (7 min transfer)",
        "Edo State Government Enclave ↔ Ring Road Corridor",
        "Benin ↔ Warri / Delta State Fast Bypass"
      ]
    },
    LAG: {
      tag: "LAGOS - BENIN EXPRESSWAY",
      city: "Lagos VIP Transit Hub",
      office: "34 Ikorodu Road, Fadeyi, Yaba, Lagos",
      phone: "+234 818 587 0000",
      gps: "6.5244° N, 3.3792° E",
      convoyStatus: "Highway Convoy En Route",
      activeUnits: "22 Armored Platforms",
      leadDistance: "75m Highway Envelope",
      telemetrySignal: "98.7% Satellite Uplink",
      satellites: "12/16 Locked",
      mapImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      routes: [
        "Sagamu Interchange ↔ Ore Security Corridor",
        "Okada Bypass ↔ Benin Entry Checkpoint (Cleared)",
        "Murtala Muhammed Airport (MM2) ↔ Victoria Island Link"
      ]
    },
    ASB: {
      tag: "ASABA & DELTA CORRIDOR",
      city: "Asaba Strategic Command",
      office: "Suite 03, Faith Akpede Plaza, Asaba",
      phone: "+234 818 588 0000",
      gps: "6.1984° N, 6.7329° E",
      convoyStatus: "Bridge Protocol Active",
      activeUnits: "9 Executive Details",
      leadDistance: "40m Convoy Envelope",
      telemetrySignal: "99.4% Dual-Band Sat",
      satellites: "13/16 Locked",
      mapImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      routes: [
        "Asaba International Airport ↔ Delta State Secretariats",
        "Head Bridge Crossing ↔ Onitsha Commercial Hub",
        "Asaba ↔ Warri Energy Belt Protocol"
      ]
    },
    ABJ: {
      tag: "ABUJA FEDERAL LINK",
      city: "Abuja Diplomatic & FCT Desk",
      office: "Central Business District / Airport Express, Abuja",
      phone: "+234 818 584 0000",
      gps: "9.0765° N, 7.3986° E",
      convoyStatus: "Diplomatic Convoy Standby",
      activeUnits: "18 Armored V8 & Prado Convoys",
      leadDistance: "50m Diplomatic Envelope",
      telemetrySignal: "100.0% Military-Grade Sat",
      satellites: "16/16 Locked",
      mapImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      routes: [
        "Nnamdi Azikiwe Airport ↔ Transcorp / Diplomatic Zone",
        "Abuja ↔ Lokoja ↔ Benin Overland Corridor",
        "Three Arms Zone Executive Escort Protocol"
      ]
    }
  };

  const handlePingTelemetry = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setLastHeartbeat(`Pinged at ${new Date().toLocaleTimeString()} (42ms latency)`);
    }, 600);
  };

  const current = corridorData[activeCorridor];

  return (
    <section id="coverage" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050548]/10 text-[#050548] text-xs font-bold uppercase tracking-widest font-mono mb-2">
            <Radio size={14} className="text-[#050548] animate-pulse" />
            <span>24/7 Operations Room • GPS Telemetry &amp; Escort Radar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Live Regional Command &amp; Convoy Coverage
          </h2>
        </div>

        <button
          onClick={handlePingTelemetry}
          disabled={isPinging}
          className="self-start md:self-auto bg-white border border-zinc-200 hover:border-[#050548] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer font-mono"
        >
          <RefreshCw size={13} className={isPinging ? 'animate-spin text-[#050548]' : 'text-zinc-500'} />
          <span>{isPinging ? 'Pinging Satellites...' : 'Ping Telemetry Satellites'}</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-4 sm:p-8 flex flex-col lg:flex-row items-stretch gap-8 shadow-xl overflow-hidden"
      >
        
        {/* Left Col: Live Command Selector & Gauges */}
        <div className="w-full lg:w-[54%] flex flex-col justify-between space-y-6">
          
          {/* Corridor Switcher Buttons */}
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-bold block mb-2">
              Select Operations Theatre
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['BEN', 'LAG', 'ASB', 'ABJ'] as const).map((code) => {
                const isSelected = activeCorridor === code;
                return (
                  <button
                    key={code}
                    onClick={() => setActiveCorridor(code)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#050548] border-[#050548] text-white shadow-md'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold block uppercase ${
                      isSelected ? 'text-blue-200' : 'text-zinc-400'
                    }`}>
                      {code} Corridor
                    </span>
                    <span className="text-xs sm:text-sm font-black truncate block">
                      {code === 'BEN' ? 'Benin City' : code === 'LAG' ? 'Lagos Hub' : code === 'ASB' ? 'Asaba Desk' : 'Abuja FCT'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Corridor Live Dashboard */}
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {current.convoyStatus}
                </span>
                <h3 className="text-lg font-black text-zinc-900 mt-1">{current.city}</h3>
              </div>
              <div className="text-left sm:text-right font-mono text-xs text-zinc-500">
                <span className="block font-bold text-zinc-800">{current.gps}</span>
                <span className="text-[10px] text-zinc-400">{lastHeartbeat}</span>
              </div>
            </div>

            {/* Live Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Convoy Speed</span>
                <span className="text-base font-black text-[#050548] font-mono">{liveSpeed} km/h</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Satellites</span>
                <span className="text-base font-black text-emerald-600 font-mono">{current.satellites}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Escort Envelope</span>
                <span className="text-xs font-black text-zinc-800 font-mono truncate block">{current.leadDistance}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Uplink Health</span>
                <span className="text-xs font-black text-blue-700 font-mono truncate block">{current.telemetrySignal}</span>
              </div>
            </div>

            {/* Verified Mission Routes */}
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 font-mono">
                Active Tactical Patrol Corridors
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-600 font-medium">
                {current.routes.map((rt, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{rt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Office Coordinates & Dispatch Contact */}
            <div className="p-3.5 bg-[#050548]/5 rounded-xl border border-[#050548]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#050548] block">Physical Operations Base:</span>
                <span className="text-zinc-600 text-[11px]">{current.office}</span>
              </div>
              <a
                href={`tel:${current.phone.replace(/[^0-9+]/g, '')}`}
                className="bg-[#050548] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <PhoneCall size={12} />
                <span>{current.phone}</span>
              </a>
            </div>

          </div>

          {/* Quick CTA */}
          {setView && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">
                Need immediate close-protection or armored escort?
              </span>
              <button
                onClick={() => setView('booking')}
                className="text-xs font-bold text-[#050548] uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer font-mono"
              >
                <span>Dispatch Convoy via Booking Desk</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>

        {/* Right Col: Tactical Live Radar Display */}
        <div className="w-full lg:w-[46%] aspect-square lg:aspect-auto bg-gradient-to-br from-[#050548] via-[#0A0A78] to-[#030330] rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-between shadow-2xl">
          
          {/* Map background */}
          <img 
            src={current.mapImage} 
            alt="Tactical Radar Map" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030330] via-transparent to-[#050548]/60 pointer-events-none" />

          {/* Radar Sweep Animation Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full border border-blue-400/20 animate-ping opacity-40" />
            <div className="w-48 h-48 rounded-full border border-emerald-400/30 animate-pulse" />
          </div>

          {/* Top Live Badge */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <div className="bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY FEED</span>
            </div>

            <span className="text-[11px] font-mono text-zinc-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {current.tag}
            </span>
          </div>

          {/* Center Tactical Radar Target */}
          <div className="relative z-10 my-auto text-center p-6 bg-black/60 backdrop-blur-lg rounded-3xl border border-white/15 shadow-2xl max-w-xs text-white space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg">
              <Navigation className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h4 className="text-base font-black tracking-tight">{current.city}</h4>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              Active close-protection telemetry &amp; live speed monitoring active across Edo, Lagos &amp; Abuja hubs.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] font-mono text-emerald-400">
              <span>● Status: Secured</span>
              <span>● Delay: 0 min</span>
            </div>
          </div>

          {/* Bottom Satellite Telematics Feed */}
          <div className="relative z-10 w-full p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center justify-between text-white text-xs font-mono">
            <span className="truncate max-w-[200px]">MilSat ID: ENG-NIG-7740</span>
            <span className="text-yellow-300 font-bold">Encrypted 256-bit</span>
          </div>

        </div>

      </motion.div>

    </section>
  );
}
