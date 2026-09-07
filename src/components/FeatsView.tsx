import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { FeatItem } from '../types';
import { Award, Code2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BmwM4Car } from './BmwM4Car';

export const FeatsView: React.FC = () => {
  const { feats } = usePortfolio();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackLaneRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPointerDownRef = useRef(false);

  const CAR_HEIGHT = 96; // matches w-12 h-24 in BmwM4Car
  const maxCarTravel = Math.max(0, trackHeight - CAR_HEIGHT);

  // Measure track lane and scroll progress
  const updateMetrics = useCallback(() => {
    if (trackLaneRef.current) {
      setTrackHeight(trackLaneRef.current.clientHeight);
    }
    const el = scrollContainerRef.current;
    if (el) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(Math.max(el.scrollTop / maxScroll, 0), 1));
      } else {
        setScrollProgress(0);
      }
    }
  }, []);

  useEffect(() => {
    updateMetrics();

    const ro = new ResizeObserver(() => {
      updateMetrics();
    });

    if (trackLaneRef.current) ro.observe(trackLaneRef.current);
    if (scrollContainerRef.current) ro.observe(scrollContainerRef.current);
    window.addEventListener('resize', updateMetrics);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateMetrics);
    };
  }, [updateMetrics, feats]);

  // Track scroll progress for the BMW M4 car movement
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(Math.max(el.scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 180);
  };

  // Allow clicking / dragging on track to jump or smoothly scrub scroll
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    handleTrackPointerMove(e);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !trackLaneRef.current || !scrollContainerRef.current) return;
    const rect = trackLaneRef.current.getBoundingClientRect();
    if (rect.height <= 0) return;

    // Relative to lane top, centered around the car
    const relativeY = e.clientY - rect.top - CAR_HEIGHT / 2;
    const currentTravel = Math.max(0, rect.height - CAR_HEIGHT);
    const progress = currentTravel > 0 ? Math.min(Math.max(0, relativeY / currentTravel), 1) : 0;

    const el = scrollContainerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTop = progress * maxScroll;
    setScrollProgress(progress);
    setIsScrolling(true);
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 180);
  };

  // Car Y position in pixels from top of lane to exact bottom of lane
  const carY = scrollProgress * maxCarTravel;

  return (
    <div className="relative w-full h-screen bg-[#F7F3EB] text-black overflow-hidden flex flex-col justify-center select-none">
      {/* Editorial Open Book Pages Texture Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(#000000 0.75px, transparent 0.75px), radial-gradient(#000000 0.75px, #F7F3EB 0.75px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* Huge Background Watermark Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[15vw] md:text-[18vw] font-black tracking-tighter text-black/[0.05] uppercase font-heading leading-none">
          FEATURES
        </span>
      </div>

      {/* Main Container with Right Border Track for BMW M4 */}
      <div className="relative z-10 w-full h-full flex items-stretch gap-3 md:gap-6 px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-28 pb-8 md:pb-12">
        {/* Left/Center: Main Scrollable Feats Grid - STRICTLY 2 ITEMS PER ROW */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 h-full overflow-y-auto pr-2 md:pr-4 no-scrollbar scroll-smooth"
        >
          <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                  Highlights & Credentials ({feats.length})
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">
                  Notable Feats & Certifications
                </h2>
              </div>
            </div>

            {/* Exactly 2 cards per row across tablets, laptops, and desktops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feats.map((feat: FeatItem) => {
                if (feat.type === 'leetcode') {
                  return (
                    <motion.div
                      key={feat.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.45 }}
                      className="col-span-1 p-6 bg-[#18181b] text-white rounded-2xl border-2 border-black shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* LeetCode Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <Code2 className="w-5 h-5 text-amber-400" />
                            <span className="font-mono text-sm font-bold text-white">
                              LeetCode Profile
                            </span>
                          </div>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-white/10 text-emerald-400">
                            {feat.stats?.globalRank || 'Top 1.8%'}
                          </span>
                        </div>

                        {/* Solved Big Number */}
                        <div className="flex items-baseline space-x-3 mb-4">
                          <span className="text-4xl font-extrabold font-mono text-white">
                            {feat.stats?.total || 708}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            Problems Solved
                          </span>
                        </div>

                        {/* Difficulty breakdown */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-5">
                          <div className="p-2 bg-white/5 rounded-lg border border-emerald-500/30">
                            <p className="text-emerald-400 font-bold">{feat.stats?.easy || 219}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">Easy</p>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg border border-amber-500/30">
                            <p className="text-amber-400 font-bold">{feat.stats?.medium || 384}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">Medium</p>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg border border-rose-500/30">
                            <p className="text-rose-400 font-bold">{feat.stats?.hard || 105}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">Hard</p>
                          </div>
                        </div>

                        {/* Mini Rating Curve Chart */}
                        <div className="p-3 bg-black/40 rounded-lg border border-white/10 mb-4">
                          <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                            <span>Contest Rating</span>
                            <span className="text-amber-400 font-bold">
                              {feat.stats?.rating || 2067}
                            </span>
                          </div>
                          <svg viewBox="0 0 200 40" className="w-full h-8 stroke-amber-400 fill-none">
                            <path
                              d="M 0 35 Q 40 28, 80 20 T 140 12 T 200 6"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 font-sans">
                        {feat.subtitle || 'Active algorithmic problem solver focusing on Dynamic Programming, Graph Algorithms, and Trees.'}
                      </p>
                    </motion.div>
                  );
                }

                // Standard Feat & Certification Card
                return (
                  <motion.div
                    key={feat.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.45 }}
                    className="col-span-1 p-6 bg-white rounded-2xl border-2 border-black shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Media Box */}
                      <div className="w-full h-32 bg-black rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group">
                        {feat.type === 'cert' ? (
                          <div className="flex flex-col items-center space-y-1.5 text-neutral-300">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">
                              Verified Credential
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1.5 text-neutral-300">
                            <Award className="w-8 h-8 text-amber-400" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">
                              {feat.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-black mb-2 leading-snug">
                        {feat.title}
                      </h3>

                      <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4">
                        {feat.subtitle}
                      </p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {feat.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-black/5 text-neutral-700 border border-black/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                        <span>{feat.date || '2025'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Clean Border Track for BMW M4 */}
        <div
          className="w-14 md:w-20 h-full relative flex flex-col items-center justify-between py-2 shrink-0 select-none cursor-pointer"
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={handleTrackPointerUp}
        >
          {/* Clean Outer Border Track with start & end markers */}
          <div className="absolute inset-0 rounded-2xl bg-black/[0.03] border-2 border-black/20 backdrop-blur-xs flex flex-col items-center justify-between py-2 overflow-hidden pointer-events-none">
            {/* Start Marker */}
            <div className="text-[9px] font-mono tracking-widest text-neutral-400 font-bold uppercase select-none">
              START
            </div>

            {/* Subtle Road Center Dashed Line */}
            <div className="absolute top-7 bottom-9 left-1/2 -translate-x-1/2 w-[2px] border-r-2 border-dashed border-black/15" />

            {/* Checkered Finish Line & End Marker */}
            <div className="flex flex-col items-center select-none">
              <div
                className="w-8 h-2 rounded-[2px] opacity-40 border border-black/30 mb-0.5"
                style={{
                  backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)',
                  backgroundSize: '8px 8px',
                }}
              />
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
                END
              </span>
            </div>
          </div>

          {/* Dedicated Car Travel Lane from top padding (top-7) to bottom padding (bottom-9) */}
          <div ref={trackLaneRef} className="absolute inset-x-0 top-7 bottom-9 pointer-events-none">
            <motion.div
              animate={{
                y: carY,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
                mass: 0.4,
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
            >
              <BmwM4Car progress={scrollProgress} isScrolling={isScrolling} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
