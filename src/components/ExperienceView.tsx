import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExperienceItem } from '../types';

export const ExperienceView: React.FC = () => {
  const { experiences } = usePortfolio();
  const [selectedId, setSelectedId] = useState<string>(
    experiences[0]?.id || ''
  );

  const selectedExp: ExperienceItem | undefined =
    experiences.find((e) => e.id === selectedId) || experiences[0];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col justify-center select-none">
      {/* Huge Background Watermark Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[14vw] md:text-[18vw] font-black tracking-tighter text-white/[0.05] uppercase font-heading leading-none">
          EXPERIENCE
        </span>
      </div>

      {/* Main Split Layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row pt-24 md:pt-28 pb-8 md:pb-12 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Mobile Horizontal Experience Selector */}
        <div className="md:hidden w-full overflow-x-auto no-scrollbar flex gap-2 pb-2 mb-2 shrink-0">
          {experiences.map((exp: ExperienceItem) => {
            const isSelected = selectedExp?.id === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedId(exp.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold shadow-md'
                    : 'bg-[#18181b] text-neutral-400 border-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-xs font-bold truncate max-w-[170px]">{exp.company}</div>
                <div className="text-[10px] font-mono opacity-80 truncate max-w-[170px]">{exp.role}</div>
              </button>
            );
          })}
        </div>

        {/* Left Column (Desktop): Experience Card Selector with Scroll Side Animations */}
        <div className="hidden md:flex md:w-5/12 lg:w-4/12 h-full flex-col overflow-y-auto pr-4 lg:pr-8 space-y-4 no-scrollbar">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 sticky top-0 bg-black/90 backdrop-blur-xs py-2 z-10"
          >
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Timeline & Internships ({experiences.length})
            </span>
          </motion.div>

          {experiences.map((exp: ExperienceItem, idx: number) => {
            const isSelected = selectedExp?.id === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.06, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedId(exp.id)}
                className={`p-5 lg:p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'bg-[#141416] border-white text-white shadow-lg shadow-white/5 scale-[1.01]'
                    : 'bg-black/40 border-white/20 text-neutral-400 hover:border-white/50 hover:text-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg lg:text-xl font-bold tracking-tight text-white line-clamp-1">
                    {exp.company}
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-white/10 text-neutral-300 border border-white/20 shrink-0 ml-2">
                    {exp.type}
                  </span>
                </div>

                <p className="text-xs lg:text-sm font-semibold text-neutral-200 mb-1 line-clamp-1">
                  {exp.role}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-3">
                  <span>{exp.period}</span>
                  <span>•</span>
                  <span>{exp.location}</span>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.slice(0, 4).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-white/5 text-neutral-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dividing Center Line */}
        <div className="hidden md:block w-[1px] h-[90%] bg-white/20 self-center mx-2 lg:mx-4 shrink-0" />

        {/* Right Column: Detailed Experience View (Starts from Top - No Cutoff) */}
        <div className="w-full md:w-7/12 lg:w-8/12 flex-1 md:h-full overflow-y-auto pl-0 md:pl-6 lg:pl-8 pt-2 md:pt-0 no-scrollbar flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {selectedExp ? (
              <motion.div
                key={selectedExp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl pt-1 pb-16"
              >
                {/* Header overview badge & role */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono text-neutral-300 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Role Deep-Dive</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/80">{selectedExp.type}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {selectedExp.role}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{selectedExp.company}</span>
                    <span>—</span>
                    <span className="text-neutral-300">{selectedExp.period}</span>
                    <span>•</span>
                    <span className="text-neutral-400">{selectedExp.location}</span>
                  </p>
                </div>

                {/* Description Summary */}
                <p className="text-xs sm:text-sm md:text-base text-neutral-200 leading-relaxed font-sans mb-6">
                  {selectedExp.description}
                </p>

                {/* Bullet Highlights */}
                <div className="space-y-3.5 mb-6">
                  {selectedExp.points.map((point: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.1 + idx * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <span className="text-xs text-emerald-400 mt-0.5 shrink-0 font-mono">▶</span>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Technologies & Architecture */}
                <div className="pt-5 border-t border-white/15">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-2.5">
                    Technologies & Architecture
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1 rounded-md bg-white/10 text-white border border-white/25 hover:border-white/50 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-neutral-500 font-mono text-sm py-12">
                No experience entries available. Use Page 8 Admin CMS to add experiences.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
