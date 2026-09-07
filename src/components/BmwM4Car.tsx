import React from 'react';
import { motion } from 'motion/react';

interface BmwM4CarProps {
  progress?: number; // 0 to 1
  isScrolling?: boolean;
}

export const BmwM4Car: React.FC<BmwM4CarProps> = ({ progress = 0, isScrolling = false }) => {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-auto group">
      {/* Subtle Black Smoke Aura trailing behind the car when moving */}
      <motion.div
        animate={{
          opacity: isScrolling ? [0.4, 0.7, 0.4] : 0.2,
          scaleY: isScrolling ? [1, 1.25, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="absolute -top-8 w-5 h-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent blur-[2px] rounded-full pointer-events-none"
      />

      {/* BMW M4 Top-Down Vector Artwork (High Detail Black & White Monochrome) */}
      <div className="relative w-12 h-24 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transform transition-transform duration-200 group-hover:scale-105">
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gloss Body Gradients */}
            <linearGradient id="m4BodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="15%" stopColor="#2A2A2A" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>

            <linearGradient id="roofCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="50%" stopColor="#1f1f1f" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="50%" stopColor="#1c1c1c" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wheel Shadows */}
          <rect x="6" y="32" width="10" height="24" rx="3" fill="#000000" opacity="0.9" />
          <rect x="84" y="32" width="10" height="24" rx="3" fill="#000000" opacity="0.9" />
          <rect x="6" y="142" width="10" height="26" rx="3" fill="#000000" opacity="0.9" />
          <rect x="84" y="142" width="10" height="26" rx="3" fill="#000000" opacity="0.9" />

          {/* Aggressive M4 Outer Chassis Body */}
          <path
            d="M 28 12 
               C 35 6, 65 6, 72 12 
               C 80 18, 86 28, 88 44 
               C 90 60, 86 85, 87 115 
               C 88 140, 91 160, 86 182 
               C 82 194, 68 197, 50 197 
               C 32 197, 18 194, 14 182 
               C 9 160, 12 140, 13 115 
               C 14 85, 10 60, 12 44 
               C 14 28, 20 18, 28 12 Z"
            fill="url(#m4BodyGrad)"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Front Bumper Aerodynamics / Splitter */}
          <path
            d="M 20 22 C 32 14, 68 14, 80 22 L 76 28 C 64 22, 36 22, 24 28 Z"
            fill="#050505"
            stroke="#222"
            strokeWidth="0.8"
          />

          {/* BMW Kidney Grille */}
          <rect x="36" y="10" width="12" height="8" rx="2" fill="#000" stroke="#FFF" strokeWidth="0.8" />
          <rect x="52" y="10" width="12" height="8" rx="2" fill="#000" stroke="#FFF" strokeWidth="0.8" />
          {/* Grille Slats */}
          <line x1="39" y1="11" x2="39" y2="17" stroke="#666" strokeWidth="0.6" />
          <line x1="42" y1="11" x2="42" y2="17" stroke="#666" strokeWidth="0.6" />
          <line x1="45" y1="11" x2="45" y2="17" stroke="#666" strokeWidth="0.6" />
          <line x1="55" y1="11" x2="55" y2="17" stroke="#666" strokeWidth="0.6" />
          <line x1="58" y1="11" x2="58" y2="17" stroke="#666" strokeWidth="0.6" />
          <line x1="61" y1="11" x2="61" y2="17" stroke="#666" strokeWidth="0.6" />

          {/* BMW Hood Power Dome Lines */}
          <path d="M 38 18 L 34 52" stroke="#000" strokeWidth="1" opacity="0.6" />
          <path d="M 62 18 L 66 52" stroke="#000" strokeWidth="1" opacity="0.6" />
          <path d="M 44 20 L 42 46" stroke="#fff" strokeWidth="0.6" opacity="0.8" />
          <path d="M 56 20 L 58 46" stroke="#fff" strokeWidth="0.6" opacity="0.8" />

          {/* Laser Headlights (Iconic Angel Eye Hex shape) */}
          <polygon points="18,22 28,17 31,24 20,28" fill="#FFF" />
          <polygon points="82,22 72,17 69,24 80,28" fill="#FFF" />
          <circle cx="24" cy="23" r="2" fill="#00e5ff" opacity="0.9" />
          <circle cx="76" cy="23" r="2" fill="#00e5ff" opacity="0.9" />

          {/* Windshield */}
          <path
            d="M 22 56 C 28 50, 72 50, 78 56 L 73 82 C 65 80, 35 80, 27 82 Z"
            fill="url(#glassGrad)"
            stroke="#111"
            strokeWidth="1"
          />

          {/* M Sport Side Mirrors */}
          <path d="M 12 58 L 4 64 L 6 68 L 14 62 Z" fill="#000" stroke="#fff" strokeWidth="0.5" />
          <path d="M 88 58 L 96 64 L 94 68 L 86 62 Z" fill="#000" stroke="#fff" strokeWidth="0.5" />

          {/* Carbon Fiber Roof with Double Bubble Contour */}
          <rect x="26" y="82" width="48" height="46" rx="3" fill="url(#roofCarbon)" stroke="#000" strokeWidth="1" />
          {/* M Stripes subtle accent on roof */}
          <line x1="48" y1="84" x2="48" y2="126" stroke="#00A2E8" strokeWidth="0.8" opacity="0.8" />
          <line x1="50" y1="84" x2="50" y2="126" stroke="#1F4788" strokeWidth="0.8" opacity="0.8" />
          <line x1="52" y1="84" x2="52" y2="126" stroke="#E61A28" strokeWidth="0.8" opacity="0.8" />

          {/* Rear Windshield */}
          <path
            d="M 27 128 C 35 130, 65 130, 73 128 L 76 150 C 68 153, 32 153, 24 150 Z"
            fill="url(#glassGrad)"
            stroke="#111"
            strokeWidth="1"
          />

          {/* Rear Trunk / Ducktail Spoiler */}
          <path
            d="M 20 166 C 35 160, 65 160, 80 166 L 82 176 C 68 179, 32 179, 18 176 Z"
            fill="#111"
            stroke="#fff"
            strokeWidth="0.6"
          />

          {/* L-Shaped M OLED Taillights */}
          <path d="M 16 174 L 28 172 L 32 176 L 18 178 Z" fill="#FF1A24" />
          <path d="M 84 174 L 72 172 L 68 176 L 82 178 Z" fill="#FF1A24" />

          {/* M Quad Exhaust Pipes */}
          <circle cx="34" cy="192" r="2.5" fill="#000" stroke="#888" strokeWidth="1" />
          <circle cx="41" cy="192" r="2.5" fill="#000" stroke="#888" strokeWidth="1" />
          <circle cx="59" cy="192" r="2.5" fill="#000" stroke="#888" strokeWidth="1" />
          <circle cx="66" cy="192" r="2.5" fill="#000" stroke="#888" strokeWidth="1" />

          {/* Rear Diffuser Fins */}
          <line x1="46" y1="188" x2="46" y2="195" stroke="#444" strokeWidth="1" />
          <line x1="50" y1="188" x2="50" y2="195" stroke="#FFF" strokeWidth="1" />
          <line x1="54" y1="188" x2="54" y2="195" stroke="#444" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
