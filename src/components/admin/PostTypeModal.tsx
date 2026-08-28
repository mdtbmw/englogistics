/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ListOrdered, 
  FileText, 
  X, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Clock,
  Image,
  Sliders,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PostType } from '../../types';

interface PostTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: PostType) => void;
}

export default function PostTypeModal({ isOpen, onClose, onSelectType }: PostTypeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-zinc-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden text-left my-8"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#050548] via-[#0A0A78] to-[#050548] text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest font-mono mb-2">
                <Sparkles size={13} className="text-yellow-300" />
                <span>Publication Studio</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Select Article Type
              </h3>
              <p className="text-zinc-300 text-xs mt-1">
                Choose between a Step-by-Step Operational How-To or a Deep-Dive Executive Editorial.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer relative z-10 shrink-0"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Archetypes Grid: Exactly 2 Distinct Options */}
          <div className="p-6 grid grid-cols-1 gap-4">
            
            {/* OPTION 1: STEP-BY-STEP HOW-TO */}
            <div
              onClick={() => onSelectType('how-to')}
              className="p-6 rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-white hover:border-[#050548] hover:shadow-lg transition-all cursor-pointer group text-left relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#050548] text-white flex items-center justify-center shadow-md shadow-[#050548]/20 group-hover:scale-105 transition-transform">
                    <ListOrdered size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-zinc-950 group-hover:text-[#050548] transition-colors">
                        Step-by-Step How-To Protocol
                      </h4>
                      <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 text-[#050548] px-2 py-0.5 rounded-full">
                        Action Checklist
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Tailored for sequential guides: booking steps, airport fast-track protocols, and convoy procedures.
                    </p>
                  </div>
                </div>

                <button className="px-4 py-2 bg-[#050548] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-[#0A0A78] transition-colors shadow-sm font-mono shrink-0">
                  <span>Create How-To</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-100 text-[11px] font-medium text-zinc-600">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-blue-600" />
                  <span>Numbered Steps (01, 02)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-blue-600" />
                  <span>Step Time Estimates</span>
                </span>
                <span className="flex items-center gap-1">
                  <Image size={13} className="text-blue-600" />
                  <span>Step Photos (Base64)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Award size={13} className="text-blue-600" />
                  <span>Interactive Checkmarks</span>
                </span>
              </div>
            </div>

            {/* OPTION 2: EXECUTIVE EDITORIAL */}
            <div
              onClick={() => onSelectType('standard')}
              className="p-6 rounded-3xl border-2 border-zinc-200 bg-white hover:border-[#050548] hover:shadow-lg transition-all cursor-pointer group text-left relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-zinc-950 group-hover:text-[#050548] transition-colors">
                        Executive Editorial &amp; Analysis
                      </h4>
                      <span className="text-[10px] font-mono font-bold uppercase bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full">
                        Longform Journalism
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Tailored for in-depth fleet reviews, transport economics, route security briefings, and thought leadership.
                    </p>
                  </div>
                </div>

                <button className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-zinc-800 transition-colors shadow-sm font-mono shrink-0">
                  <span>Create Editorial</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-100 text-[11px] font-medium text-zinc-600">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-zinc-700" />
                  <span>Rich WYSIWYG Editor</span>
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles size={13} className="text-zinc-700" />
                  <span>AI Summary &amp; Takeaways</span>
                </span>
                <span className="flex items-center gap-1">
                  <Sliders size={13} className="text-zinc-700" />
                  <span>In-Article Rate Calculator</span>
                </span>
                <span className="flex items-center gap-1">
                  <Image size={13} className="text-zinc-700" />
                  <span>In-Text Floating Images</span>
                </span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Dynamic forms will adapt automatically based on your choice.</span>
            <button
              onClick={onClose}
              className="font-bold text-zinc-700 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}