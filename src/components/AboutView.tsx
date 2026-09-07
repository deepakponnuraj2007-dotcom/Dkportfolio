import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import characterAvatarImage from '../assets/images/ChatGPT Image Aug 31, 2026, 10_01_17 PM.png';

interface AboutViewProps {
  onOpenAdmin?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenAdmin }) => {
  const { personalInfo } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle starry background particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const imageSrc = personalInfo.customAvatarUrl || characterAvatarImage;

  return (
    <div className="relative w-full h-screen bg-[#111113] text-white overflow-hidden flex items-center justify-center select-none px-4 sm:px-6 md:px-10 lg:px-16 pt-24 md:pt-28 pb-8 md:pb-12">
      {/* Starry particle canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Huge Background Watermark Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[18vw] md:text-[22vw] font-black tracking-tighter text-white/[0.04] uppercase font-heading leading-none">
          ABOUT
        </span>
      </div>

      {/* Main Layout: Exactly ONE rectangle for details + Full-body person standing outside it */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center justify-center gap-6 lg:gap-10 h-full max-h-[82vh]">
        {/* THE ONLY RECTANGLE ON THE PAGE: Details Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full lg:max-w-2xl xl:max-w-3xl p-6 md:p-9 bg-[#18181b]/90 backdrop-blur-md rounded-3xl border-2 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left max-h-[58vh] sm:max-h-[64vh] lg:max-h-[75vh] overflow-y-auto no-scrollbar"
        >
          {/* Header tag */}
          <div className="mb-4">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Personal Profile & Background
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              {personalInfo.name}
            </h2>
          </div>

          {/* Degree and College details */}
          <p className="text-sm md:text-base text-neutral-100 leading-relaxed font-sans font-normal mb-4">
            I&apos;m a passionate <strong className="text-white font-semibold">{personalInfo.degree}</strong> scholar at{' '}
            <span className="text-neutral-100 underline decoration-white/40">{personalInfo.college}</span> ({personalInfo.academicYear}).
          </p>

          {/* Bio Paragraphs */}
          <div className="space-y-4 mb-6">
            {personalInfo.bioLong.map((paragraph, idx) => (
              <p key={idx} className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-normal">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Career Goal pill */}
          <div className="mb-6 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <p className="text-xs md:text-sm text-neutral-300 font-sans">
              <strong className="text-white font-medium">Career Goal:</strong> {personalInfo.careerGoal}
            </p>
          </div>

          {/* Bottom Action Section */}
          <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm md:text-base font-semibold text-white tracking-wide">
              Looking to build something impactful? Let&apos;s talk.
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-xs font-mono px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-center shrink-0 shadow-md hover:scale-105"
            >
              Get In Touch
            </a>
          </div>
        </motion.div>

        {/* FULL PERSON STANDING OUTSIDE THE RECTANGLE (NO BOX, NO BORDER, LIGHT SLOW MOTION) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [-6, 6, -6],
            rotate: [-0.6, 0.6, -0.6],
          }}
          transition={{
            opacity: { duration: 0.6 },
            x: { duration: 0.6 },
            y: {
              duration: 4.8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 5.4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          whileHover={{ scale: 1.03 }}
          onClick={onOpenAdmin}
          onTap={onOpenAdmin}
          className="shrink-0 relative z-20 flex flex-col items-center justify-end cursor-pointer group select-none"
        >
          {/* Ambient soft glow aura */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent blur-2xl rounded-full pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Full standing cutout character - Head to Sneakers with NO rectangle/border */}
          <img
            src={imageSrc}
            alt={`${personalInfo.name} Full Standing Avatar`}
            draggable={false}
            className="h-36 sm:h-44 md:h-[34vh] lg:h-[48vh] max-h-[420px] w-auto object-contain select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transition-transform duration-300 pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Status badge */}
          <div className="mt-1 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-wider text-neutral-300 flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ONLINE // DEEPAK</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
