import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExperienceItem } from '../types';

interface ScrollMotionContext {
  dir: number;
  speed: number; // Normalized scroll speed multiplier (0.7 = slow/gentle, 1.0 = normal, 1.6 = fast)
}

export const ExperienceView: React.FC = () => {
  const { experiences } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = scroll down (next), -1 = scroll up (prev)
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const detailsScrollRef = useRef<HTMLDivElement>(null);

  // Track inner container scroll velocity for continuous subtle slide-up response
  const { scrollY } = useScroll({ container: detailsScrollRef });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 35,
    stiffness: 280,
  });
  const velocitySlideY = useTransform(
    smoothVelocity,
    [-800, 0, 800],
    [6, 0, -6]
  );

  // Keep activeIndex in bounds if experiences array changes in Admin CMS
  useEffect(() => {
    if (experiences.length > 0 && activeIndex >= experiences.length) {
      setActiveIndex(0);
    }
  }, [experiences, activeIndex]);

  const total = experiences.length;
  const activeExp: ExperienceItem | undefined = experiences[activeIndex] || experiences[0];

  const goToIndex = useCallback(
    (nextIdx: number, dir?: number, speedMultiplier: number = 1) => {
      if (total <= 1) return;
      const bounded = ((nextIdx % total) + total) % total;
      if (bounded === activeIndex) return;
      const computedDir =
        dir !== undefined ? dir : nextIdx > activeIndex ? 1 : -1;
      const clampedSpeed = Math.min(1.65, Math.max(0.7, speedMultiplier));
      setDirection(computedDir);
      setScrollSpeed(clampedSpeed);
      setActiveIndex(bounded);
      if (detailsScrollRef.current) {
        detailsScrollRef.current.scrollTop = 0;
      }
    },
    [activeIndex, total]
  );

  const handleStep = useCallback(
    (stepDir: 1 | -1, speedMultiplier: number = 1) => {
      if (total <= 1) return;
      const now = Date.now();
      const clampedSpeed = Math.min(1.65, Math.max(0.7, speedMultiplier));
      // Faster scroll cadence slightly reduces cooldown to stay synchronized with user scroll speed
      const dynamicCooldown = Math.round(620 / Math.sqrt(clampedSpeed));
      if (now - lastScrollTimeRef.current < dynamicCooldown) return;
      lastScrollTimeRef.current = now;
      goToIndex(activeIndex + stepDir, stepDir, clampedSpeed);
    },
    [activeIndex, total, goToIndex]
  );

  // Mouse wheel / touchpad scroll handler -> rotates the half-round timeline & syncs slide-up speed
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const absDelta = Math.abs(e.deltaY);
    if (absDelta < 18) return;

    // If scrolling inside details box on a small screen and it has overflow, allow reading before switching
    const detailsEl = detailsScrollRef.current;
    if (detailsEl && detailsEl.contains(e.target as Node)) {
      const canScrollDown =
        detailsEl.scrollTop + detailsEl.clientHeight < detailsEl.scrollHeight - 6;
      const canScrollUp = detailsEl.scrollTop > 6;
      if (e.deltaY > 0 && canScrollDown) return;
      if (e.deltaY < 0 && canScrollUp) return;
    }

    // Normalize wheel delta (18..180+) into a smooth speed multiplier (0.75..1.6)
    const normalizedSpeed = Math.min(
      1.6,
      Math.max(0.75, 0.7 + (absDelta - 18) / 140)
    );

    if (e.deltaY > 0) {
      handleStep(1, normalizedSpeed);
    } else if (e.deltaY < 0) {
      handleStep(-1, normalizedSpeed);
    }
  };

  // Touch swipe support for mobile/tablet with swipe velocity tracking
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    const elapsedMs = Math.max(16, Date.now() - touchStartTimeRef.current);
    touchStartYRef.current = null;
    if (Math.abs(deltaY) < 40) return;

    // Pixels per millisecond velocity mapped to 0.75..1.6
    const swipeVelocity = Math.abs(deltaY) / elapsedMs;
    const normalizedSpeed = Math.min(1.6, Math.max(0.75, swipeVelocity * 1.15));

    if (deltaY > 0) {
      handleStep(1, normalizedSpeed);
    } else {
      handleStep(-1, normalizedSpeed);
    }
  };

  // Keyboard Up/Down arrow support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleStep(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handleStep(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleStep]);

  // Half-round circular arc variants for the single active timeline card
  // Moves along a semi-circular curve: enters from bottom-left arc (+70deg) -> center apex (0deg) -> exits top-left arc (-70deg)
  const halfRoundCardVariants = {
    initial: (dir: number) => ({
      x: -180,
      y: dir > 0 ? 190 : -190,
      rotate: dir > 0 ? 34 : -34,
      scale: 0.75,
      opacity: 0,
    }),
    animate: (dir: number) => ({
      x: [-180, -55, 0],
      y: dir > 0 ? [190, 75, 0] : [-190, -75, 0],
      rotate: dir > 0 ? [34, 12, 0] : [-34, -12, 0],
      scale: [0.75, 0.92, 1],
      opacity: [0, 0.88, 1],
      transition: {
        duration: 0.65,
        times: [0, 0.55, 1],
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: (dir: number) => ({
      x: [0, -65, -185],
      y: dir > 0 ? [0, -85, -195] : [0, 85, 195],
      rotate: dir > 0 ? [0, -14, -34] : [0, 14, 34],
      scale: [1, 0.9, 0.74],
      opacity: [1, 0.65, 0],
      transition: {
        duration: 0.48,
        times: [0, 0.45, 1],
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  // Compute angles along the half-circle (-65deg to +65deg) for the small step dots on the arc
  const getStepAngleDeg = (idx: number) => {
    if (total <= 1) return 0;
    const span = 120; // -60deg to +60deg
    return -span / 2 + (idx / (total - 1)) * span;
  };

  const motionContext: ScrollMotionContext = {
    dir: direction,
    speed: scrollSpeed,
  };

  // Subtle slide-up + fade-in variants synchronized with user scroll speed
  const detailContainerVariants = {
    hidden: ({ dir, speed }: ScrollMotionContext) => {
      // Slight slide-up transform when scrolling down (or gentle slide when scrolling up), scaled by scroll speed
      const slideDistance = Math.round(26 * Math.min(1.3, Math.max(0.8, speed)));
      return {
        opacity: 0,
        y: dir > 0 ? slideDistance : -Math.round(slideDistance * 0.75),
        scale: 0.985,
        filter: 'blur(4px)',
      };
    },
    visible: ({ speed }: ScrollMotionContext) => {
      const duration = Math.min(0.6, Math.max(0.28, 0.48 / speed));
      const stagger = Math.min(0.09, Math.max(0.035, 0.07 / speed));
      return {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration,
          ease: [0.22, 1, 0.36, 1],
          when: 'beforeChildren',
          staggerChildren: stagger,
        },
      };
    },
    exit: ({ dir, speed }: ScrollMotionContext) => {
      const exitDuration = Math.min(0.32, Math.max(0.16, 0.25 / speed));
      return {
        opacity: 0,
        y: dir > 0 ? -16 : 16,
        scale: 0.99,
        filter: 'blur(3px)',
        transition: {
          duration: exitDuration,
          ease: [0.4, 0, 1, 1],
        },
      };
    },
  };

  const detailSectionVariants = {
    hidden: ({ dir, speed }: ScrollMotionContext) => {
      const offset = Math.round(18 * Math.min(1.25, Math.max(0.8, speed)));
      return {
        opacity: 0,
        y: dir > 0 ? offset : -Math.round(offset * 0.7),
      };
    },
    visible: ({ speed }: ScrollMotionContext) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: Math.min(0.5, Math.max(0.24, 0.42 / speed)),
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const bulletListVariants = {
    hidden: { opacity: 0 },
    visible: ({ speed }: ScrollMotionContext) => ({
      opacity: 1,
      transition: {
        staggerChildren: Math.min(0.07, Math.max(0.025, 0.055 / speed)),
        delayChildren: Math.min(0.05, Math.max(0.015, 0.035 / speed)),
      },
    }),
  };

  const bulletItemVariants = {
    hidden: ({ dir, speed }: ScrollMotionContext) => {
      const slideY = Math.round(14 * Math.min(1.3, Math.max(0.8, speed)));
      return {
        opacity: 0,
        y: dir > 0 ? slideY : -Math.round(slideY * 0.7),
        x: 6,
        scale: 0.99,
      };
    },
    visible: ({ speed }: ScrollMotionContext) => ({
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: Math.min(0.44, Math.max(0.2, 0.36 / speed)),
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const tagListVariants = {
    hidden: { opacity: 0 },
    visible: ({ speed }: ScrollMotionContext) => ({
      opacity: 1,
      transition: {
        staggerChildren: Math.min(0.04, Math.max(0.015, 0.03 / speed)),
        delayChildren: 0.03,
      },
    }),
  };

  const tagItemVariants = {
    hidden: ({ speed }: ScrollMotionContext) => ({
      opacity: 0,
      y: Math.round(10 * Math.min(1.25, Math.max(0.8, speed))),
      scale: 0.95,
    }),
    visible: ({ speed }: ScrollMotionContext) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: Math.min(0.34, Math.max(0.18, 0.28 / speed)),
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col justify-center select-none"
    >
      {/* Huge Background Watermark Typography - Full word EXPERIENCE visible across the entire screen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 px-2 sm:px-4 overflow-hidden">
        <span className="w-full text-center text-[8.8vw] sm:text-[9.4vw] md:text-[9.8vw] font-black tracking-tighter text-white/[0.08] uppercase font-heading leading-none whitespace-nowrap">
          EXPERIENCE
        </span>
      </div>

      {/* Main Split Container */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* LEFT SIDE: Half-Round Circular Wheel & Single Active Timeline Card */}
        <motion.div
          initial={{ x: -160, opacity: 0, rotate: -25 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full md:w-5/12 lg:w-[43%] h-[200px] sm:h-[220px] md:h-full pt-14 md:pt-0 flex items-center justify-center md:justify-start shrink-0"
        >
          {/* Decorative Half-Round Circle (Semi-Circle Arc) anchored on the left */}
          <div className="pointer-events-none absolute left-[-150px] sm:left-[-130px] md:left-[-190px] lg:left-[-170px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] flex items-center justify-center">
            {/* Outer Half-Round Dashed Ring that rotates slightly on scroll */}
            <motion.div
              animate={{ rotate: activeIndex * -36 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-full border border-dashed border-white/20"
            />

            {/* Main Glowing Half-Round Track */}
            <div className="absolute inset-[28px] md:inset-[38px] rounded-full border-2 border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.07)]" />

            {/* Inner Half-Round Ring */}
            <div className="absolute inset-[70px] md:inset-[95px] rounded-full border border-white/10" />

            {/* Rotating Orbital Sweep Arm on the Circle */}
            <motion.div
              key={`sweep-${activeIndex}`}
              initial={{ rotate: direction > 0 ? 65 : -65, opacity: 0.2 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[28px] md:inset-[38px] rounded-full"
            >
              {/* Glowing node sitting at the rightmost apex (0 deg) of the half-round circle */}
              <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399]" />
            </motion.div>

            {/* Step Dots along the right half of the circle */}
            <div className="hidden md:block absolute inset-[38px] rounded-full pointer-events-auto">
              {experiences.map((exp, idx) => {
                const angleDeg = getStepAngleDeg(idx);
                const isStepActive = idx === activeIndex;
                return (
                  <div
                    key={exp.id}
                    style={{
                      transform: `rotate(${angleDeg}deg)`,
                    }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <button
                      type="button"
                      onClick={() => goToIndex(idx)}
                      style={{
                        transform: `translateY(-50%) rotate(${-angleDeg}deg)`,
                      }}
                      className={`pointer-events-auto absolute right-[-14px] top-1/2 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] transition-all duration-300 cursor-pointer ${
                        isStepActive
                          ? 'bg-white text-black font-bold scale-115 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                          : 'bg-black text-neutral-400 border border-white/25 hover:border-white hover:text-white'
                      }`}
                      title={`${exp.company} — ${exp.role}`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SINGLE ACTIVE TIMELINE CARD (Enters & Exits along the Half-Round Circle) */}
          <div className="relative z-10 w-full max-w-[330px] sm:max-w-[360px] md:max-w-[350px] lg:max-w-[390px] md:ml-8 lg:ml-14">
            {/* Half-Round Animated Single Timeline Card */}
            <div className="relative min-h-[130px] sm:min-h-[145px] md:min-h-[175px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                {activeExp && (
                  <motion.div
                    key={activeExp.id}
                    custom={direction}
                    variants={halfRoundCardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformOrigin: '-160px 50%' }}
                    className="w-full p-4 sm:p-5 lg:p-6 rounded-2xl bg-black border-2 border-white text-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
                        #{String(activeIndex + 1).padStart(2, '0')} INTERNSHIP
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-black text-white border border-white/30 shrink-0">
                        {activeExp.type}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-white mb-1 leading-snug">
                      {activeExp.company}
                    </h3>

                    <p className="text-xs sm:text-sm font-semibold text-neutral-200 mb-2">
                      {activeExp.role}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-300 pt-2 border-t border-white/20">
                      <span>{activeExp.period}</span>
                      <span>•</span>
                      <span>{activeExp.location}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Dividing Center Line */}
        <div className="hidden md:block w-[1px] h-[78%] bg-white/20 self-center mx-4 lg:mx-6 shrink-0" />

        {/* RIGHT SIDE: Full Details for the Active Timeline Item (No dark overlay box or top/bottom clipping) */}
        <div
          ref={detailsScrollRef}
          className="w-full md:w-7/12 lg:w-[57%] flex-1 md:h-full overflow-y-auto pl-0 md:pl-4 lg:pl-8 pt-2 md:pt-14 pb-6 no-scrollbar"
        >
          <motion.div
            style={{ y: velocitySlideY }}
            className="min-h-full flex flex-col justify-center will-change-transform"
          >
            <AnimatePresence mode="wait" custom={motionContext}>
              {activeExp ? (
                <motion.div
                  key={activeExp.id}
                  custom={motionContext}
                  variants={detailContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-2xl py-2 will-change-transform"
                >
                  {/* Header role & company info */}
                  <motion.div
                    custom={motionContext}
                    variants={detailSectionVariants}
                    className="mb-2.5"
                  >
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      {activeExp.role}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-300 font-mono mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white">{activeExp.company}</span>
                      <span>—</span>
                      <span className="text-neutral-300">{activeExp.period}</span>
                      <span>•</span>
                      <span className="text-neutral-400">{activeExp.location}</span>
                    </p>
                  </motion.div>

                  {/* Full Description Summary */}
                  <motion.p
                    custom={motionContext}
                    variants={detailSectionVariants}
                    className="text-xs sm:text-sm text-neutral-100 leading-relaxed font-sans mb-3"
                  >
                    {activeExp.description}
                  </motion.p>

                  {/* All Bullet Highlights */}
                  <motion.div
                    custom={motionContext}
                    variants={bulletListVariants}
                    className="space-y-1.5 mb-3"
                  >
                    {activeExp.points.map((point: string, idx: number) => (
                      <motion.div
                        key={idx}
                        custom={motionContext}
                        variants={bulletItemVariants}
                        whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="flex items-start space-x-2.5 p-2 rounded-xl bg-black border border-white/20 hover:border-white/40 transition-colors will-change-transform"
                      >
                        <span className="text-xs text-emerald-400 mt-0.5 shrink-0 font-mono">
                          ▶
                        </span>
                        <p className="text-xs sm:text-sm text-neutral-100 leading-relaxed font-sans">
                          {point}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Full Technologies & Architecture */}
                  <motion.div
                    custom={motionContext}
                    variants={detailSectionVariants}
                    className="pt-2.5 border-t border-white/15"
                  >
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">
                      Technologies & Architecture
                    </span>
                    <motion.div
                      custom={motionContext}
                      variants={tagListVariants}
                      className="flex flex-wrap gap-1.5"
                    >
                      {activeExp.tags.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          custom={motionContext}
                          variants={tagItemVariants}
                          className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-black border border-white/25 text-white hover:border-white/50 transition-colors will-change-transform"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="text-neutral-500 font-mono text-sm py-12">
                  No experience entries available. Use Page 8 Admin CMS to add experiences.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


