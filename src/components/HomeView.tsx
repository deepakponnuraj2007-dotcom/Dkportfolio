import React from 'react';
import { motion } from 'motion/react';
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

  // Reset explore label visibility when returning to home view
  React.useEffect(() => {
    if (!isSplitOpen) {
      setIsExploreHidden(false);
    }
  }, [isSplitOpen]);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#FAF7F2] transition-colors duration-700">
      {/* SPLIT SCREEN OVERLAY (Page 7: When Yin-Yang is clicked) */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          isSplitOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Halves (Left: Pitch Black, Right: Warm Eggshell) */}
        <div className="absolute inset-0 flex flex-col md:flex-row pointer-events-none z-0">
          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black transition-colors duration-700" />
          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#FAF7F2] transition-colors duration-700" />
        </div>

        {/* Central Card Dividing Border Frame (Behind the Person / Under the Line) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] lg:w-[860px] h-[460px] border-2 border-black/80 rounded-2xl pointer-events-none z-10 shadow-xl overflow-hidden">
          {/* Dividing central indicator cross */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-light text-white/90">
            +
          </div>
        </div>

        {/* Interactive Content Layer (Positioned Above the Border Line - z-20) */}
        <div className="relative z-20 w-full h-full flex flex-col md:flex-row">
          {/* Left Side: Pitch Black Content */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full text-white relative flex items-center justify-end px-6 md:px-12 py-12">
            <div className="max-w-md lg:max-w-lg w-full z-10 md:pr-6 flex flex-col justify-center">
              {/* Status / Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-300 mb-5 backdrop-blur-xs w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{personalInfo.degree || 'Computer Science'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white font-display leading-[1.08] mb-4">
                Hi, I&apos;m <span className="text-white relative inline-block">{personalInfo.name}</span>
              </h1>

              {/* Short Bio */}
              <p className="text-neutral-300 text-sm md:text-[15px] lg:text-base leading-[1.75] font-sans font-normal mb-6 tracking-normal text-neutral-300/90 text-pretty">
                {personalInfo.bioShort}
              </p>

              {/* Career Objective Card */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xs flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                    Career Objective
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide font-display mt-0.5 truncate">
                    {personalInfo.careerGoal}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Warm Eggshell White with Portrait Illustration (In front of the border line!) */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-start px-6 md:px-12 py-12">
            <div className="max-w-md lg:max-w-xl w-full z-30 md:pl-6 flex flex-col items-center justify-center">
              <AvatarIllustration
                className="w-56 h-72 sm:w-64 sm:h-84 md:w-80 md:h-[420px] lg:w-[360px] lg:h-[470px]"
                onClick={onOpenAdmin}
                interactive={true}
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom-Right Yin-Yang in Split Mode */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-40">
          <div className="flex flex-col items-center group cursor-pointer" onClick={onToggleSplit}>
            <YinYang size={64} onClick={onToggleSplit} border />
            <span className="text-[10px] font-mono tracking-[0.22em] text-neutral-500 mt-2 uppercase transition-colors duration-200 group-hover:text-black">
              Return
            </span>
          </div>
        </div>
      </div>

      {/* DEFAULT HOME STATE (Page 1): Centered Rotating Yin-Yang */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
          !isSplitOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
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
              setTimeout(() => setIsDragging(false), 60);
              // Dragging more than 50px activates exploration
              if (Math.hypot(info.offset.x, info.offset.y) > 50) {
                onToggleSplit();
              }
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (!isDragging) {
                onToggleSplit();
              }
            }}
            className="cursor-grab active:cursor-grabbing touch-none select-none"
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
      </div>
    </div>
  );
};
