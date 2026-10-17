import React from 'react';

interface ProjectIconProps {
  className?: string;
  size?: number;
}

/**
 * High-fidelity Vector Icon of a Document Scroll with an Engineering Gear / Cog.
 * Represents blueprint specifications, engineering architecture, and projects.
 */
export const ProjectIcon: React.FC<ProjectIconProps> = ({ className = '', size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Document Scroll Gradient */}
        <linearGradient id="scrollGrad" x1="6" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.75" />
        </linearGradient>

        {/* Rolled Cylinder Gradient */}
        <linearGradient id="cylinderGrad" x1="6" y1="6" x2="36" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Gear Metallic Gradient */}
        <linearGradient id="gearGrad" x1="22" y1="22" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="45%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="gearShadow" x="18" y="18" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* --- DOCUMENT SCROLL --- */}
      {/* Scroll Body (Curved paper with curl at edges) */}
      <path
        d="M10 11C10 8.5 12 7 15 7H34C37 7 38 8.8 38 11V31C38 33.5 36.5 35 34 35H14C11.5 35 10 33.2 10 31V11Z"
        fill="url(#scrollGrad)"
        fillOpacity="0.15"
        stroke="url(#scrollGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Top Curled Scroll Cylinder */}
      <rect
        x="8"
        y="6"
        width="28"
        height="6"
        rx="3"
        fill="url(#cylinderGrad)"
        fillOpacity="0.25"
        stroke="url(#cylinderGrad)"
        strokeWidth="1.8"
      />
      {/* Top curl inner spiral line */}
      <path
        d="M34 9C34 7.9 34.9 7 36 7"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Blueprint / Code spec lines inside the scroll */}
      <line x1="15" y1="17" x2="27" y2="17" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="15" y1="22" x2="24" y2="22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="15" y1="27" x2="20" y2="27" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />

      {/* Bottom Curled Scroll End */}
      <path
        d="M8 32C8 30.5 9.5 29 11.5 29H24"
        stroke="url(#cylinderGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="8"
        y="30"
        width="16"
        height="5"
        rx="2.5"
        fill="url(#cylinderGrad)"
        fillOpacity="0.3"
        stroke="url(#cylinderGrad)"
        strokeWidth="1.6"
      />

      {/* --- ENGINEERING GEAR / COG --- */}
      {/* Positioned on the bottom-right intersecting the document scroll */}
      <g filter="url(#gearShadow)">
        {/* Gear Outer Teeth (8-toothed mechanical cog) */}
        <path
          d="
            M 33 21
            L 35 21 L 35.4 23.2 L 37.2 23.9 L 38.9 22.4 L 40.3 23.8 L 38.8 25.5 L 39.5 27.3 L 41.7 27.7 L 41.7 29.7
            L 39.5 30.1 L 38.8 31.9 L 40.3 33.6 L 38.9 35 L 37.2 33.5 L 35.4 34.2 L 35 36.4 L 33 36.4
            L 32.6 34.2 L 30.8 33.5 L 29.1 35 L 27.7 33.6 L 29.2 31.9 L 28.5 30.1 L 26.3 29.7 L 26.3 27.7
            L 28.5 27.3 L 29.2 25.5 L 27.7 23.8 L 29.1 22.4 L 30.8 23.9 L 32.6 23.2 Z
          "
          fill="url(#gearGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Gear Center Cutout Hole */}
        <circle
          cx="34"
          cy="28.7"
          r="3.5"
          fill="#0D0D11"
          stroke="url(#gearGrad)"
          strokeWidth="1.5"
        />
        {/* Subtle center axle pin */}
        <circle
          cx="34"
          cy="28.7"
          r="1.2"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};
