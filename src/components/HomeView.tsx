import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YinYang } from './YinYang';
import { AvatarIllustration } from './AvatarIllustration';
import { usePortfolio } from '../context/PortfolioContext';

interface HomeViewProps {
  isSplitOpen: boolean;
  onToggleSplit: () => void;
  onOpenAdmin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  isSplitOpen,
  onToggleSplit,
  onOpenAdmin,
}) => {
  const { personalInfo } = usePortfolio();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isExploreHidden, setIsExploreHidden] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset explore label visibility when returning to home view
  React.useEffect(() => {
    if (!isSplitOpen) {
      setIsExploreHidden(false);
    }
  }, [isSplitOpen]);

  const enterFullscreen = () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      if (
        !doc.fullscreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.msFullscreenElement
      ) {
        const req =
          docEl.requestFullscreen ||
          docEl.webkitRequestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.msRequestFullscreen;
        if (req) {
          req.call(docEl).catch(() => {});
        }
      }
    } catch {}
  };

  const handleLogoTouchOrClick = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    enterFullscreen();
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
                  Return
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
              {/* Draggable Yin-Yang Center Logo */}
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.45}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                onDragStart={() => {
                  setIsDragging(true);
                  setIsExploreHidden(true);
                }}
                onDrag={() => {
                  setIsExploreHidden(true);
                }}
                onDragEnd={(_e, info) => {
                  setTimeout(() => setIsDragging(false), 80);
                  if (Math.hypot(info.offset.x, info.offset.y) > 20) {
                    handleLogoTouchOrClick();
                  }
                }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onPointerDown={() => {
                  // Direct user activation for fullscreen
                  enterFullscreen();
                }}
                onClick={(e) => {
                  handleLogoTouchOrClick(e);
                }}
                className="cursor-pointer active:cursor-grabbing touch-manipulation select-none"
              >
                <YinYang
                  size={140}
                  className="transform transition-transform duration-300 pointer-events-none"
                />
              </motion.div>

              {/* Click to Explore label - Hidden immediately upon dragging */}
              <div
                className={`mt-7 flex flex-col items-center gap-1.5 pointer-events-none transition-all duration-400 ease-out ${
                  isExploreHidden || isDragging
                    ? 'opacity-0 scale-75 -translate-y-2 pointer-events-none'
                    : 'opacity-100 scale-100 translate-y-0'
                }`}
              >
                <span className="text-[11px] font-mono font-medium tracking-[0.28em] uppercase text-neutral-400 group-hover:text-black transition-colors duration-300">
                  Click to Explore
                </span>
                <div className="h-[1.5px] w-6 bg-neutral-300 group-hover:w-12 group-hover:bg-black transition-all duration-300" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
