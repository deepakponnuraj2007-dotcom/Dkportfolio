import React, { useRef, useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { YinYang } from './YinYang';

interface WorkViewProps {
  onBack?: () => void;
}

export const WorkView: React.FC<WorkViewProps> = () => {
  const { projects } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Enable mouse wheel horizontal scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const scrollByAmount = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none pt-16 md:pt-20 pb-8 md:pb-12">
      {/* Huge Background Watermark Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[18vw] md:text-[22vw] font-black tracking-tighter text-white/[0.04] uppercase font-heading leading-none">
          WORK
        </span>
      </div>

      {/* Navigation Arrows for desktop */}
      <div className="absolute left-4 sm:left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <button
          onClick={() => scrollByAmount(-400)}
          className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-200 border border-white/20 active:scale-95 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 sm:right-6 md:right-16 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <button
          onClick={() => scrollByAmount(400)}
          className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-200 border border-white/20 active:scale-95 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`w-full overflow-x-auto no-scrollbar flex items-center gap-6 sm:gap-8 md:gap-12 px-8 sm:px-12 md:px-28 py-4 z-10 cursor-${
          isDragging ? 'grabbing' : 'grab'
        }`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {projects.map((project: ProjectItem) => {
          const isHovered = hoveredCardId === project.id;
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredCardId(project.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`shrink-0 w-[280px] sm:w-[310px] md:w-[340px] h-[400px] sm:h-[430px] md:h-[450px] p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-500 rounded-tl-[40px] rounded-br-[40px] rounded-tr-[12px] rounded-bl-[12px] shadow-2xl relative group ${
                isHovered
                  ? 'bg-[#111111] text-white border-2 border-white/60 scale-[1.02] shadow-white/10'
                  : 'bg-white text-black border-2 border-transparent'
              }`}
            >
              {/* Top Accent Icon & Tags */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono tracking-widest uppercase ${
                      isHovered ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    Featured Project
                  </span>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isHovered ? 'bg-emerald-400 animate-pulse' : 'bg-black'
                    }`}
                  />
                </div>

                {/* Project Title */}
                <h3
                  className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-4 line-clamp-2 leading-tight ${
                    isHovered ? 'text-white' : 'text-black'
                  }`}
                >
                  {project.title}
                </h3>

                {/* Project Description */}
                <p
                  className={`text-xs md:text-sm leading-relaxed mb-6 font-normal line-clamp-4 ${
                    isHovered ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  {project.description}
                </p>
              </div>

              {/* Tags and Action Buttons */}
              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                        isHovered
                          ? 'bg-white/10 text-neutral-300 border border-white/15'
                          : 'bg-black/5 text-neutral-800 border border-black/10'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                  <a
                    href={project.liveUrl || project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-md ${
                      isHovered
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'bg-black text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isHovered
                        ? 'text-white hover:bg-white/10'
                        : 'text-black hover:bg-black/5'
                    }`}
                    title="View Source Code"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Swipe Indicator */}
      <div className="absolute bottom-6 md:bottom-8 right-8 md:right-16 z-20 flex items-center gap-3 select-none">
        <span className="text-xl md:text-2xl font-bold font-sans tracking-wide text-white/90">
          Swipe
        </span>
        <YinYang size={32} isSpinning={true} />
      </div>
    </div>
  );
};
