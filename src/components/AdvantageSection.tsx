/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Clock, Zap, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import hiluxSide from '../images/2023-hilux-hybrid sideview.jpg';
import lcAngle from '../images/2024-Toyota-Land-Cruiser angle view.jpg';

interface AdvantageSectionProps {
  setView: (view: string) => void;
}

export default function AdvantageSection({ setView }: AdvantageSectionProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 95, damping: 15 }
    }
  };

  return (
    <section id="advantage" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full text-left">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-widest mb-2 font-mono">The Engraced Logistics Standard</h2>
        <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">The Logistics Advantage</h3>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Large Feature Card with Floating Right Image */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 bg-zinc-50 border border-zinc-100 rounded-[2rem] p-5 sm:p-7 md:p-8 lg:p-10 relative overflow-hidden group hover:border-zinc-200 transition-all active:scale-[0.99] duration-300 cursor-default h-[200px] xs:h-[220px] md:h-auto flex flex-col justify-center"
        >
          <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-[#0f2b5e]/10 rounded-full blur-3xl group-hover:bg-[#0f2b5e]/20 transition-all duration-500"></div>
          
          <div className="relative z-10 w-[58%] md:w-3/5 pr-2 md:pr-4">
            <div className="w-7 h-7 md:w-10 md:h-10 bg-white border border-zinc-200 rounded-lg md:rounded-xl flex items-center justify-center text-[#0f2b5e] mb-3 md:mb-6 shadow-sm">
              <Shield className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
            </div>
            <h4 className="text-[10px] xs:text-xs md:text-sm font-bold text-zinc-950 uppercase tracking-wide mb-1 md:mb-2">Professional Chauffeur & Logistics Support</h4>
            <p className="text-[8px] xs:text-[9.5px] md:text-xs lg:text-sm text-zinc-500 leading-normal md:leading-relaxed">
              We deploy certified professional chauffeurs, maintain a modern fleet of well-serviced vehicles, and provide reliable logistics coordination to ensure safe and timely transport across Nigeria.
            </p>
          </div>

          <img 
            src={lcAngle} 
            alt="Security Protocol" 
            className="absolute right-0 top-6 md:top-10 h-full w-[38%] object-cover rounded-tl-[1.5rem] shadow-2xl border-l border-t border-zinc-200" 
          />
        </motion.div>

        {/* Small Feature Cards */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:border-zinc-200 transition-all active:scale-[0.98] cursor-default text-left"
        >
          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-950 mb-6 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
            <Clock size={18} className="text-[#0f2b5e]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 uppercase tracking-wide mb-2">24/7 Journey Monitoring</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Constant telemetry surveillance, regional route hazard analysis, and seamless client communication channels.</p>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between group hover:border-zinc-200 transition-all active:scale-[0.98] cursor-default text-left"
        >
          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-950 mb-6 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
            <Zap size={18} className="text-[#0f2b5e]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 uppercase tracking-wide mb-2">Rapid Fleet Deployments</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Guaranteed hot-swappable vehicle replacements within urban centers and active mobile repair engineers.</p>
          </div>
        </motion.div>

        {/* Medium Horizontal Card with Floating Right Image */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 bg-zinc-950 rounded-[2rem] p-5 sm:p-7 md:p-8 lg:p-10 relative overflow-hidden flex items-center justify-between active:scale-[0.99] transition-transform duration-300 h-[170px] xs:h-[190px] md:h-auto"
        >
          <div className="absolute left-0 top-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:200%_200%] animate-[gradient_4s_linear_infinite]"></div>
          
          <div className="relative z-10 w-[58%] md:w-3/5 pr-2 md:pr-4 text-left">
            <h4 className="text-[8px] xs:text-[9.5px] font-bold text-[#0f2b5e] uppercase tracking-widest mb-1 font-mono">Utility Fleet</h4>
            <h4 className="text-[10px] xs:text-xs md:text-sm font-bold text-white uppercase tracking-wide mb-1.5 md:mb-2.5">Toyota Hilux Utility Fleet</h4>
            <p className="text-[8px] xs:text-[9.5px] md:text-xs text-zinc-400 leading-normal md:leading-relaxed max-w-sm">
              Our fleet features the latest Toyota Hilux double-cabin utility trucks. Built for rugged performance and ultimate reliability for logistics operations and fleet support.
            </p>
          </div>

          <img 
            src={hiluxSide} 
            alt="Toyota Hilux Utility Fleet" 
            className="absolute right-0 top-6 md:top-10 h-full w-[38%] object-cover rounded-tl-[1.5rem] shadow-2xl border-l border-t border-zinc-800" 
          />

          <button 
            onClick={() => setView('booking')}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-[#0f2b5e] hover:bg-white text-zinc-950 hover:text-zinc-950 rounded-full items-center justify-center cursor-pointer active:scale-90 transition-all shadow-xl"
          >
            <ArrowUpRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
