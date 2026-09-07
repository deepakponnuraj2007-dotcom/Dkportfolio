import React from 'react';
import { motion } from 'motion/react';
import { SectionId } from '../types';

interface BottomNavigationProps {
  currentSection: SectionId;
  onNavigate: (section: SectionId) => void;
  theme?: 'light' | 'dark';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentSection,
  onNavigate,
  theme = 'light',
}) => {
  if (currentSection === 'admin') return null;

  const isDark =
    theme === 'dark' ||
    currentSection === 'experience' ||
    currentSection === 'about' ||
    currentSection === 'projects';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-center items-center py-6 md:py-8 px-6 pointer-events-none select-none">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center justify-around w-full max-w-xl px-4"
      >
        {/* About Link (Page 4) */}
        <button
          onClick={() => onNavigate('about')}
          className={`text-xs md:text-sm font-semibold tracking-[0.16em] uppercase font-display transition-all duration-300 hover:scale-105 active:scale-95 px-4 py-2 ${
            currentSection === 'about'
              ? isDark
                ? 'text-white border-b-2 border-white font-bold'
                : 'text-black border-b-2 border-black font-bold'
              : isDark
              ? 'text-white/80 hover:text-white'
              : 'text-black/80 hover:text-black'
          }`}
        >
          About
        </button>

        {/* My Skills Link (Page 5) */}
        <button
          onClick={() => onNavigate('skills')}
          className={`text-xs md:text-sm font-semibold tracking-[0.16em] uppercase font-display transition-all duration-300 hover:scale-105 active:scale-95 px-4 py-2 ${
            currentSection === 'skills'
              ? isDark
                ? 'text-white border-b-2 border-white font-bold'
                : 'text-black border-b-2 border-black font-bold'
              : isDark
              ? 'text-white/80 hover:text-white'
              : 'text-black/80 hover:text-black'
          }`}
        >
          My Skills
        </button>
      </motion.div>
    </nav>
  );
};
