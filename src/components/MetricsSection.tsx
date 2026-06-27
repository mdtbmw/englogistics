/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface MetricItem {
  value: string;
  label: string;
  sub: string;
}

export default function MetricsSection() {
  const metrics: MetricItem[] = [
    { value: '24/7/365', label: 'Surveillance Desk', sub: 'Always online' },
    { value: '120+', label: 'Premium Fleet', sub: 'Rigid mechanical certification' },
    { value: '36 States', label: 'Operational Coverage', sub: 'Nationwide travel network' },
    { value: 'Premium', label: 'Travel Protocol', sub: 'VIP airport pickup' }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 14 }
    }
  };

  return (
    <section id="metrics" className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="bg-gradient-to-br from-[#0F0F8B] to-[#080870] rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-[#0F0F8B]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="w-full lg:w-1/3 relative z-10 text-left">
          <span className="text-[11px] font-mono text-[#0000FD] uppercase tracking-widest block mb-2">Operational Integrity</span>
          <h3 className="text-white text-2xl lg:text-3xl font-medium leading-[1.15] mb-4 tracking-tight">
            Certified Excellence in Motion. Nationwide.
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
            From the bustling economic highways of Lagos to VIP convoys in Abuja and executive transfers in Benin City, we set the benchmark for state-of-the-art secure travel and logistics services in Nigeria.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 relative z-10 text-left"
        >
          {metrics.map((metric, idx) => (
            <motion.div variants={itemVariants} key={idx} className="flex flex-col gap-2 border-l border-zinc-800 pl-4.5 py-1">
              <span className="text-[#0000FD] text-xl md:text-2.5xl font-mono font-bold tracking-tight">
                {metric.value}
              </span>
              <div>
                <span className="text-white text-[12.5px] font-bold uppercase tracking-wider block font-sans">
                  {metric.label}
                </span>
                <span className="text-zinc-500 text-[11px] block font-mono">
                  {metric.sub}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
