import React from 'react';

interface YinYangProps {
  size?: number;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  isSpinning?: boolean;
  border?: boolean;
}

/**
 * Custom monochrome quadrant roundel emblem matching the user's provided design.
 * Features concentric precision rings with alternate white/black quadrants and smooth spin animation.
 */
export const YinYang: React.FC<YinYangProps> = ({
  size = 120,
  className = '',
  onClick,
  isSpinning = true,
  border = false,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 hover:scale-105 ${className}`}
      title="Interactive Emblem - Click to Explore"
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-md select-none"
        style={{
          animation: isSpinning ? 'spin-slow 10s linear infinite' : 'none',
        }}
      >
        {/* Outermost dark rim and backing disc */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="#000000"
          stroke={border ? '#1a1a1a' : 'none'}
          strokeWidth={border ? '1.5' : '0'}
        />

        {/* Outer concentric white ring */}
        <circle
          cx="100"
          cy="100"
          r="91"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />

        {/* Thick black annular band between r=91 and r=63 */}
        {/* (Natural black fill from base circle) */}

        {/* Inner concentric double ring - Outer line */}
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.8"
        />

        {/* Subtle spacing gap between the double rings */}
        <circle
          cx="100"
          cy="100"
          r="59.5"
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Inner concentric double ring - Inner line */}
        <circle
          cx="100"
          cy="100"
          r="57"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Center Disc Base: Black background (fills Top-Right & Bottom-Left) */}
        <circle
          cx="100"
          cy="100"
          r="56"
          fill="#000000"
        />

        {/* Top-Left Quadrant: Pure White (x: 44 to 100, y: 44 to 100) */}
        <path
          d="M 100 100 L 44 100 A 56 56 0 0 1 100 44 Z"
          fill="#FFFFFF"
        />

        {/* Bottom-Right Quadrant: Pure White (x: 100 to 156, y: 100 to 156) */}
        <path
          d="M 100 100 L 156 100 A 56 56 0 0 1 100 156 Z"
          fill="#FFFFFF"
        />

        {/* Precision dividing crosshairs */}
        <line
          x1="100"
          y1="44"
          x2="100"
          y2="156"
          stroke="#000000"
          strokeWidth="1.8"
        />
        <line
          x1="44"
          y1="100"
          x2="156"
          y2="100"
          stroke="#000000"
          strokeWidth="1.8"
        />

        {/* Subtle outer containment border if on pure light background */}
        {border && (
          <circle
            cx="100"
            cy="100"
            r="99"
            fill="none"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};

