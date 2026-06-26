/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DESTINATIONS } from '../data';

export default function RouteMarquee() {
  return (
    <div className="w-full overflow-hidden bg-zinc-50 py-4.5 border-y border-zinc-100 mb-16 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee flex items-center gap-10">
        {DESTINATIONS.map((dest, i) => (
          <div key={i} className="flex items-center gap-10 shrink-0">
            <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-mono">
              {dest}
            </span>
            <span className="text-[#0152FA] text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
