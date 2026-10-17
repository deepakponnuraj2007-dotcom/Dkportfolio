import React, { useRef, useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { YinYang } from './YinYang';
import { ProjectDocumentIcon } from './ProjectDocumentIcon';
import { PaperScrollCard } from './PaperScrollCard';

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
        className={`w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar flex items-center gap-6 sm:gap-8 md:gap-10 px-6 sm:px-12 md:px-24 pt-24 sm:pt-28 pb-12 z-10 cursor-${
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
              className="shrink-0"
            >
              <PaperScrollCard
                isHovered={isHovered}
                className="w-[335px] sm:w-[375px] md:w-[410px] h-[min(520px,calc(100vh-120px))] min-h-[450px]"
              >
                {/* Top Accent Icon & Tags */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <span
                      className={`text-[10px] sm:text-[10.5px] font-mono tracking-widest uppercase font-semibold transition-colors duration-300 ${
                        isHovered ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      Featured Project
                    </span>
                    <ProjectDocumentIcon
                      size={28}
                      documentColor={isHovered ? '#FFFFFF' : '#334155'}
                      gearColor={isHovered ? '#38BDF8' : '#0284C7'}
                      documentFill={isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.02)'}
                      gearFill={isHovered ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.12)'}
                      spinGear={isHovered}
                      className="shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
                    />
                  </div>

                  {/* Project Title */}
                  <h3
                    className={`text-xl sm:text-[22px] font-black tracking-tight mb-2 leading-tight font-display transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-black'
                    }`}
                  >
                    {project.title}
                  </h3>

                  {/* Project Description (Full content completely displayed) */}
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed mb-3.5 font-normal transition-colors duration-300 ${
                      isHovered ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Tags and Action Buttons */}
                <div className="shrink-0 pt-1">
                  {/* Tech Tags - Fully displayed */}
                  <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-3.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[9.5px] sm:text-[10.5px] font-mono px-2 py-0.5 rounded-md font-medium transition-colors duration-300 ${
                          isHovered
                            ? 'bg-[#1A1A20] text-neutral-200 border border-white/30'
                            : 'bg-neutral-100 text-neutral-800 border border-black/15'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Buttons */}
                  <div
                    className={`flex items-center justify-between pt-2.5 sm:pt-3 border-t transition-colors duration-300 ${
                      isHovered ? 'border-white/20' : 'border-black/15'
                    }`}
                  >
                    <a
                      href={project.liveUrl || project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-xs ${
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
              </PaperScrollCard>
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
