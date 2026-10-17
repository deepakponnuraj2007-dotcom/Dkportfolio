import React, { useRef, useState, useEffect } from 'react';

interface PaperScrollCardProps {
  children: React.ReactNode;
  className?: string;
  isHovered?: boolean;
}

/**
 * Custom Paper Scroll Card container reproducing user reference image (d73c9998-e9a5-42ef-8522-086936e179a9.png).
 * Features:
 * - 100% exact silhouette with flat horizontal top & bottom edges
 * - Protruding cylindrical rolls (top-left pill and bottom-right pill)
 * - Rounded top-right and bottom-left paper corners
 * - Precision inner scroll curls at top-right and bottom-left
 * - Fully closed, seamless contour with zero line gaps or bleeding
 * - Yin-Yang contrast inversion (white paper -> black paper) on hover & drag
 */
export const PaperScrollCard: React.FC<PaperScrollCardProps> = ({
  children,
  className = '',
  isHovered = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 340, height: 440 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setSize({ width: offsetWidth, height: offsetHeight });
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const W = Math.max(size.width, 280);
  const H = Math.max(size.height, 360);

  // Exact geometric coordinates matching reference icon
  const X_left = 26; // Left vertical paper edge
  const X_right = W - 26; // Right vertical paper edge

  // Roll dimensions - optimized for maximum content space
  const H_roll = 28;
  const R_pill = 14;
  const P_protrude = 16; // How much the pills stick out past paper body
  const X_pillLeft = X_left - P_protrude; // 10
  const X_pillRight = X_right + P_protrude; // W - 10

  // Top edge & roll horizontal lines
  const Y_top = 10; // Flat top edge
  const Y_topRollBot = Y_top + H_roll; // 38

  // Bottom edge & roll horizontal lines (symmetric)
  const Y_bot = H - 10; // Flat bottom edge
  const Y_botRollTop = Y_bot - H_roll; // H - 38

  // Rounded corner radius for paper sheet (top-right and bottom-left)
  const R_corner = 26;

  // Inner curl position
  const curlWidth = 36;
  const X_curlTop = X_right - curlWidth;
  const X_curlBot = X_left + curlWidth;

  const strokeW = 6.5;

  // Colors: Normal (warm white paper, black lines) vs Hovered / Dragged (rich black paper, white lines)
  const paperFill = isHovered ? '#0D0D11' : '#FAF7F2';
  const strokeColor = isHovered ? '#FFFFFF' : '#000000';

  // 100% closed outer perimeter matching d73c9998-e9a5-42ef-8522-086936e179a9.png
  const outerPerimeter = `
    M ${X_pillLeft} ${Y_topRollBot}
    A ${R_pill} ${R_pill} 0 0 1 ${X_pillLeft} ${Y_top}
    L ${X_right - R_corner} ${Y_top}
    A ${R_corner} ${R_corner} 0 0 1 ${X_right} ${Y_top + R_corner}
    L ${X_right} ${Y_botRollTop}
    L ${X_pillRight} ${Y_botRollTop}
    A ${R_pill} ${R_pill} 0 0 1 ${X_pillRight} ${Y_bot}
    L ${X_left + R_corner} ${Y_bot}
    A ${R_corner} ${R_corner} 0 0 1 ${X_left} ${Y_bot - R_corner}
    L ${X_left} ${Y_topRollBot}
    Z
  `;

  return (
    <div
      ref={containerRef}
      className={`relative select-none transition-all duration-300 ${
        isHovered ? '-translate-y-2' : ''
      } ${className}`}
      style={{
        filter: isHovered
          ? 'drop-shadow(0 20px 36px rgba(255, 255, 255, 0.16)) drop-shadow(0 10px 24px rgba(0, 0, 0, 0.8))'
          : 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.55))',
      }}
    >
      {/* SVG Scroll Frame Silhouette */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible transition-colors duration-300"
      >
        {/* Fill Background - Exactly matches outer perimeter */}
        <path
          d={outerPerimeter}
          fill={paperFill}
          className="transition-colors duration-300"
        />

        {/* Crisp Bold Outlines matching reference icon */}
        <g
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        >
          {/* Main Continuous Perimeter Outline */}
          <path d={outerPerimeter} />

          {/* Top Roll Cylinder: Bottom Line & Signature Inner Scroll Curl */}
          <path
            d={`
              M ${X_left} ${Y_topRollBot}
              L ${X_curlTop} ${Y_topRollBot}
              C ${X_curlTop - 18} ${Y_topRollBot}, ${X_curlTop - 18} ${Y_top}, ${X_curlTop} ${Y_top}
            `}
          />

          {/* Bottom Roll Cylinder: Top Line & Signature Inner Scroll Curl */}
          <path
            d={`
              M ${X_right} ${Y_botRollTop}
              L ${X_curlBot} ${Y_botRollTop}
              C ${X_curlBot + 18} ${Y_botRollTop}, ${X_curlBot + 18} ${Y_bot}, ${X_curlBot} ${Y_bot}
            `}
          />
        </g>
      </svg>

      {/* Project Content Nested Safely Inside the Parchment Sheet - Free from all border lines */}
      <div
        className={`relative z-10 w-full h-full flex flex-col justify-between pt-16 pb-16 px-12 sm:px-13 transition-colors duration-300 ${
          isHovered ? 'text-white' : 'text-black'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
