import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface MinimalLoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const MinimalLoadingScreen: React.FC<MinimalLoadingScreenProps> = ({
  onComplete,
  durationMs = 2800,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Prime web fonts and assets while loading
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.catch(() => {});
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      key="minimal-loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-end items-end p-8 sm:p-12 md:p-16 select-none pointer-events-auto"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Right side down corner: "Loading" with 3-dot circle spin effect */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2.5 sm:gap-3 text-white font-sans text-sm sm:text-base md:text-lg tracking-normal font-normal"
      >
        <span className="text-white/95 select-none">Loading</span>

        {/* 3 dots spinning in a circle */}
        <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
          <motion.svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* 3 circular dots positioned at 0°, 120°, 240° spinning around center */}
            <circle cx="12" cy="4.5" r="2.1" fill="white" opacity="1" />
            <circle cx="18.5" cy="15.75" r="1.8" fill="white" opacity="0.75" />
            <circle cx="5.5" cy="15.75" r="1.5" fill="white" opacity="0.4" />
          </motion.svg>
        </div>
      </motion.div>
    </motion.div>
  );
};
