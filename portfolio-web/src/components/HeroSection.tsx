'use client';

import { useEffect, useRef } from 'react';
import StarField from './StarField';
import CyberCity from './CyberCity';
import ScrollReveal from './ScrollReveal';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const cityLayerRef = useRef<HTMLDivElement>(null);
  const starsLayerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);

  // Mouse target and current spring physics values
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollY = useRef(0);

  useEffect(() => {
    let animId: number;
    let isVisible = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1 from center of screen
      mouse.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouse.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      if (!isVisible) return;
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth animation loop using spring interpolation (lerp)
    const animate = () => {
      if (!isVisible) return;

      const lerpFactor = 0.07;
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * lerpFactor;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * lerpFactor;

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const sy = scrollY.current;

      // 1. Text Layer: 3D perspective tilt & counter-translation
      if (textContentRef.current) {
        const rotX = -my * 5; // degrees tilt
        const rotY = mx * 6; // degrees tilt
        const transX = -mx * 16;
        const transY = -my * 10 - sy * 0.12;
        textContentRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(
          2
        )}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${transX.toFixed(
          2
        )}px, ${transY.toFixed(2)}px, 0)`;
      }

      // 2. Cyber City Layer: Deep parallax shift & scroll sink
      if (cityLayerRef.current) {
        const cityX = mx * 28;
        const cityY = my * 14 + sy * 0.22;
        cityLayerRef.current.style.transform = `translate3d(${cityX.toFixed(
          2
        )}px, ${cityY.toFixed(2)}px, 0)`;
      }

      // 3. Stars & Deep Nebula Layer: Slower distant drift
      if (starsLayerRef.current) {
        const starX = -mx * 10;
        const starY = -my * 8 + sy * 0.08;
        starsLayerRef.current.style.transform = `translate3d(${starX.toFixed(
          2
        )}px, ${starY.toFixed(2)}px, 0)`;
      }

      // 4. Ambient Floating Glows: Dynamic expansion towards cursor
      if (glowLayerRef.current) {
        const glowX = mx * 35;
        const glowY = my * 25 + sy * 0.15;
        glowLayerRef.current.style.transform = `translate3d(${glowX.toFixed(
          2
        )}px, ${glowY.toFixed(2)}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    const startAnimate = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(animate);
    };

    startAnimate();

    // Pause physics calculations completely when hero section is not visible
    const heroEl = heroRef.current;
    let observer: IntersectionObserver | null = null;
    if (heroEl) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting && !document.hidden;
          if (isVisible) {
            startAnimate();
          } else {
            cancelAnimationFrame(animId);
          }
        },
        { threshold: 0 }
      );
      observer.observe(heroEl);
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startAnimate();
      } else {
        cancelAnimationFrame(animId);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      if (observer) observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none"
    >
      {/* 1. Deep Parallax Layer: Twinkling Stars & Deep Space Nebulae */}
      <div ref={starsLayerRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform">
        <StarField />
      </div>

      {/* 2. Mid Parallax Layer: Ambient Floating Aurora Glows */}
      <div ref={glowLayerRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-[130px] animate-aurora pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-700/10 rounded-full blur-[110px] animate-aurora delay-500 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-violet-900/15 rounded-full blur-[140px] animate-float-slow pointer-events-none" />
      </div>

      {/* 3. Cyber City Skyline Layer with Dynamic Mouse Movement & Scroll Parallax */}
      <div ref={cityLayerRef} className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0">
        <CyberCity />
      </div>

      {/* 4. Foreground Content Layer: 3D Interactive Tilt on Cursor Move */}
      <div
        ref={textContentRef}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center will-change-transform pt-12 pb-20"
      >
        {/* Status Badge */}
        <ScrollReveal delay={100} direction="down">
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-700/40 bg-purple-900/25 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 animate-border-glow shadow-[0_0_20px_rgba(147,51,234,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
            </span>
            Available for creative projects
          </div>
        </ScrollReveal>

        {/* Main Headline */}
        <ScrollReveal delay={200} direction="up">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.02] mb-6 max-w-5xl">
            Turning ideas into{' '}
            <span className="text-shimmer">visual stories</span>
          </h1>
        </ScrollReveal>

        {/* Sub-headline */}
        <ScrollReveal delay={350} direction="up">
          <p className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl mb-10 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            I'm <span className="text-white font-semibold">Diyul</span> — a creative professional crafting compelling photography, video production, and digital design.
          </p>
        </ScrollReveal>
      </div>

      {/* Gentle scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 opacity-60 hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Scroll</span>
        <div className="w-[1px] h-7 bg-gradient-to-b from-purple-400/80 via-gray-600 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
