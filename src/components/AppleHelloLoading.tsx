import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface AppleHelloLoadingProps {
  onComplete: () => void;
}

// Authentic Apple "hello" SVG path directly provided by user
const APPLE_HELLO_PATH =
  'M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31';

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

export const AppleHelloLoading: React.FC<AppleHelloLoadingProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isWritingFinished, setIsWritingFinished] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const sparkIdRef = useRef(0);

  // Soft Apple power-on chord (F# major)
  const playAppleChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const freqs = [185, 277.18, 369.99, 466.16];
      const now = ctx.currentTime;
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
      });
    } catch {
      // Audio autoplay policy handled silently
    }
  };

  useEffect(() => {
    playAppleChime();

    // Ensure all web fonts and layout engines are fully primed for landing page
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.catch(() => {});
    }

    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;

    if (glowPathRef.current) {
      glowPathRef.current.style.strokeDasharray = `${totalLength}`;
      glowPathRef.current.style.strokeDashoffset = `${totalLength}`;
    }

    // Set initial laser head at start of 'h'
    const startPoint = path.getPointAtLength(0);
    setLaserPos({ x: startPoint.x, y: startPoint.y });

    const startTime = performance.now();
    const duration = 3400; // Smooth 3.4 seconds for drawing joined 'hello' from start to end

    const activeSparks: Spark[] = [];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth custom easing
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentDist = totalLength * easeProgress;
      const offsetVal = `${totalLength - currentDist}`;
      path.style.strokeDashoffset = offsetVal;
      if (glowPathRef.current) {
        glowPathRef.current.style.strokeDashoffset = offsetVal;
      }

      const pt = path.getPointAtLength(currentDist);
      setLaserPos({ x: pt.x, y: pt.y });

      // Generate laser sparks at the writing tip
      if (progress < 1 && Math.random() > 0.4) {
        sparkIdRef.current += 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        activeSparks.push({
          id: sparkIdRef.current,
          x: pt.x + (Math.random() - 0.5) * 10,
          y: pt.y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          opacity: 1,
          size: Math.random() * 4 + 2,
        });
      }

      // Update existing sparks
      for (let i = activeSparks.length - 1; i >= 0; i--) {
        const s = activeSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.045;
        if (s.opacity <= 0) {
          activeSparks.splice(i, 1);
        }
      }
      setSparks([...activeSparks]);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Laser reached flourish end of 'o'
        setIsWritingFinished(true);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 600);
        }, 850);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleKeyDown = () => {
      setIsExiting(true);
      setTimeout(onComplete, 200);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onComplete, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 1.04 : 1,
        filter: isExiting ? 'blur(8px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleSkip}
      className="fixed inset-0 z-50 bg-[#000000] flex items-center justify-center select-none overflow-hidden cursor-pointer"
      style={{
        backgroundColor: '#000000',
      }}
    >
      {/* Subtle Apple OLED ambient radial illumination in center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_65%)]" />

      {/* Container matching user's .hello__div */}
      <div className="flex flex-col justify-center items-center mx-auto text-center w-full max-w-[720px] px-6">
        <svg
          className="w-full h-auto overflow-visible select-none pointer-events-none"
          viewBox="0 0 1230.94 414.57"
        >
          <defs>
            {/* White Laser Glow Filter */}
            <filter id="apple-laser-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial Gradient for Laser Head Flare */}
            <radialGradient id="apple-laser-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Group with exact translation (311.08, 476.02) from user code */}
          <g transform="translate(311.08, 476.02)">
            {/* 1. Subtle Preview Track */}
            <path
              d={APPLE_HELLO_PATH}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="42"
              strokeLinecap="round"
              strokeMiterlimit={10}
            />

            {/* 2. Intense White Laser Glow Stroke */}
            <path
              ref={glowPathRef}
              d={APPLE_HELLO_PATH}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="50"
              strokeLinecap="round"
              strokeMiterlimit={10}
              opacity="0.65"
              filter="url(#apple-laser-glow)"
            />

            {/* 3. Pure White Crisp Core Stroke */}
            <path
              ref={pathRef}
              d={APPLE_HELLO_PATH}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="38"
              strokeLinecap="round"
              strokeMiterlimit={10}
              style={{
                filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))',
              }}
            />

            {/* 4. Laser Micro-Sparks trailing behind */}
            {sparks.map((spark) => (
              <circle
                key={spark.id}
                cx={spark.x}
                cy={spark.y}
                r={spark.size}
                fill="#FFFFFF"
                opacity={spark.opacity}
                style={{
                  filter: 'drop-shadow(0 0 6px #FFFFFF)',
                }}
              />
            ))}

            {/* 5. WHITE LASER HEAD TRACKING FROM 'h' to 'o' */}
            {laserPos && !isWritingFinished && (
              <g transform={`translate(${laserPos.x}, ${laserPos.y})`}>
                {/* Wide laser radial flare */}
                <circle r="70" fill="url(#apple-laser-core-grad)" opacity="0.8" />

                {/* Blinding white center glare */}
                <circle
                  r="24"
                  fill="#FFFFFF"
                  style={{ filter: 'drop-shadow(0 0 16px #FFFFFF)' }}
                />

                {/* Anamorphic horizontal laser flare line */}
                <ellipse
                  rx="110"
                  ry="4.5"
                  fill="#FFFFFF"
                  opacity="0.95"
                  style={{ filter: 'drop-shadow(0 0 8px #FFFFFF)' }}
                />

                {/* Vertical laser flare streak */}
                <ellipse
                  rx="4.5"
                  ry="60"
                  fill="#FFFFFF"
                  opacity="0.8"
                  style={{ filter: 'drop-shadow(0 0 8px #FFFFFF)' }}
                />

                {/* 45-deg cross flares */}
                <ellipse
                  rx="40"
                  ry="3"
                  transform="rotate(45)"
                  fill="#FFFFFF"
                  opacity="0.7"
                />
                <ellipse
                  rx="40"
                  ry="3"
                  transform="rotate(-45)"
                  fill="#FFFFFF"
                  opacity="0.7"
                />

                {/* Super-bright pinpoint dot */}
                <circle r="10" fill="#FFFFFF" />
              </g>
            )}

            {/* 6. Finale bloom burst when 'o' finishes */}
            {isWritingFinished && (
              <g transform="translate(850, -320)">
                <motion.circle
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: 160, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  fill="#FFFFFF"
                  style={{ filter: 'blur(8px)' }}
                />
                <motion.ellipse
                  initial={{ rx: 0, ry: 0, opacity: 1 }}
                  animate={{ rx: 240, ry: 6, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  fill="#FFFFFF"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    </motion.div>
  );
};
