'use client';

import { useEffect, useRef, useState } from 'react';

export default function MouseEffect() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Positions
  const mousePos = useRef({ x: -200, y: -200 });
  const flashlightPos = useRef({ x: -500, y: -500 });
  const lensRingPos = useRef({ x: -500, y: -500 });

  // DOM Refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const lensRingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setMounted(true);
    document.body.classList.add('custom-cursor-active');

    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instant 0ms response for the main precision cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Detect hover over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, textarea, select, [role="button"], .glass-card, .btn-glow, summary'
        );
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Natural flashlight inertia physics
    const render = () => {
      // Main flashlight beam follows with fluid momentum
      const beamSpeed = 0.14;
      flashlightPos.current.x += (mousePos.current.x - flashlightPos.current.x) * beamSpeed;
      flashlightPos.current.y += (mousePos.current.y - flashlightPos.current.y) * beamSpeed;

      if (flashlightRef.current) {
        flashlightRef.current.style.transform = `translate3d(${flashlightPos.current.x}px, ${flashlightPos.current.y}px, 0)`;
      }

      // Lens rings follow with slightly different parallax for depth
      const ringSpeed = 0.18;
      lensRingPos.current.x += (mousePos.current.x - lensRingPos.current.x) * ringSpeed;
      lensRingPos.current.y += (mousePos.current.y - lensRingPos.current.y) * ringSpeed;

      if (lensRingsRef.current) {
        lensRingsRef.current.style.transform = `translate3d(${lensRingPos.current.x}px, ${lensRingPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <>
      {/* ============================================================ */}
      {/* 1. SENTER / FLASHLIGHT TORCH BEAM (Ambient Illumination)       */}
      {/* ============================================================ */}
      <div
        ref={flashlightRef}
        className="fixed top-0 left-0 w-[600px] h-[600px] -ml-[300px] -mt-[300px] rounded-full pointer-events-none z-10 transition-opacity duration-300 ease-out"
        style={{
          opacity: isVisible ? (isClicking ? 0.45 : isHovered ? 0.35 : 0.28) : 0,
          background:
            'radial-gradient(circle 300px at center, rgba(232, 121, 249, 0.4) 0%, rgba(168, 85, 247, 0.28) 22%, rgba(126, 34, 206, 0.16) 45%, rgba(56, 189, 248, 0.06) 65%, transparent 80%)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        {/* Hotspot: Inti Cahaya Lampu Senter */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-200"
          style={{
            width: isHovered ? '160px' : '110px',
            height: isHovered ? '160px' : '110px',
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(216, 180, 254, 0.4) 40%, transparent 75%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. SENTER LENS RINGS (Optik Refleksi Lensa Senter)             */}
      {/* ============================================================ */}
      <div
        ref={lensRingsRef}
        className="fixed top-0 left-0 w-[240px] h-[240px] -ml-[120px] -mt-[120px] rounded-full pointer-events-none z-10 transition-opacity duration-300 ease-out flex items-center justify-center"
        style={{
          opacity: isVisible ? (isHovered ? 0.35 : 0.18) : 0,
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        {/* Outer Lens Halo */}
        <div
          className="w-full h-full rounded-full border border-purple-400/30 transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
          }}
        />
        {/* Inner Lens Halo */}
        <div
          className="absolute w-[120px] h-[120px] rounded-full border border-cyan-400/20 transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* 3. THEMED CYBER CURSOR (Menggantikan Kursor Default Windows)   */}
      {/* ============================================================ */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        {/* Main Reticle Container centered at (0,0) */}
        <div
          className="relative flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            width: isHovered ? '46px' : isClicking ? '22px' : '32px',
            height: isHovered ? '46px' : isClicking ? '22px' : '32px',
            marginLeft: isHovered ? '-23px' : isClicking ? '-11px' : '-16px',
            marginTop: isHovered ? '-23px' : isClicking ? '-11px' : '-16px',
            transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          {/* Corner 1: Top-Left */}
          <span
            className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors duration-200"
            style={{
              borderColor: isHovered ? '#38bdf8' : '#c084fc',
              boxShadow: isHovered ? '-1px -1px 8px #38bdf8' : '-1px -1px 6px rgba(192, 132, 252, 0.6)',
            }}
          />

          {/* Corner 2: Top-Right */}
          <span
            className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors duration-200"
            style={{
              borderColor: isHovered ? '#f472b6' : '#c084fc',
              boxShadow: isHovered ? '1px -1px 8px #f472b6' : '1px -1px 6px rgba(192, 132, 252, 0.6)',
            }}
          />

          {/* Corner 3: Bottom-Left */}
          <span
            className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors duration-200"
            style={{
              borderColor: isHovered ? '#f472b6' : '#c084fc',
              boxShadow: isHovered ? '-1px 1px 8px #f472b6' : '-1px 1px 6px rgba(192, 132, 252, 0.6)',
            }}
          />

          {/* Corner 4: Bottom-Right */}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors duration-200"
            style={{
              borderColor: isHovered ? '#38bdf8' : '#c084fc',
              boxShadow: isHovered ? '1px 1px 8px #38bdf8' : '1px 1px 6px rgba(192, 132, 252, 0.6)',
            }}
          />

          {/* Center Glowing Cyber Core */}
          <div
            className="w-2 h-2 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isHovered ? '#ffffff' : '#e879f9',
              boxShadow: isHovered
                ? '0 0 10px #fff, 0 0 20px #38bdf8'
                : '0 0 8px #e879f9, 0 0 16px #9333ea',
              transform: isClicking ? 'scale(1.8)' : isHovered ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        </div>
      </div>
    </>
  );
}
