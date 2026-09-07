import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';
import { SectionId } from '../types';
import { SayHiModal } from './SayHiModal';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  currentSection: SectionId;
  onNavigate: (section: SectionId) => void;
  isHomeIntroOpen?: boolean;
  onToggleHomeIntro?: () => void;
  theme?: 'light' | 'dark';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  isHomeIntroOpen = false,
  onToggleHomeIntro,
  theme = 'light',
}) => {
  const [isSayHiOpen, setIsSayHiOpen] = useState(false);
  const { personalInfo } = usePortfolio();

  // If in admin view, Navbar has its own top header inside AdminCMSView
  if (currentSection === 'admin') {
    return null;
  }

  const isDark =
    theme === 'dark' ||
    currentSection === 'experience' ||
    currentSection === 'about' ||
    currentSection === 'projects';

  const handleBackClick = () => {
    if (isHomeIntroOpen && onToggleHomeIntro) {
      onToggleHomeIntro();
    } else {
      onNavigate('home');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-10 md:py-8 flex items-center justify-between pointer-events-none">
        {/* Top-Left Logo / Initials & Experience Button (Only on Page 1 / Home) */}
        {currentSection === 'home' && !isHomeIntroOpen ? (
          <motion.div
            initial={{ y: -60, x: -30, opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            exit={{ y: -60, x: -30, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-5 md:gap-7"
          >
            <button
              onClick={() => {
                if (isHomeIntroOpen && onToggleHomeIntro) {
                  onToggleHomeIntro();
                }
                onNavigate('home');
              }}
              className="group flex items-center gap-1.5 focus:outline-hidden"
              title="Return to Home"
            >
              {/* Bespoke stylized monogram logo */}
              {(() => {
                const styleType = personalInfo.dkFontStyle || 'unbounded';
                const initials = (personalInfo.initials || 'DK').toUpperCase();
                
                const getFontDetails = () => {
                  switch (styleType) {
                    case 'syne':
                      return {
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                      };
                    case 'cinzel':
                      return {
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                      };
                    case 'space':
                      return {
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                      };
                    case 'mono':
                      return {
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        letterSpacing: '-0.06em',
                      };
                    case 'unbounded':
                    default:
                      return {
                        fontFamily: "'Unbounded', 'Syne', sans-serif",
                        fontWeight: 900,
                        letterSpacing: '-0.05em',
                      };
                  }
                };

                return (
                  <div
                    className={`flex items-baseline select-none transition-all duration-300 transform group-hover:scale-105 ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                    style={{
                      ...getFontDetails(),
                      textShadow: isDark ? '0 0 16px rgba(255,255,255,0.25)' : 'none',
                    }}
                  >
                    <span className="text-2xl md:text-3xl font-black tracking-tight">
                      {initials}
                    </span>
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ml-1 mb-1 transition-colors duration-300 ${
                        isDark ? 'bg-white' : 'bg-black'
                      }`}
                    />
                  </div>
                );
              })()}
            </button>

            {/* Top-Left Experience Navigation Button */}
            <button
              id="nav-experience-btn"
              onClick={() => onNavigate('experience')}
              className={`text-xs md:text-sm font-semibold tracking-[0.14em] uppercase font-display transition-all duration-300 hover:scale-105 active:scale-95 py-1 px-1 focus:outline-hidden ${
                currentSection === 'experience'
                  ? isDark
                    ? 'text-white border-b-2 border-white font-bold'
                    : 'text-black border-b-2 border-black font-bold'
                  : isDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              Experience
            </button>
          </motion.div>
        ) : (
          <div className="w-16" />
        )}

        {/* Top-Center Circular Back Button - Slide down from top */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-6 md:top-8"
        >
          <button
            onClick={handleBackClick}
            className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-95 group shadow-xs ${
              isDark
                ? 'bg-black text-white border-white/40 hover:border-white hover:bg-white hover:text-black'
                : 'bg-[#FAF7F2] text-black border-black/40 hover:border-black hover:bg-black hover:text-white'
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
        </motion.div>

        {/* Top-Right 'Say hi..' Button (Only on Page 1 / Home) */}
        {currentSection === 'home' && !isHomeIntroOpen ? (
          <motion.div
            initial={{ y: -60, x: 30, opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            exit={{ y: -60, x: 30, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-4"
          >
            <button
              onClick={() => setIsSayHiOpen(true)}
              className={`text-xs md:text-sm font-semibold tracking-[0.14em] uppercase font-display transition-all duration-200 hover:opacity-75 hover:scale-105 active:scale-95 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Say hi..
            </button>
          </motion.div>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* Say Hi Modal */}
      <SayHiModal isOpen={isSayHiOpen} onClose={() => setIsSayHiOpen(false)} />
    </>
  );
};
