import { motion } from 'motion/react';

export default function ClientsSection() {
  const clients = [
    { name: 'Client 1', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/1.png' },
    { name: 'Client 2', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/2.png' },
    { name: 'Client 3', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/3.png' },
    { name: 'Client 4', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/4.png' },
    { name: 'Client 5', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/5.png' },
    { name: 'Client 6', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/6.png' },
    { name: 'Client 7', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/7.png' },
    { name: 'Client 8', logo: 'https://www.engracedlogistics.com.ng/storage/2019/01/8.png' },
  ];

  return (
    <section id="clients" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-[12px] font-bold text-[#0F0F8B] uppercase tracking-widest mb-2 font-mono">Our Clients</h2>
        <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Trusted by Leading Organizations</h3>
        <p className="text-zinc-500 text-xs md:text-sm max-w-lg mx-auto mt-3">
          Our growth can be traced largely to referrals from clients who have enjoyed a satisfying experience with us.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-12 items-center animate-marquee py-4">
          {[...clients, ...clients].map((client, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[160px] h-[80px] bg-white border border-zinc-100 rounded-xl flex items-center justify-center p-4 shadow-sm hover:shadow-md hover:border-[#0F0F8B]/20 transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
