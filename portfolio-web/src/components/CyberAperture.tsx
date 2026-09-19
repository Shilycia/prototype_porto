'use client';

interface CyberApertureProps {
  position?: 'left' | 'right' | 'center';
  className?: string;
}

export default function CyberAperture({
  position = 'left',
  className = '',
}: CyberApertureProps) {
  let posClass = 'absolute -left-16 sm:-left-8 md:left-4 top-1/2 -translate-y-1/2 w-[520px] sm:w-[640px] lg:w-[720px] h-[520px] sm:h-[640px] lg:h-[720px]';
  if (position === 'right') {
    posClass = 'absolute right-0 top-1/2 -translate-y-1/2 w-[480px] sm:w-[620px] h-[480px] sm:h-[620px]';
  } else if (position === 'center') {
    posClass = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[620px] lg:w-[700px] h-[480px] sm:h-[620px] lg:h-[700px]';
  }

  return (
    <div
      className={`${posClass} pointer-events-none select-none opacity-50 overflow-visible z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Central Ambient Glow */}
      <div className="absolute inset-0 m-auto w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[90px]" />

      <svg
        className="w-full h-full"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="apertureGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="apertureGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Ring 1 — Slow Clockwise Rotation */}
        <g className="origin-center animate-[spin_55s_linear_infinite]">
          {/* Dashed outer boundary */}
          <circle
            cx="250"
            cy="250"
            r="235"
            stroke="url(#apertureGradient1)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />

          {/* Precision ticks on 4 cardinal points */}
          <line x1="250" y1="10" x2="250" y2="25" stroke="#c084fc" strokeWidth="2" />
          <line x1="250" y1="475" x2="250" y2="490" stroke="#c084fc" strokeWidth="2" />
          <line x1="10" y1="250" x2="25" y2="250" stroke="#38bdf8" strokeWidth="2" />
          <line x1="475" y1="250" x2="490" y2="250" stroke="#38bdf8" strokeWidth="2" />

          {/* Fine orbital degree markers */}
          <circle cx="250" cy="250" r="215" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
          <circle cx="465" cy="250" r="3" fill="#38bdf8" />
          <circle cx="35" cy="250" r="3" fill="#f472b6" />
        </g>

        {/* Mid Ring 2 — Counter-Clockwise Rotation (Camera Lens Aperture Blades) */}
        <g className="origin-center animate-[spin_40s_linear_infinite_reverse]">
          <circle
            cx="250"
            cy="250"
            r="175"
            stroke="url(#apertureGradient2)"
            strokeWidth="1.5"
            strokeDasharray="14 10"
          />

          {/* 6 Intersecting Aperture Diaphragm Blades */}
          <line x1="140" y1="120" x2="360" y2="180" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />
          <line x1="360" y1="180" x2="330" y2="380" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />
          <line x1="330" y1="380" x2="160" y2="380" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />
          <line x1="160" y1="380" x2="110" y2="230" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />
          <line x1="110" y1="230" x2="220" y2="105" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />
          <line x1="220" y1="105" x2="370" y2="260" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1.5" />

          {/* Geometric Accent Nodes */}
          <rect x="246" y="71" width="8" height="8" fill="#c084fc" className="animate-pulse" />
          <rect x="246" y="421" width="8" height="8" fill="#38bdf8" className="animate-pulse" />
        </g>

        {/* Inner Ring 3 — Faster Rotating Cyber Targeting Reticle */}
        <g className="origin-center animate-[spin_25s_linear_infinite]">
          <circle
            cx="250"
            cy="250"
            r="115"
            stroke="#a855f7"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle cx="250" cy="250" r="95" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />

          {/* Crosshair Spikes */}
          <line x1="250" y1="140" x2="250" y2="160" stroke="#38bdf8" strokeWidth="2" />
          <line x1="250" y1="340" x2="250" y2="360" stroke="#38bdf8" strokeWidth="2" />
          <line x1="140" y1="250" x2="160" y2="250" stroke="#f472b6" strokeWidth="2" />
          <line x1="340" y1="250" x2="360" y2="250" stroke="#f472b6" strokeWidth="2" />
        </g>

        {/* Static Center Optical Core */}
        <circle cx="250" cy="250" r="50" stroke="rgba(192, 132, 252, 0.5)" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="14" fill="#a855f7" fillOpacity="0.4" className="animate-ping-slow" />
        <circle cx="250" cy="250" r="5" fill="#ffffff" />
      </svg>
    </div>
  );
}
