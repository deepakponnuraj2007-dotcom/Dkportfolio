import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Terminal, Cpu } from 'lucide-react';

interface AdminSplitScreenRevealProps {
  /** Callback fired after both panels have finished sliding out */
  onAnimationComplete?: () => void;
  /** Force the animation to replay even if already played */
  forceReplay?: boolean;
}

// Fullscreen helper
const triggerFullscreenMode = () => {
  try {
    const doc = document as any;
    const docEl = document.documentElement as any;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => {});
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen().catch(() => {});
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen().catch(() => {});
      }
    }
  } catch {}
};

export const AdminSplitScreenReveal: React.FC<AdminSplitScreenRevealProps> = ({
  onAnimationComplete,
  forceReplay = false,
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Trigger fullscreen on entrance as requested by user
  useEffect(() => {
    triggerFullscreenMode();
  }, []);

  const triggerReveal = () => {
    if (isRevealing) return;
    triggerFullscreenMode();
    setIsRevealing(true);
  };

  useEffect(() => {
    setIsFinished(false);
    setIsRevealing(false);

    // Automatically trigger shutter curtain slide-out after 750ms,
    // or user can touch the center logo to reveal immediately
    const startTimer = setTimeout(() => {
      triggerReveal();
    }, 750);

    return () => clearTimeout(startTimer);
  }, [forceReplay]);

  const handleRevealEnd = () => {
    setIsFinished(true);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // If already finished, completely unmount from DOM for 100% interactivity
  if (isFinished) {
    return null;
  }

  // Cinematic timing configuration:
  // 1-second (1000ms) smooth ease-in-out slide out from center
  // 100ms stagger between left and right panel
  const transitionEase = [0.76, 0, 0.24, 1]; // Premium cubic-bezier ease-in-out
  const duration = 1.0;

  return (
    <AnimatePresence>
      {!isFinished && (
        <div
          className="fixed inset-0 z-[999] pointer-events-none select-none overflow-hidden w-screen h-screen flex"
          aria-hidden="true"
        >
          {/* ========================================================
              LEFT PANEL: Black Background with White Text / Content
              Initial: Center (0%) -> Slides Left (-100%)
              Stagger: Starts at delay 0.15s
             ======================================================== */}
          <motion.div
            initial={{ x: '0%' }}
            animate={isRevealing ? { x: '-100%' } : { x: '0%' }}
            transition={{
              duration: duration,
              delay: 0.15, // Starts 100ms before right panel
              ease: transitionEase,
            }}
            className="w-1/2 h-full bg-black text-white relative flex flex-col justify-between p-8 sm:p-12 md:p-16 border-r border-neutral-800 shadow-2xl pointer-events-auto"
          >
            {/* Subtle background tech grid */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #222 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Left Header / Tech Tag */}
            <motion.div
              animate={isRevealing ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex items-center gap-2.5 text-xs font-mono tracking-widest text-neutral-400 uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>[ AUTH_LEVEL: ROOT_ADMIN ]</span>
            </motion.div>

            {/* Left Center Content: Big Bold Typography */}
            <motion.div
              animate={
                isRevealing
                  ? { opacity: 0.2, x: -80, scale: 0.96 }
                  : { opacity: 1, x: 0, scale: 1 }
              }
              transition={{ duration: 0.7, ease: transitionEase }}
              className="relative z-10 my-auto text-right pr-4 sm:pr-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>SYSTEM GATEWAY // V2.4</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-none">
                ADMIN
              </h1>
              <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-400 tracking-wider">
                DEEPAK VARMA • SECURE ARCHITECTURE
              </p>
            </motion.div>

            {/* Left Footer: Telemetry & Specs */}
            <motion.div
              animate={isRevealing ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-neutral-500 border-t border-neutral-900 pt-4"
            >
              <span>ACCESS: GRANTED</span>
              <span>PORT: 3000 // TLS 1.3</span>
            </motion.div>
          </motion.div>

          {/* ========================================================
              RIGHT PANEL: White Background with Black Text / Content
              Initial: Center (0%) -> Slides Right (100%)
              Stagger: Starts at delay 0.25s (100ms after Left panel)
             ======================================================== */}
          <motion.div
            initial={{ x: '0%' }}
            animate={isRevealing ? { x: '100%' } : { x: '0%' }}
            transition={{
              duration: duration,
              delay: 0.25, // 100ms stagger after left panel!
              ease: transitionEase,
            }}
            onAnimationComplete={handleRevealEnd}
            className="w-1/2 h-full bg-white text-black relative flex flex-col justify-between p-8 sm:p-12 md:p-16 border-l border-neutral-200 shadow-2xl pointer-events-auto"
          >
            {/* Subtle background geometric dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#000000 1.2px, transparent 1.2px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Right Header / Tech Tag */}
            <motion.div
              animate={isRevealing ? { opacity: 0, x: 40 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex items-center justify-end gap-2.5 text-xs font-mono tracking-widest text-neutral-600 uppercase"
            >
              <span>[ CMS ENGINE // PRODUCTION ]</span>
              <Cpu className="w-3.5 h-3.5 text-black" />
            </motion.div>

            {/* Right Center Content: Big Bold Typography */}
            <motion.div
              animate={
                isRevealing
                  ? { opacity: 0.2, x: 80, scale: 0.96 }
                  : { opacity: 1, x: 0, scale: 1 }
              }
              transition={{ duration: 0.7, ease: transitionEase }}
              className="relative z-10 my-auto text-left pl-4 sm:pl-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-neutral-100 border border-neutral-300 text-[11px] font-mono text-neutral-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>FULL DATA CONTROL</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-black leading-none">
                PORTAL
              </h1>
              <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-600 tracking-wider">
                LIVE EDITING • REALTIME PERSISTENCE
              </p>
            </motion.div>

            {/* Right Footer: Telemetry & Specs */}
            <motion.div
              animate={isRevealing ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-neutral-500 border-t border-neutral-200 pt-4"
            >
              <span>STATUS: SYNCHRONIZED</span>
              <span>ENVIRONMENT: LIVE</span>
            </motion.div>
          </motion.div>

          {/* ========================================================
              CENTER EMBLEM / SEAM DIVIDER (The Shutter Center Point)
              Splits / scales away as the panels slide out.
              Can be touched to immediately open / reveal admin!
             ======================================================== */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={
              isRevealing
                ? { opacity: 0, scale: 0.75, filter: 'blur(8px)', pointerEvents: 'none' }
                : { opacity: 1, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto' }
            }
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            onClick={triggerReveal}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            {/* Glowing aura */}
            <div className="relative">
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-emerald-500/30 via-white/20 to-sky-500/30 blur-md animate-pulse group-hover:opacity-100 transition-opacity" />
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-white/50 bg-neutral-950 shadow-[0_0_35px_rgba(0,0,0,0.85)] flex items-center justify-center text-white relative overflow-hidden transition-transform duration-300 group-hover:scale-110 active:scale-95">
                {/* Dual-tone Yin-Yang style split inside badge */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-white" />
                <div className="relative z-10 flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                </div>
              </div>
            </div>

            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-white/30 text-[10px] font-mono tracking-widest text-white uppercase shadow-2xl flex items-center gap-2 transition-all group-hover:border-emerald-400 group-hover:bg-neutral-900">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>TOUCH LOGO TO OPEN ADMIN</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminSplitScreenReveal;
