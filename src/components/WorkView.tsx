import React, { useRef, useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { YinYang } from './YinYang';
import { ProjectDocumentIcon } from './ProjectDocumentIcon';

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
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Huge Background Watermark Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[18vw] md:text-[22vw] font-black tracking-tighter text-white/[0.05] uppercase font-heading leading-none">
          WORK
        </span>
      </div>

      {/* Navigation Arrows for desktop */}
      <div className="absolute left-4 sm:left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <button
          onClick={() => scrollByAmount(-400)}
          className="p-3 rounded-full bg-black hover:bg-white text-white hover:text-black transition-all duration-200 border border-white/30 active:scale-95 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 sm:right-6 md:right-16 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <button
          onClick={() => scrollByAmount(400)}
          className="p-3 rounded-full bg-black hover:bg-white text-white hover:text-black transition-all duration-200 border border-white/30 active:scale-95 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Horizontal Scrolling Card Track - Full height so cards are never clipped at top or bottom */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar flex items-center gap-6 sm:gap-8 md:gap-10 px-6 sm:px-12 md:px-24 pt-14 pb-12 z-10 cursor-${
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
              className={`shrink-0 w-[270px] sm:w-[300px] md:w-[330px] h-[min(410px,calc(100vh-108px))] min-h-[260px] p-4 sm:p-5 md:p-6 flex flex-col justify-between transition-colors duration-300 rounded-2xl relative group ${
                isHovered
                  ? 'bg-[#111113] text-white border-2 border-white'
                  : 'bg-white text-black border-2 border-white'
              }`}
            >
              {/* Top Accent Icon & Tags */}
              <div className="min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-2 sm:mb-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-mono tracking-widest uppercase ${
                        isHovered ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      Featured Project
                    </span>
                  </div>
                  <ProjectDocumentIcon
                    size={36}
                    documentColor={isHovered ? '#94a3b8' : '#334155'}
                    gearColor={isHovered ? '#38bdf8' : '#0284c7'}
                    documentFill={isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'}
                    gearFill={isHovered ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.1)'}
                    spinGear={isHovered}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
                  />
                </div>

                {/* Project Title */}
                <h3
                  className={`text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight mb-2 line-clamp-2 leading-tight shrink-0 ${
                    isHovered ? 'text-white' : 'text-black'
                  }`}
                >
                  {project.title}
                </h3>

                {/* Project Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-3 font-normal line-clamp-3 sm:line-clamp-4 ${
                    isHovered ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  {project.description}
                </p>
              </div>

              {/* Tags and Action Buttons */}
              <div className="shrink-0">
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4 max-h-[52px] overflow-hidden">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md ${
                        isHovered
                          ? 'bg-black text-neutral-200 border border-white/25'
                          : 'bg-neutral-100 text-neutral-800 border border-black/15'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Buttons */}
                <div
                  className={`flex items-center justify-between pt-2.5 sm:pt-3 border-t ${
                    isHovered ? 'border-white/20' : 'border-black/15'
                  }`}
                >
                  <a
                    href={project.liveUrl || project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 ${
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
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                      isHovered
                        ? 'text-white hover:bg-white/10'
                        : 'text-black hover:bg-black/10'
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
      <div className="absolute bottom-2.5 sm:bottom-5 right-6 md:right-14 z-20 flex items-center gap-2.5 select-none pointer-events-none">
        <span className="text-base sm:text-xl font-bold font-sans tracking-wide text-white/90">
          Swipe
        </span>
        <YinYang size={28} isSpinning={true} />
      </div>
    </div>
  );
};
