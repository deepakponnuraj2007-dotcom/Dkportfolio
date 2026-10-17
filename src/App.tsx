import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionId } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { SideNavigation } from './components/SideNavigation';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeView } from './components/HomeView';
import { WorkView } from './components/WorkView';
import { ExperienceView } from './components/ExperienceView';
import { AboutView } from './components/AboutView';
import { SkillsView } from './components/SkillsView';
import { FeatsView } from './components/FeatsView';
import { AdminCMSView } from './components/AdminCMSView';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { MinimalLoadingScreen } from './components/MinimalLoadingScreen';

function PortfolioApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<SectionId>('home');
  const [isHomeIntroOpen, setIsHomeIntroOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const wasNativeFullscreenRef = useRef(false);

  const activateFullscreen = () => {
    try {
      const doc = document as any;
      const docEl = (document.documentElement || document.body) as any;
      const isAlreadyFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isAlreadyFs) {
        const req =
          docEl.requestFullscreen ||
          docEl.webkitRequestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.msRequestFullscreen;

        if (req) {
          const res = req.call(docEl, { navigationUI: 'hide' });
          if (res && typeof res.catch === 'function') {
            res.catch(() => {
              try {
                if (document.body && (document.body as any).requestFullscreen) {
                  (document.body as any).requestFullscreen().catch(() => {});
                }
              } catch {}
            });
          }
        }
      }
    } catch {}
  };

  const deactivateFullscreen = () => {
    try {
      const doc = document as any;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (isFs) {
        const exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;

        if (exit) {
          const res = exit.call(doc);
          if (res && typeof res.catch === 'function') {
            res.catch(() => {});
          }
        }
      }
    } catch {}
  };

  const handleNavigate = (section: SectionId) => {
    if (section === 'home') {
      setIsHomeIntroOpen(false);
      deactivateFullscreen();
      setIsFullscreen(false);
    }
    setCurrentSection(section);
  };

  const handleToggleHomeIntro = () => {
    // Touching or clicking Yin-Yang triggers Fullscreen Mode ON + opens split view
    if (!isHomeIntroOpen) {
      activateFullscreen();
      setIsFullscreen(true);
      setIsHomeIntroOpen(true);
    } else {
      // Return to normal home Yin-Yang view
      deactivateFullscreen();
      setIsFullscreen(false);
      setIsHomeIntroOpen(false);
    }
  };

  const triggerFullscreenMode = () => {
    activateFullscreen();
    setIsFullscreen(true);
  };

  // Require password Deepak@2007 to enter Admin page
  const handleOpenAdmin = () => {
    triggerFullscreenMode();
    if (isAdminAuthenticated) {
      setCurrentSection('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    triggerFullscreenMode();
    setIsAdminAuthenticated(true);
    setCurrentSection('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentSection('home');
  };

  // Automatically trigger fullscreen whenever entering admin section
  useEffect(() => {
    if (currentSection === 'admin') {
      triggerFullscreenMode();
    }
  }, [currentSection]);

  // Sync state when exiting fullscreen natively (e.g. browser Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (isFs) {
        wasNativeFullscreenRef.current = true;
        setIsFullscreen(true);
      } else if (wasNativeFullscreenRef.current) {
        wasNativeFullscreenRef.current = false;
        setIsFullscreen(false);
        setIsHomeIntroOpen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation & secret admin shortcut & fullscreen escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin shortcut: Ctrl+Shift+A or Alt+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentSection((prev) => (prev === 'admin' ? 'home' : 'admin'));
        return;
      }

      // ESC button returns fullscreen and split view back to normal home Yin-Yang view
      if (e.key === 'Escape') {
        try {
          window.getSelection()?.removeAllRanges();
        } catch {}
        deactivateFullscreen();
        setIsFullscreen(false);
        setIsHomeIntroOpen(false);
        if (currentSection !== 'home') {
          setCurrentSection('home');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isHomeIntroOpen]);

  // Determine dark vs light theme based on section
  const isDarkTheme =
    currentSection === 'projects' ||
    currentSection === 'experience' ||
    currentSection === 'about' ||
    currentSection === 'admin';

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        isDarkTheme ? 'bg-black text-white' : 'bg-[#FAF7F2] text-black'
      } font-sans select-none ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : ''
      }`}
    >
      {/* Global Navbar (Always available for top-center Back Arrow & Logo) */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        isHomeIntroOpen={isHomeIntroOpen}
        onToggleHomeIntro={handleToggleHomeIntro}
        theme={isDarkTheme ? 'dark' : 'light'}
      />

      {/* Side Rails Navigation (Only shown on Page 1 / Home so each page is isolated) */}
      {currentSection === 'home' && !isHomeIntroOpen && (
        <SideNavigation
          currentSection={currentSection}
          onNavigate={handleNavigate}
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      )}

      {/* Bottom Navigation (Only shown on Page 1 / Home) */}
      {currentSection === 'home' && !isHomeIntroOpen && (
        <BottomNavigation
          currentSection={currentSection}
          onNavigate={handleNavigate}
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      )}

      {/* Main Section Views Container with Directional Page Animations */}
      <main className="w-full h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Page 1 (Landing) & Page 7 (Center Logo -> Split view with person) */}
          {currentSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <HomeView
                isSplitOpen={isHomeIntroOpen}
                onToggleSplit={handleToggleHomeIntro}
                onOpenAdmin={handleOpenAdmin}
                isFullscreen={isFullscreen}
              />
            </motion.div>
          )}

          {/* Page 2: Experience (Top Navigation Button -> Slides in from Top border) */}
          {currentSection === 'experience' && (
            <motion.div
              key="experience"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <ExperienceView />
            </motion.div>
          )}

          {/* Page 3: Projects (Left Rail Button -> Slides in from Left border) */}
          {currentSection === 'projects' && (
            <motion.div
              key="projects"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <WorkView onBack={() => handleNavigate('home')} />
            </motion.div>
          )}

          {/* Page 4: About (Bottom Navigation Button -> Slides in from Bottom border) */}
          {currentSection === 'about' && (
            <motion.div
              key="about"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <AboutView onOpenAdmin={handleOpenAdmin} />
            </motion.div>
          )}

          {/* Page 5: My Skills (Bottom Navigation Button -> Slides in from Bottom border) */}
          {currentSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <SkillsView />
            </motion.div>
          )}

          {/* Page 6: Feats (Right Rail Button -> Slides in from Right border) */}
          {currentSection === 'feats' && (
            <motion.div
              key="feats"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <FeatsView />
            </motion.div>
          )}

          {/* Page 8: Admin CMS Full Control */}
          {currentSection === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              <AdminCMSView
                onBackToPortfolio={() => {
                  setCurrentSection('home');
                  setIsHomeIntroOpen(false);
                  deactivateFullscreen();
                  setIsFullscreen(false);
                }}
                onLockAdmin={handleLockAdmin}
                onReplayBoot={() => setIsLoading(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Admin Authentication Password Gate Modal */}
      <AdminPasswordModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Minimal Black Loading Screen with Bottom-Right 3-Dot Blink Effect */}
      <AnimatePresence>
        {isLoading && (
          <MinimalLoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
