import React from 'react';

export interface ProjectDocumentIconProps extends React.SVGProps<SVGSVGElement> {
  /** Size in pixels (applies to width & height) or CSS dimension string. Defaults to 40. */
  size?: number | string;
  /** Primary stroke color for the document/blueprint lines. Defaults to 'currentColor'. */
  documentColor?: string;
  /** Accent stroke color for the gear/cog wheel. Defaults to a lighter tech accent (#38bdf8 / sky-400) or 'currentColor'. */
  gearColor?: string;
  /** Optional fill color/opacity for the document surface (ideal for dark-theme contrast). */
  documentFill?: string;
  /** Optional fill color for the gear interior. */
  gearFill?: string;
  /** When true, continuously spins the gear. */
  spinGear?: boolean;
  /** When true, rotates the gear smoothly on hover. Defaults to true. */
  interactive?: boolean;
  /** Style mode: 'blueprint' (crisp folded-corner tech sheet) or 'scroll' (rolled parchment style). Defaults to 'blueprint'. */
  styleVariant?: 'blueprint' | 'scroll';
  className?: string;
}

/**
 * Custom SVG Icon Component combining:
 * 1. A document / blueprint / scroll icon on the left with horizontal spec lines.
 * 2. A precision mechanical gear / cog wheel on the right side.
 * 
 * Styled specifically for dark-themed, modern engineering/developer portfolios.
 */
export const ProjectDocumentIcon: React.FC<ProjectDocumentIconProps> = ({
  size = 40,
  documentColor = 'currentColor',
  gearColor = '#38bdf8',
  documentFill = 'rgba(15, 23, 42, 0.45)',
  gearFill = 'rgba(56, 189, 248, 0.1)',
  spinGear = false,
  interactive = true,
  styleVariant = 'blueprint',
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label="Project Document and Gear Icon"
      role="img"
      {...props}
    >
      <defs>
        {/* Knockout mask for the gear so document lines stay clean behind it */}
        <mask id="gear-knockout-mask">
          <rect width="64" height="64" fill="white" />
          <circle cx="44" cy="42" r="16.5" fill="black" />
        </mask>
      </defs>

      {/* ================= 1. DOCUMENT / SCROLL (LEFT SIDE) ================= */}
      <g
        mask="url(#gear-knockout-mask)"
        stroke={documentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {styleVariant === 'blueprint' ? (
          <>
            {/* Document sheet body with folded top-right corner */}
            <path
              d="M 12 8 H 32 L 42 18 V 56 H 12 Z"
              fill={documentFill}
            />
            {/* Top-Right Corner Fold Flap */}
            <path
              d="M 32 8 V 18 H 42"
              fill="none"
              strokeWidth="1.75"
            />
            {/* Horizontal Blueprint / Content Lines */}
            <line x1="18" y1="20" x2="27" y2="20" strokeWidth="2.2" />
            <line x1="18" y1="27" x2="36" y2="27" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="18" y1="34" x2="34" y2="34" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="18" y1="41" x2="26" y2="41" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="18" y1="48" x2="30" y2="48" strokeWidth="1.8" strokeOpacity="0.85" />
          </>
        ) : (
          <>
            {/* Scroll Parchment Body with curved rolled edges */}
            <path
              d="M 14 12 C 14 9 17 7 20 7 H 40 C 37 9 37 12 40 14 V 50 C 37 48 37 45 40 43 H 18 C 15 43 14 45 14 48 Z"
              fill={documentFill}
            />
            {/* Top Roll Curl */}
            <path d="M 14 12 C 14 8 18 7 24 7 H 42 C 44 7 45 8.5 44 10 C 43 12 41 13 38 13 H 15" />
            {/* Bottom Roll Curl */}
            <path d="M 14 48 C 14 52 18 53 24 53 H 42 C 44 53 45 51.5 44 50 C 43 48 41 47 38 47 H 15" />
            {/* Scroll Horizontal Lines */}
            <line x1="20" y1="21" x2="34" y2="21" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="20" y1="28" x2="36" y2="28" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="20" y1="35" x2="28" y2="35" strokeWidth="1.8" strokeOpacity="0.85" />
            <line x1="20" y1="42" x2="32" y2="42" strokeWidth="1.8" strokeOpacity="0.85" />
          </>
        )}
      </g>

      {/* ================= 2. GEAR / COG WHEEL (RIGHT SIDE) ================= */}
      <g
        transform="translate(44, 42)"
        style={{ transformOrigin: '44px 42px' }}
        className={`${
          spinGear
            ? 'animate-spin'
            : interactive
            ? 'transition-transform duration-700 ease-out group-hover:rotate-90'
            : ''
        }`}
      >
        {/* Precision 8-tooth mechanical gear */}
        <path
          d="M 10.67 -2.66 L 14.85 -2.09 L 14.85 2.09 L 10.67 2.66 L 9.43 5.67 L 11.98 9.03 L 9.03 11.98 L 5.67 9.43 L 2.66 10.67 L 2.09 14.85 L -2.09 14.85 L -2.66 10.67 L -5.67 9.43 L -9.03 11.98 L -11.98 9.03 L -9.43 5.67 L -10.67 2.66 L -14.85 2.09 L -14.85 -2.09 L -10.67 -2.66 L -9.43 -5.67 L -11.98 -9.03 L -9.03 -11.98 L -5.67 -9.43 L -2.66 -10.67 L -2.09 -14.85 L 2.09 -14.85 L 2.66 -10.67 L 5.67 -9.43 L 9.03 -11.98 L 11.98 -9.03 L 9.43 -5.67 Z"
          fill={gearFill}
          stroke={gearColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central axle hub hole */}
        <circle
          cx="0"
          cy="0"
          r="4.2"
          fill="none"
          stroke={gearColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default ProjectDocumentIcon;
