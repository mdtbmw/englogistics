/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lock, Activity, Navigation, Radar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProtocolTimeline() {
  const steps = [
    { id: '01', title: 'Booking Confirmation', desc: 'Secure reservation parameters trigger real-time vehicle allocation log entry.', icon: <Lock size={16}/> },
    { id: '02', title: 'Route Assessment', desc: 'Current road traffic schedules and route variables are evaluated by our office.', icon: <Activity size={16}/> },
    { id: '03', title: 'Vehicle Pre-Vetting', desc: 'Selected transport is detailed and verified with an extensive maintenance check.', icon: <Navigation size={16}/> },
    { id: '04', title: 'GPS Status Monitoring', desc: 'Continuous coordinate and status updates are kept active throughout the transit.', icon: <Radar size={16}/> },
    { id: '05', title: 'Safe Destination Dropoff', desc: 'Client arrives safely at the target location with immediate flight/drop log clearance.', icon: <CheckCircle2 size={16}/> }
  ];

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
    <section id="process" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden text-left">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 text-center"
      >
         <h2 className="text-[10px] font-bold text-[#0f2b5e] uppercase tracking-widest mb-2 font-mono">Operations Pipeline</h2>
         <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Our Standard Service Process</h3>
         <p className="text-zinc-500 text-xs md:text-sm max-w-sm mx-auto mt-2">
           Our five-step clearance methodology ensures zero margin of error on transit missions.
         </p>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:flex md:overflow-x-auto hide-scrollbar md:snap-x gap-4 pb-8 px-4 -mx-4 md:mx-0 md:px-0"
      >
        {steps.map((step, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className="w-full md:w-[290px] md:shrink-0 md:snap-center bg-gradient-to-br from-[#f8faff] to-[#eef3ff] border border-[#0f2b5e]/10 rounded-2xl p-6 relative group hover:border-[#0f2b5e]/30 hover:shadow-lg transition-all duration-300 cursor-default"
          >
            {idx !== steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 -right-3 w-6 border-t border-dashed border-zinc-200 z-0"></div>
            )}
            <div className="relative z-10 flex flex-col gap-5">
               <div className="flex items-center justify-between">
                 <div className="w-10 h-10 bg-[#0f2b5e] text-white rounded-xl flex items-center justify-center group-hover:bg-[#071a3d] group-hover:text-white transition-colors duration-300">
                   {step.icon}
                 </div>
                 <span className="text-xs font-bold text-zinc-300 font-mono">{step.id}</span>
               </div>
               <div>
                 <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-widest mb-1.5">{step.title}</h4>
                 <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{step.desc}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
