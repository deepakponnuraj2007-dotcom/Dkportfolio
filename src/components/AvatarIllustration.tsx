import React from 'react';
import { motion } from 'motion/react';
import defaultAvatarImage from '../assets/images/ChatGPT Image Aug 31, 2026, 10_01_17 PM.png';
import { usePortfolio } from '../context/PortfolioContext';

interface AvatarProps {
  className?: string;
  isWaving?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const AvatarIllustration: React.FC<AvatarProps> = ({
  className = '',
  isWaving = false,
  onClick,
  interactive = false,
}) => {
  const { personalInfo } = usePortfolio();
  const imageSrc = personalInfo.customAvatarUrl || defaultAvatarImage;

  return (
    <motion.div
      onClick={onClick}
      onTap={() => {
        if (onClick) onClick();
      }}
      drag={interactive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.18}
      whileHover={interactive ? { scale: 1.03, y: -3 } : undefined}
      whileDrag={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative flex flex-col items-center justify-center select-none cursor-pointer ${className}`}
    >
      {/* Pure cutout illustration: Only the person (no rectangle frame, border, or card box) */}
      <div 
        className={`relative w-full h-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] aspect-[3/4] overflow-hidden flex items-start justify-center [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] transition-all duration-300 ${
          isWaving ? 'animate-pulse-slow' : ''
        }`}
      >
        <img
          src={imageSrc}
          alt={`${personalInfo.name} Portrait`}
          draggable={false}
          className="w-full h-auto object-cover select-none pointer-events-none filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
          style={{
            transform: 'scale(1.50) translateY(1%)',
            transformOrigin: 'top center',
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Secret admin click interaction is preserved on the person illustration */}
    </motion.div>
  );
};
