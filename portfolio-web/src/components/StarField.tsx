'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  isSparkler: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

const STAR_COLORS = [
  '#ffffff',
  '#f5f3ff',
  '#e9d5ff',
  '#d8b4fe',
  '#c084fc',
  '#818cf8',
  '#38bdf8',
];

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let isVisible = true;
    let stars: Star[] = [];
    let nebulaCanvas: HTMLCanvasElement | null = null;

    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      len: 200,
      speed: 16,
      angle: Math.PI / 4.8,
      opacity: 0,
      active: false,
      trail: [],
    };
    let shootingTimer = 0;

    // Cache static radial nebulae onto an offscreen canvas to avoid expensive per-frame gradient compilation
    const renderNebulaCache = (w: number, h: number) => {
      nebulaCanvas = document.createElement('canvas');
      nebulaCanvas.width = w;
      nebulaCanvas.height = h;
      const nCtx = nebulaCanvas.getContext('2d');
      if (!nCtx) return;

      // Nebula 1 — Deep purple glow on upper left
      const g1 = nCtx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, w * 0.35);
      g1.addColorStop(0, 'rgba(147, 51, 234, 0.16)');
      g1.addColorStop(0.5, 'rgba(109, 40, 217, 0.07)');
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = g1;
      nCtx.fillRect(0, 0, w, h);

      // Nebula 2 — Vibrant fuchsia glow on center-right
      const g2 = nCtx.createRadialGradient(w * 0.75, h * 0.35, 0, w * 0.75, h * 0.35, w * 0.3);
      g2.addColorStop(0, 'rgba(217, 70, 239, 0.14)');
      g2.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)');
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = g2;
      nCtx.fillRect(0, 0, w, h);

      // Nebula 3 — Cyber cyan-indigo horizon glow at lower section
      const g3 = nCtx.createRadialGradient(w * 0.5, h * 0.75, 0, w * 0.5, h * 0.75, w * 0.45);
      g3.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      g3.addColorStop(0.4, 'rgba(99, 102, 241, 0.06)');
      g3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = g3;
      nCtx.fillRect(0, 0, w, h);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderNebulaCache(canvas.width, canvas.height);
      initStars();
    };

    const initStars = () => {
      // Lightweight density: capped to max 120 stars on desktop, min 45 on mobile
      const count = Math.min(120, Math.max(45, Math.floor((canvas.width * canvas.height) / 9500)));
      stars = Array.from({ length: count }, (_, idx) => {
        const isSparkler = idx % 8 === 0;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: isSparkler
            ? Math.random() * 1.5 + 1.2
            : Math.random() * 1.4 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.4,
          speed: Math.random() * 0.02 + 0.005,
          twinkleSpeed: Math.random() * 0.05 + 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          isSparkler,
        };
      });
    };

    const spawnShootingStar = () => {
      const margin = 100;
      shootingStar = {
        x: Math.random() * (canvas.width * 0.7) + margin,
        y: Math.random() * (canvas.height * 0.35),
        len: Math.random() * 160 + 120,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 5 + (Math.random() - 0.5) * 0.25,
        opacity: 1,
        active: true,
        trail: [],
      };
    };

    const drawStars = () => {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const rawWave = Math.sin(s.twinklePhase);
        const sparkleFactor = Math.pow((rawWave + 1) * 0.5, 2.2);
        const alpha = Math.min(1, Math.max(0.12, s.baseAlpha * (0.2 + 0.85 * sparkleFactor)));

        // Outer ambient glow when the star is bright
        if (s.radius > 1.0 && alpha > 0.45) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.2})`;
          ctx.fill();
        }

        // Draw 4-point sparkle flare for sparkler stars at their peak brightness
        if (s.isSparkler && sparkleFactor > 0.72) {
          const flareLen = s.radius * 4.5 * sparkleFactor;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
          ctx.lineWidth = 0.9;

          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.stroke();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (0.8 + 0.4 * sparkleFactor), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const drawShootingStar = () => {
      if (!shootingStar.active) return;

      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.trail.push({ x: shootingStar.x, y: shootingStar.y });
      if (shootingStar.trail.length > 20) shootingStar.trail.shift();
      shootingStar.opacity -= 0.025;

      if (
        shootingStar.opacity <= 0 ||
        shootingStar.x > canvas.width + 100 ||
        shootingStar.y > canvas.height + 100
      ) {
        shootingStar.active = false;
        return;
      }

      for (let i = 1; i < shootingStar.trail.length; i++) {
        const frac = i / shootingStar.trail.length;
        ctx.beginPath();
        ctx.moveTo(shootingStar.trail[i - 1].x, shootingStar.trail[i - 1].y);
        ctx.lineTo(shootingStar.trail[i].x, shootingStar.trail[i].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity * frac * 0.95})`;
        ctx.lineWidth = frac * 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Head glow
      const headGlow = ctx.createRadialGradient(
        shootingStar.x,
        shootingStar.y,
        0,
        shootingStar.x,
        shootingStar.y,
        6
      );
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      headGlow.addColorStop(0.4, `rgba(216, 180, 254, ${shootingStar.opacity * 0.6})`);
      headGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(shootingStar.x, shootingStar.y, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fast single blit from cached nebulae
      if (nebulaCanvas) {
        ctx.drawImage(nebulaCanvas, 0, 0);
      }

      drawStars();

      shootingTimer++;
      if (shootingTimer > 200 && !shootingStar.active) {
        spawnShootingStar();
        shootingTimer = 0;
      }
      drawShootingStar();

      animFrameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(loop);
    };

    resize();
    startLoop();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause canvas animation loop when canvas is off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && !document.hidden;
        if (isVisible) {
          startLoop();
        } else {
          cancelAnimationFrame(animFrameId);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startLoop();
      } else {
        cancelAnimationFrame(animFrameId);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animFrameId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
