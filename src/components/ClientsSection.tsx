import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface Client {
  name: string;
  logoSrc?: string;
  alt: string;
  renderCustom?: () => ReactNode;
}

export default function ClientsSection() {
  const clients: Client[] = [
    {
      name: 'FirstBank',
      logoSrc: '/assets/logos/firstbank_full.svg',
      alt: 'First Bank of Nigeria Official Logo'
    },
    {
      name: 'Pan Ocean',
      logoSrc: '/assets/logos/panocean.jpg',
      alt: 'Pan Ocean Oil Corporation Official Logo'
    },
    {
      name: 'Wema Bank',
      logoSrc: '/assets/logos/wemabank.png',
      alt: 'Wema Bank Official Logo'
    },
    {
      name: 'GIZ',
      logoSrc: '/assets/logos/giz.svg',
      alt: 'GIZ Deutsche Gesellschaft für Internationale Zusammenarbeit Logo'
    },
    {
      name: 'PIND Foundation',
      logoSrc: '/assets/logos/pind.png',
      alt: 'PIND Foundation Niger Delta Official Logo'
    },
    {
      name: 'Lee Engineering',
      logoSrc: '/assets/logos/lee-engineering.svg',
      alt: 'Lee Engineering & Construction Company Official Logo'
    }
  ];

  // Repeat the client list to fill the marquee seamlessly
  const repeatedClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section id="clients" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-[16px] font-bold text-[#050548] uppercase tracking-widest mb-2 font-mono">Our Clients</h2>
        <h3 className="text-2xl md:text-3.5xl font-medium text-zinc-950 tracking-tight">Trusted By Great Companies</h3>
        <p className="text-zinc-500 text-xs md:text-sm max-w-lg mx-auto mt-3">
          We are proud to work with these organizations.
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
          {repeatedClients.map((client, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[180px] h-[80px] bg-white border border-zinc-200/80 rounded-2xl flex items-center justify-center p-3.5 shadow-sm hover:shadow-md hover:border-[#050548]/40 transition-all duration-300 group"
            >
              {client.logoSrc ? (
                <img
                  src={client.logoSrc}
                  alt={client.alt || client.name}
                  className="max-h-12 max-w-[145px] w-auto h-auto object-contain transition-all duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : client.renderCustom ? (
                client.renderCustom()
              ) : (
                <span className="text-xs font-black text-zinc-800 font-mono tracking-wider">{client.name}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
