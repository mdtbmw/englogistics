/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Compass, Lock, Zap, Star, CheckCircle, Target, Eye, Award, ShieldAlert } from 'lucide-react';
import pradoImage from '../images/2025-toyota-land-cruiser.jpg';

interface AboutUsPanelProps {
  setView: (view: string) => void;
}

export default function AboutUsPanel({ setView }: AboutUsPanelProps) {
  const values = [
    { 
      letter: 'S', 
      name: 'Safety', 
      desc: 'Safety is our highest priority. We are committed to maintaining the highest standards of vehicle safety, driver competence, and operational procedures to ensure every journey is secure and worry-free.', 
      icon: <Shield size={22} className="text-[#0f2b5e]" /> 
    },
    { 
      letter: 'M', 
      name: 'Mobility Excellence', 
      desc: 'We deliver reliable, innovative, and efficient transportation solutions designed to provide comfort, convenience, and exceptional value to our clients.', 
      icon: <Compass size={22} className="text-[#0f2b5e]" /> 
    },
    { 
      letter: 'I', 
      name: 'Integrity', 
      desc: 'We conduct our business with honesty, transparency, accountability, and professionalism, building lasting relationships founded on trust and respect.', 
      icon: <Lock size={22} className="text-[#0f2b5e]" /> 
    },
    { 
      letter: 'L', 
      name: 'Leadership', 
      desc: 'We strive to lead the transportation industry through innovation, continuous improvement, professionalism, and a commitment to excellence in all that we do.', 
      icon: <Zap size={22} className="text-[#0f2b5e]" /> 
    },
    { 
      letter: 'E', 
      name: 'Exceptional Experience', 
      desc: 'We are dedicated to exceeding expectations by providing personalized service, attention to detail, comfort, reliability, and memorable travel experiences.', 
      icon: <Star size={22} className="text-[#0f2b5e]" /> 
    }
  ];

  const reasons = [
    'Professional and highly trained chauffeurs',
    'Safe, modern, and well-maintained vehicles',
    'Executive and corporate transportation solutions',
    'Reliable airport transfer services',
    'Comfortable interstate travel services',
    'Protocol and VIP transportation services',
    '24/7 customer support',
    'On-demand customized quote verification',
    'Commitment to safety, professionalism, and excellence',
    'Trusted by individuals, businesses, and organizations'
  ];

  return (
    <div className="pt-32 md:pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Hero Section */}
      <section className="mb-20 bg-gradient-to-br from-[#0f2b5e] to-[#071a3d] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#6b9fff]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-[10px] font-bold text-[#6b9fff] uppercase tracking-[0.25em] mb-4 font-mono">Corporate Profile</h2>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.08]">
            Travel in Style.<br />Experience Excellence.
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 max-w-2xl font-sans">
            Redefining premium travel and executive mobility with a pre-vetted fleet, pre-calculated route security, and an exceptional customer-first culture designed for corporate enterprises, VIP delegates, and private clients.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('booking')}
              className="bg-[#6b9fff] text-[#071a3d] text-[10.5px] font-bold px-7 py-4 rounded-xl hover:bg-white transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-[#0f2b5e]/30 cursor-pointer"
            >
              Book a Ride
            </button>
          </div>
        </div>
      </section>

      {/* The Story & Visual Showcase (Dual-Column) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-center">
        
        {/* Narrative Description */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-widest font-mono">Our Narrative</h2>
            <h3 className="text-3xl md:text-4.5xl font-medium text-zinc-950 tracking-tight leading-tight">
              Redefining Executive Travel With A Customer-First Culture
            </h3>
          </div>
          
          <div className="text-zinc-650 text-xs md:text-[13.5px] leading-relaxed space-y-4 font-sans">
            <p>
              <strong className="text-zinc-900 font-semibold">Engraced Logistics</strong> is a premium car rental and logistics company committed to delivering safe, reliable, and professional mobility services across Nigeria. We exist to redefine the standards of transportation by combining exceptional service delivery, modern fleet solutions, and a customer-first approach that places comfort, safety, and satisfaction at the center of every journey.
            </p>
            <p>
              At Engraced Logistics, we understand that transportation is more than simply moving people from one destination to another—it is about creating seamless experiences, building trust, and providing peace of mind. Whether serving corporate executives, business travelers, government institutions, diplomatic missions, event planners, tourists, families, or individuals, our commitment remains unwavering: to provide mobility solutions that are dependable, professional, and tailored to the unique needs of every client.
            </p>
            <p>
              Our comprehensive range of services includes car rentals, airport transfers, interstate travel, chauffeur hire, VIP & protocol services, event transport, and tour & leisure. Through our diverse fleet of well-maintained vehicles and a team of highly trained, professional chauffeurs, we ensure that every journey is executed with precision, comfort, and excellence.
            </p>
            <p>
              What distinguishes Engraced Logistics is our relentless pursuit of service excellence. We are passionate about delivering transportation experiences that exceed expectations through professionalism, punctuality, attention to detail, and operational efficiency. Every vehicle in our fleet is maintained to the highest standards, while every member of our team is trained to uphold the values and service culture that define our brand.
            </p>
            <p>
              As we continue to expand our reach and capabilities, our vision remains clear: to become one of Nigeria's most trusted and respected transportation brands, recognized for innovation, reliability, professionalism, and world-class customer service.
            </p>
          </div>
        </div>

        {/* Creative Image Panel (Image-Oriented & Overlapping Cards) */}
        <div className="lg:col-span-5 relative w-full flex justify-center">
          <div className="relative w-full max-w-[400px] aspect-square rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden group">
            <img 
              src={pradoImage} 
              alt="Premium Toyota Prado (2025)" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071a3d] via-[#071a3d]/40 to-transparent"></div>
            
            {/* Floating Information Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <span className="text-[9px] font-mono text-[#6b9fff] uppercase tracking-widest font-bold block mb-1">Fleet Telemetry</span>
              <span className="text-sm font-semibold text-white uppercase block">Nationwide Routing Desk</span>
              <span className="text-zinc-400 text-[10px] block mt-1">Benin Head Office • Lagos Protocol Desk</span>
            </div>
          </div>
          
          {/* Overlapping Detail Badge Card */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:top-auto lg:bottom-[-24px] lg:left-[-32px] lg:translate-x-0 bg-gradient-to-br from-[#0f2b5e] to-[#071a3d] border border-[#0f2b5e]/30 text-white rounded-2xl p-5 shadow-2xl flex items-center gap-3.5 max-w-[220px] text-left animate-pulse-slow z-20">
            <div className="w-10 h-10 bg-[#6b9fff]/10 border border-[#6b9fff]/20 rounded-xl flex items-center justify-center text-[#6b9fff] shrink-0">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[8.5px] font-mono text-[#6b9fff] uppercase font-bold block">Certified SLA</span>
              <span className="text-xs font-medium uppercase tracking-tight block mt-0.5">Mobility Excellence</span>
            </div>
          </div>
        </div>

      </section>

      {/* Standout Mission & Vision Section */}
      <section className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-[0.2em] mb-2 font-mono">Our Mandate</h2>
          <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Purpose & Destination</h3>
          <p className="text-zinc-500 text-xs md:text-sm mt-2">
            Clear directives defining our operational methods, client outcomes, and long-term industry commitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Redesigned Mission Card */}
          <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 md:p-12 relative overflow-hidden text-left shadow-lg hover:shadow-xl hover:border-[#0f2b5e]/30 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[320px] group">
            {/* Top golden accent line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#0f2b5e]"></div>
            
            {/* Soft decorative golden glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0f2b5e]/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:bg-[#0f2b5e]/10"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#0f2b5e]/5 border border-[#0f2b5e]/15 rounded-2xl flex items-center justify-center text-[#0f2b5e] group-hover:scale-110 transition-transform duration-500">
                  <Target size={24} />
                </div>
                <span className="text-4xl font-extrabold text-zinc-100 font-mono tracking-tighter group-hover:text-[#0f2b5e]/20 transition-colors duration-500">
                  01
                </span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-[0.2em] font-mono block">Our Mission</span>
                <h4 className="text-lg font-semibold text-zinc-900 tracking-tight leading-snug font-sans">
                  Precision execution and client-centric mobility.
                </h4>
                <p className="text-[13px] text-zinc-600 leading-relaxed font-sans">
                  To provide safe, reliable, and premium transportation solutions that exceed customer expectations through professionalism, innovation, operational excellence, and exceptional service delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Redesigned Vision Card */}
          <div className="bg-white border border-zinc-200/80 rounded-[2rem] p-8 md:p-12 relative overflow-hidden text-left shadow-lg hover:shadow-xl hover:border-[#0f2b5e]/30 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[320px] group">
            {/* Top golden accent line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#0f2b5e]"></div>
            
            {/* Soft decorative golden glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0f2b5e]/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:bg-[#0f2b5e]/10"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#0f2b5e]/5 border border-[#0f2b5e]/15 rounded-2xl flex items-center justify-center text-[#0f2b5e] group-hover:scale-110 transition-transform duration-500">
                  <Eye size={24} />
                </div>
                <span className="text-4xl font-extrabold text-zinc-100 font-mono tracking-tighter group-hover:text-[#0f2b5e]/20 transition-colors duration-500">
                  02
                </span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-[0.2em] font-mono block">Our Vision</span>
                <h4 className="text-lg font-semibold text-zinc-900 tracking-tight leading-snug font-sans">
                  Setting the benchmark for gold-standard transit.
                </h4>
                <p className="text-[13px] text-zinc-600 leading-relaxed font-sans">
                  To become Nigeria's preferred transportation and mobility solutions provider, setting the benchmark for safety, professionalism, customer satisfaction, and service excellence across the transportation industry.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values: S.M.I.L.E */}
      <section className="mb-24">
        <div className="mb-12 text-left">
          <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-widest mb-2 font-mono">Our Foundation</h2>
          <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Driven by S.M.I.L.E.</h3>
          <p className="text-zinc-500 text-xs md:text-sm max-w-lg mt-2">
            Our operational culture is built upon five foundational pillars that guide every protocol deployment, road audit, and client journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((v) => (
            <div key={v.letter} className="bg-white border border-zinc-150 rounded-2xl p-6 hover:border-[#0f2b5e]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[280px] group text-left">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-[#0f2b5e]/10 transition-colors duration-300">
                    {v.icon}
                  </div>
                  <span className="text-3xl font-black text-zinc-100 font-mono tracking-widest group-hover:text-[#0f2b5e]/20 transition-colors">{v.letter}</span>
                </div>
                <h4 className="text-[11.5px] font-bold text-zinc-950 uppercase tracking-widest mb-3 font-sans">{v.name}</h4>
                <p className="text-[11px] text-zinc-550 leading-relaxed font-sans">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 md:p-14 mb-24">
        <div className="mb-12 text-left">
          <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-widest mb-2 font-mono">Operational Excellence</h2>
          <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Why Choose Engraced Logistics?</h3>
          <p className="text-zinc-500 text-xs md:text-sm mt-2 max-w-xl">
            At Engraced Logistics, we do not simply provide vehicles—we provide dependable mobility solutions tailored to meet the needs of individuals, families, businesses, government institutions, and corporate clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          {reasons.map((r, idx) => (
            <div key={idx} className="flex items-start gap-3.5 text-left">
              <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#0f2b5e] shrink-0 shadow-sm mt-0.5">
                <CheckCircle size={11} className="fill-[#0f2b5e]/5" />
              </div>
              <span className="text-[11.5px] text-zinc-700 font-medium font-sans leading-relaxed">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Service Promise Banner (Creative & Illustrative) */}
      <section className="bg-gradient-to-br from-[#0f2b5e] to-[#071a3d] rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-[#0f2b5e]/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,43,94,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#6b9fff]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#6b9fff]/15 border border-[#6b9fff]/30 rounded-full flex items-center justify-center text-[#6b9fff] p-3 shadow-lg">
            <Shield size={28} />
          </div>
          
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-[#6b9fff] uppercase tracking-[0.25em] font-bold">Our Service Promise</span>
            <h3 className="text-2xl md:text-4xl font-semibold uppercase tracking-tight leading-tight">
              Driven by S.M.I.L.E.,<br />Defined by Excellence.
            </h3>
          </div>
          
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-lg">
            At Engraced Logistics, we are committed to delivering every journey with professionalism, safety, comfort, reliability, and excellence. We strive to exceed expectations, build lasting relationships, and create transportation experiences that keep our clients coming back.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4.5 w-full justify-center">
            <button 
              onClick={() => setView('booking')}
              className="w-full sm:w-auto bg-[#6b9fff] text-[#071a3d] text-[10px] font-bold px-8 py-4 rounded-xl hover:bg-white transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-[#0f2b5e]/30 cursor-pointer"
            >
              Book a Ride
            </button>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block sm:inline">
              ENG-PROTOCOL-SLA-VERIFIED
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
