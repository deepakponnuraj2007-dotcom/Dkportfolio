import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YinYang } from './YinYang';
import { AvatarIllustration } from './AvatarIllustration';
import { usePortfolio } from '../context/PortfolioContext';

interface HomeViewProps {
  isSplitOpen: boolean;
  onToggleSplit: () => void;
  onOpenAdmin: () => void;
  isFullscreen?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  isSplitOpen,
  onToggleSplit,
  onOpenAdmin,
  isFullscreen = false,
}) => {
  const { personalInfo } = usePortfolio();
  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const lastTriggerTime = React.useRef(0);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoTouchOrClick = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastTriggerTime.current < 350) return;
    lastTriggerTime.current = now;
    onToggleSplit();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#FAF7F2]">
      <AnimatePresence mode="wait">
        {/* ========================================================
            SPLIT SCREEN OVERLAY (When Center Yin-Yang is Touched)
            Splits outward from the center seam:
            - Left: Black screen with white details
            - Right: White screen with black details & portrait
           ======================================================== */}
        {isSplitOpen ? (
          <motion.div
            key="split-overlay"
            className="absolute inset-0 z-30 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.3 } }}
          >
            {/* Background Halves Splitting from Center Seam */}
            <div className="absolute inset-0 flex flex-col md:flex-row pointer-events-none z-0 overflow-hidden">
              {/* Left / Top Half: Pitch Black Panel (Splits from center line to left / top) */}
              <motion.div
                initial={
                  isDesktop
                    ? { scaleX: 0 }
                    : { scaleY: 0 }
                }
                animate={
                  isDesktop
                    ? { scaleX: 1 }
                    : { scaleY: 1 }
                }
                exit={
                  isDesktop
                    ? { scaleX: 0 }
                    : { scaleY: 0 }
                }
                style={{
                  transformOrigin: isDesktop ? 'right center' : 'center bottom',
                }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full md:w-1/2 h-1/2 md:h-full bg-black shadow-2xl relative"
              />

              {/* Right / Bottom Half: Warm Eggshell White Panel (Splits from center line to right / bottom) */}
              <motion.div
                initial={
                  isDesktop
                    ? { scaleX: 0 }
                    : { scaleY: 0 }
                }
                animate={
                  isDesktop
                    ? { scaleX: 1 }
                    : { scaleY: 1 }
                }
                exit={
                  isDesktop
                    ? { scaleX: 0 }
                    : { scaleY: 0 }
                }
                style={{
                  transformOrigin: isDesktop ? 'left center' : 'center top',
                }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full md:w-1/2 h-1/2 md:h-full bg-[#FAF7F2] shadow-2xl relative"
              />
            </div>

            {/* Center Razor Seam Line Flash during Split */}
            <motion.div
              initial={
                isDesktop
                  ? { scaleY: 0, opacity: 1 }
                  : { scaleX: 0, opacity: 1 }
              }
              animate={
                isDesktop
                  ? { scaleY: 1, opacity: [1, 0.9, 0] }
                  : { scaleX: 1, opacity: [1, 0.9, 0] }
              }
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className={`absolute pointer-events-none z-10 ${
                isDesktop
                  ? 'top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent'
                  : 'left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent'
              }`}
            />

            {/* Central Card Dividing Border Frame (Dual Tone: White line on Black Side, Black line on White Side) - Extended to Enclose Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1120px,calc(100vw-48px))] lg:w-[min(1260px,calc(100vw-64px))] xl:w-[min(1380px,calc(100vw-80px))] h-[min(620px,calc(100vh-76px))] lg:h-[min(670px,calc(100vh-84px))] rounded-3xl pointer-events-none z-10"
            >
              {/* Left Half (Black Side) - Crisp White Line */}
              <div
                className="absolute inset-0 rounded-3xl border-2 border-white/85 pointer-events-none"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />

              {/* Right Half (White Side) - Crisp Black Line */}
              <div
                className="absolute inset-0 rounded-3xl border-2 border-black/80 pointer-events-none"
                style={{ clipPath: 'inset(0 0 0 50%)' }}
              />

              {/* Dividing central indicator cross */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-light text-white/90 -mr-[1px] select-none">+</span>
              </div>
            </motion.div>

            {/* Interactive Content Layer (Positioned Above the Border Line - z-20) */}
            <div className="relative z-20 w-full h-full flex flex-col md:flex-row overflow-y-auto md:overflow-hidden no-scrollbar">
              {/* Left Side: Pitch Black Content (White details on Black Screen - Safely Inside the Frame Line) */}
              <motion.div
                initial={
                  isDesktop
                    ? { opacity: 0, x: 70 }
                    : { opacity: 0, y: 50 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  isDesktop
                    ? { opacity: 0, x: 50 }
                    : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.7,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full md:w-1/2 min-h-[50%] md:h-full text-white relative flex items-center justify-end px-6 sm:px-8 md:px-10 lg:px-14 py-8 md:py-10"
              >
                <div className="w-full max-w-[460px] lg:max-w-[500px] z-10 md:pr-6 lg:pr-8 flex flex-col justify-center">
                  {/* Status / Category Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/25 bg-black text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-200 mb-3 sm:mb-4 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{personalInfo.degree || 'Computer Science'}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white font-display leading-[1.08] mb-3">
                    Hi, I&apos;m <span className="text-white relative inline-block">{personalInfo.name}</span>
                  </h1>

                  {/* Short Bio */}
                  <p className="text-neutral-200 text-xs sm:text-sm md:text-[15px] lg:text-base leading-[1.65] font-sans font-normal mb-4 sm:mb-5 tracking-normal text-pretty">
                    {personalInfo.bioShort}
                  </p>

                  {/* Career Objective Card */}
                  <div className="p-3 sm:p-4 rounded-xl border border-white/20 bg-black flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                        Career Objective
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide font-display mt-0.5 truncate">
                        {personalInfo.careerGoal}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black border border-emerald-500/40 text-emerald-400 text-[11px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Warm Eggshell White with Portrait Illustration (Black details on White Screen - Slides in from Center Seam) */}
              <motion.div
                initial={
                  isDesktop
                    ? { opacity: 0, x: -70 }
                    : { opacity: 0, y: -50 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  isDesktop
                    ? { opacity: 0, x: -50 }
                    : { opacity: 0, y: -30 }
                }
                transition={{
                  duration: 0.7,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full md:w-1/2 min-h-[50%] md:h-full relative flex items-center justify-start px-6 sm:px-8 md:px-10 lg:px-14 py-6 md:py-10"
              >
                <div className="w-full max-w-[460px] lg:max-w-[500px] z-30 md:pl-6 lg:pl-8 flex flex-col items-center justify-center">
                  <AvatarIllustration
                    className="w-48 h-60 sm:w-60 sm:h-76 md:w-76 md:h-[min(420px,calc(100vh-140px))] lg:w-[350px] lg:h-[min(480px,calc(100vh-140px))]"
                    onClick={onOpenAdmin}
                    interactive={true}
                  />
                </div>
              </motion.div>
            </div>


            {/* Floating Bottom-Right Yin-Yang to Return */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -70 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 70 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-40"
            >
              <div
                className="flex flex-col items-center group cursor-pointer"
                onClick={onToggleSplit}
              >
                <YinYang size={64} onClick={onToggleSplit} border />
                <span className="text-[10px] font-mono tracking-[0.22em] text-neutral-500 mt-2 uppercase transition-colors duration-200 group-hover:text-black">
                  Return (ESC)
                </span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ========================================================
              DEFAULT HOME STATE (Page 1): Centered Rotating Yin-Yang
             ======================================================== */
          <motion.div
            key="home-center-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.15,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center group select-none"
            >
              {/* Draggable & Clickable Center Yin-Yang Logo (Fullscreen Mode Trigger) */}
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.45}
                dragTransition={{ bounceStiffness: 450, bounceDamping: 25 }}
                draggable={false}
                onDragStart={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragEnd={(_e, info) => {
                  setTimeout(() => setIsDragging(false), 80);
                  if (Math.hypot(info.offset.x, info.offset.y) > 35) {
                    handleLogoTouchOrClick();
                  }
                }}
                onTap={(e) => {
                  if (!isDragging) {
                    handleLogoTouchOrClick(e as any);
                  }
                }}
                onClick={(e) => {
                  if (!isDragging) {
                    handleLogoTouchOrClick(e);
                  }
                }}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.05 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLogoTouchOrClick(e);
                  }
                }}
                className="cursor-grab active:cursor-grabbing touch-none select-none p-3 rounded-full focus:outline-hidden"
              >
                <YinYang
                  size={140}
                  className="transform transition-transform duration-300 pointer-events-none"
                />
              </motion.div>

              {/* Shadow & "click here" text beneath the logo */}
              <div className="mt-3 flex flex-col items-center pointer-events-none select-none">
                {/* Soft radial oval shadow beneath logo */}
                <div
                  className={`w-28 h-3 rounded-[100%] bg-black/10 blur-[3px] transition-all duration-300 ${
                    isDragging ? 'scale-75 opacity-25 blur-[5px]' : 'scale-100 opacity-100'
                  }`}
                />

                {/* Shadow-style "click here" text */}
                <span
                  className={`mt-2.5 text-[11px] font-mono tracking-[0.28em] uppercase text-black/35 font-medium transition-all duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
                    isDragging ? 'opacity-20 scale-90 -translate-y-1' : 'opacity-100 scale-100 translate-y-0 group-hover:text-black/60'
                  }`}
                >
                  click here
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
