import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Github, Instagram, Facebook, Anchor } from 'lucide-react';
import { SectionId } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectDocumentIcon } from './ProjectDocumentIcon';

interface SideNavigationProps {
  currentSection: SectionId;
  onNavigate: (section: SectionId) => void;
  theme?: 'light' | 'dark';
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  currentSection,
  onNavigate,
  theme = 'light',
}) => {
  const { personalInfo } = usePortfolio();
  const isDark =
    theme === 'dark' ||
    currentSection === 'experience' ||
    currentSection === 'about' ||
    currentSection === 'projects' ||
    currentSection === 'admin';

  // Do not render side rails in admin view
  if (currentSection === 'admin') return null;

  return (
    <>
      {/* LEFT SIDE NAVIGATION */}
      <aside className="fixed left-0 top-0 bottom-0 z-30 flex flex-col justify-between items-center pt-20 pb-6 md:pb-8 px-2.5 md:px-5 pointer-events-none select-none">
        {/* Top Indicator / Spacer */}
        {currentSection === 'projects' ? (
          <div className="flex flex-col items-center -mt-10 animate-bounce duration-1000">
            <div className={`w-[1.5px] h-12 ${isDark ? 'bg-white' : 'bg-black'}`} />
            <div className="p-1 rounded-full border border-black dark:border-white">
              <ProjectDocumentIcon size={20} spinGear={true} />
            </div>
          </div>
        ) : (
          <div className="h-10" />
        )}

        {/* Vertical Section Link: Projects - Slide in from left */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col items-center"
        >
          <button
            id="side-projects-btn"
            onClick={() => onNavigate('projects')}
            className={`transform -rotate-90 origin-center text-xs md:text-sm font-semibold tracking-[0.16em] uppercase font-display transition-all duration-300 hover:scale-105 active:scale-95 py-2 px-1 focus:outline-hidden ${
              currentSection === 'projects'
                ? isDark
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-black border-b-2 border-black font-bold'
                : isDark
                ? 'text-white/80 hover:text-white'
                : 'text-black/80 hover:text-black'
            }`}
          >
            Projects
          </button>
        </motion.div>

        {/* Bottom Social Icons Rail - Slide in from bottom-left */}
        <motion.div
          initial={{ x: -60, y: 30, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col items-center space-y-2.5 mb-1 md:mb-2"
        >
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1 transition-transform duration-200 hover:scale-125 ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1 transition-transform duration-200 hover:scale-125 ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
          >
            <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
          <a
            href={personalInfo.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1 transition-transform duration-200 hover:scale-125 ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1 transition-transform duration-200 hover:scale-125 ${
              isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'
            }`}
          >
            <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
        </motion.div>
      </aside>

      {/* RIGHT SIDE NAVIGATION */}
      <aside className="fixed right-0 top-0 bottom-0 z-30 flex flex-col justify-between items-center py-20 px-3 md:px-6 pointer-events-none select-none">
        {/* Top Anchor - Slide in from top-right */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col items-center"
        >
          {currentSection === 'feats' ? (
            <div className="flex flex-col items-center -mt-10 animate-bounce duration-1000">
              <div className="w-[1.5px] h-12 bg-black dark:bg-white" />
              <div className="p-1 rounded-full border border-black dark:border-white">
                <Anchor className="w-5 h-5 text-black dark:text-white" />
              </div>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </motion.div>

        {/* Vertical Section Link: Feats - Slide in from right */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center"
        >
          <button
            onClick={() => onNavigate('feats')}
            className={`transform rotate-90 origin-center text-xs md:text-sm font-semibold tracking-[0.16em] uppercase font-display transition-all duration-300 hover:scale-105 active:scale-95 py-2 px-1 focus:outline-hidden ${
              currentSection === 'feats'
                ? isDark
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-black border-b-2 border-black font-bold'
                : isDark
                ? 'text-white/80 hover:text-white'
                : 'text-black/80 hover:text-black'
            }`}
          >
            Feats
          </button>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-10" />
      </aside>
    </>
  );
};
