import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Laptop, Cpu, Code2, Flame } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const SkillsView: React.FC = () => {
  const { skillCategories } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic particle constellation connecting network
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

    // Particle nodes
    const particleCount = 40;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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

  return (
    <div className="relative w-full h-screen bg-[#FAF7F2] text-black overflow-hidden select-none">
      {/* Interactive Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Huge Background Watermark Typography */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="text-[13vw] md:text-[15vw] font-black tracking-tighter text-black/[0.04] font-heading leading-none">
          Skills
        </span>
      </div>

      {/* Full-height Scroll Container so no top/bottom white bar hides the cards */}
      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar px-4 sm:px-6 md:px-16 pt-16 md:pt-20 pb-10">
        <div className="min-h-full w-full max-w-5xl mx-auto flex items-center justify-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-2">
            {skillCategories.map((category, idx) => {
              const isFullStack = idx === 0 || category.id === 'fullstack';
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl border-2 border-black transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Header with icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-black text-white rounded-lg">
                        {isFullStack ? (
                          <Laptop className="w-5 h-5" />
                        ) : idx === 1 ? (
                          <Cpu className="w-5 h-5" />
                        ) : (
                          <Code2 className="w-5 h-5" />
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">
                        {category.title}
                      </h3>
                    </div>

                    {/* Subtitle / Tagline */}
                    <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-sans mb-6">
                      {category.tagline}
                    </p>

                    {/* Coding Languages / Core Skills */}
                    <div className="mb-5">
                      <h4 className="text-xs font-mono font-bold tracking-widest text-black uppercase mb-2">
                        {category.codeInHeader}
                      </h4>
                      <p className="text-sm md:text-base font-medium text-neutral-800 leading-relaxed">
                        {category.codeInList.join(', ')}
                      </p>
                    </div>

                    {/* Tools & Frameworks */}
                    <div>
                      <h4 className="text-xs font-mono font-bold tracking-widest text-black uppercase mb-2">
                        {category.toolsHeader}
                      </h4>
                      <p className="text-xs md:text-sm font-normal text-neutral-600 leading-relaxed">
                        {category.toolsList.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Bottom decorative line */}
                  <div className="pt-5 mt-5 border-t border-black/15 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-black" /> Domain Mastery
                    </span>
                    <span>Active Track</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

