'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './Icon';

export type KafkaExpression = 'wink' | 'boom' | 'wine' | 'phone' | 'angry';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const EXPRESSIONS: Record<
  KafkaExpression,
  { label: string; src: string; icon: string; quotes: string[] }
> = {
  wink: {
    label: 'Listen...',
    src: '/kafka/kafka-sticker-02.png',
    icon: 'visibility',
    quotes: [
      'Listen... every visual frame tells a story.',
      'Did you miss me, darling?',
      'Semua karya visual di sini... ada di dalam naskah Elio~',
      'Patience is a virtue, darling.',
      'Shh... perhatikan komposisi cahayanya.',
    ],
  },
  boom: {
    label: 'Boom~ 💥',
    src: '/kafka/kafka-sticker-03.png',
    icon: 'flare',
    quotes: [
      'Boom~ 💥',
      'Target visual locked!',
      'Karya ini akan meledak di industri kreatif!',
      'Time for a visual spectacle~',
    ],
  },
  wine: {
    label: 'Relax ♪',
    src: '/kafka/kafka-sticker-01.png',
    icon: 'local_cafe',
    quotes: [
      'Santai sejenak sambil menikmati karya visual ♪~',
      'Cheers to great storytelling.',
      'Kopi hitam atau espresso? Aku lebih suka aroma yang pekat.',
      'Duduklah sebentar, nikmati perjalanan portofolio ini.',
    ],
  },
  phone: {
    label: 'Calling',
    src: '/kafka/kafka-sticker-04.png',
    icon: 'call',
    quotes: [
      'Halo? Ada brief project sinematik baru?',
      'Elio baru saja mengirimkan update jadwal...',
      'Hubungi Diyul di menu Contact jika ingin kolaborasi ya~',
      'Koneksi aman. Silakan tinggalkan pesan.',
    ],
  },
  angry: {
    label: 'Teasing 💢',
    src: '/kafka/kafka-sticker-ppg02.png',
    icon: 'pest_control',
    quotes: [
      'Hei! Taruh aku ke bawah 💢',
      'Jangan angkat-angkat sembarangan, darling~',
      'Kamu berani mempermainkan Stellaron Hunter?',
      'Tanganku sibuk, jangan diganggu dulu~',
    ],
  },
};

const DROP_QUOTES = [
  'Mendarat dengan anggun~',
  'Tempat baru yang strategis.',
  'Jangan kasar-kasar, darling~',
  'Posisi yang menarik untuk mengawasi layar.',
];

// Optional synth audio effect using Web Audio API
function playChime(freq = 523.25, type: OscillatorType = 'sine', duration = 0.2) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // AudioContext blocked or not supported, ignore silently
  }
}

export default function KafkaPuppet() {
  const [pos, setPos] = useState({ x: 120, y: 300 });
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTilt, setDragTilt] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(-1); // -1 = face left, 1 = face right
  const [isWalking, setIsWalking] = useState(false);
  const [walkEnabled, setWalkEnabled] = useState(true);
  const [expression, setExpression] = useState<KafkaExpression>('wink');
  const [dialogue, setDialogue] = useState<string | null>('Boom~ Senang melihatmu di sini!');
  const [showMenu, setShowMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const puppetRef = useRef<HTMLDivElement>(null);
  const dialogueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const walkLoopRef = useRef<number | null>(null);
  const lastMouseXRef = useRef(0);
  const currentPosRef = useRef({ x: 120, y: 300 });

  // Sync ref with state
  useEffect(() => {
    currentPosRef.current = pos;
  }, [pos]);

  // Initial mount position at bottom-right
  useEffect(() => {
    setIsMounted(true);
    const initialX = Math.max(20, window.innerWidth - 170);
    const initialY = Math.max(60, window.innerHeight - 150);
    setPos({ x: initialX, y: initialY });
    currentPosRef.current = { x: initialX, y: initialY };

    // Clear initial greeting dialogue after 6 seconds
    dialogueTimerRef.current = setTimeout(() => {
      setDialogue(null);
    }, 6000);

    return () => {
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    };
  }, []);

  // Display dialogue with auto-clear
  const say = useCallback((text: string, duration = 4500) => {
    setDialogue(text);
    if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    dialogueTimerRef.current = setTimeout(() => {
      setDialogue(null);
    }, duration);
  }, []);

  // Spawn sparkles on click or action
  const triggerSparkles = (originX: number, originY: number) => {
    const colors = ['#c084fc', '#f472b6', '#38bdf8', '#e879f9'];
    const newSparkles: Sparkle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: originX + (Math.random() * 40 - 20),
      y: originY + (Math.random() * 40 - 20),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 6,
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
    }, 800);
  };

  // Change expression manually
  const selectExpression = (exp: KafkaExpression) => {
    setExpression(exp);
    const quotes = EXPRESSIONS[exp].quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    say(randomQuote);
    playChime(659.25, 'sine', 0.25);
    triggerSparkles(pos.x + 50, pos.y + 40);
  };

  // ==================== DRAGGING LOGIC (POINTER EVENTS) ====================
  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking a control button, do not start drag
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    setIsDragging(true);
    setIsWalking(false);
    setExpression('angry');
    say(EXPRESSIONS.angry.quotes[Math.floor(Math.random() * EXPRESSIONS.angry.quotes.length)], 3000);
    playChime(440, 'triangle', 0.18);

    const rect = puppetRef.current?.getBoundingClientRect();
    const offsetX = e.clientX - (rect?.left || pos.x);
    const offsetY = e.clientY - (rect?.top || pos.y);
    setDragOffset({ x: offsetX, y: offsetY });
    lastMouseXRef.current = e.clientX;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;

    // Calculate dynamic tilt based on drag inertia
    const tilt = Math.max(-25, Math.min(25, deltaX * 1.6));
    setDragTilt(tilt);

    const newX = Math.max(10, Math.min(window.innerWidth - 120, e.clientX - dragOffset.x));
    const newY = Math.max(30, Math.min(window.innerHeight - 130, e.clientY - dragOffset.y));

    setPos({ x: newX, y: newY });
    currentPosRef.current = { x: newX, y: newY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragTilt(0);

    // Landing bounce animation
    setBouncing(true);
    setTimeout(() => setBouncing(false), 500);

    // Random landing quote
    const dropQuote = DROP_QUOTES[Math.floor(Math.random() * DROP_QUOTES.length)];
    say(dropQuote);
    playChime(587.33, 'sine', 0.2);

    // Revert to confident smile
    setExpression('wink');

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // ==================== AUTONOMOUS ROAMING / WALKING AI ====================
  useEffect(() => {
    if (!isMounted || !walkEnabled || isDragging || isMinimized) {
      setIsWalking(false);
      return;
    }

    let isWalkingLocal = false;
    let walkSpeed = 0.8;
    let walkDir = direction;

    const runAiCycle = () => {
      // Decide next action: 65% Walk, 35% Idle/Action
      const shouldWalk = Math.random() < 0.65;

      if (shouldWalk) {
        isWalkingLocal = true;
        setIsWalking(true);

        // Pick direction (sometimes flip direction)
        if (Math.random() < 0.4) {
          walkDir = (walkDir === 1 ? -1 : 1) as 1 | -1;
          setDirection(walkDir);
        }

        // Set walking expression
        setExpression('wink');

        // Walk for 3 to 7 seconds
        const walkDuration = Math.random() * 4000 + 3000;
        aiTimerRef.current = setTimeout(() => {
          isWalkingLocal = false;
          setIsWalking(false);

          // Idle action after walking
          const idleAction = Math.random();
          if (idleAction < 0.45) {
            setExpression('wine');
            if (Math.random() < 0.3) say('Santai sejenak ♪~');
          } else if (idleAction < 0.7) {
            setExpression('wink');
            if (Math.random() < 0.25) say('Listen... keep exploring.');
          } else if (idleAction < 0.85) {
            setExpression('boom');
            if (Math.random() < 0.3) say('Boom~ 💥');
          } else {
            setExpression('phone');
          }

          // Idle pause for 3 to 6 seconds before next cycle
          const pauseDuration = Math.random() * 3000 + 3000;
          aiTimerRef.current = setTimeout(runAiCycle, pauseDuration);
        }, walkDuration);
      } else {
        // Just idle
        isWalkingLocal = false;
        setIsWalking(false);
        const pauseDuration = Math.random() * 3500 + 2500;
        aiTimerRef.current = setTimeout(runAiCycle, pauseDuration);
      }
    };

    // Smooth movement loop
    let lastFrameTime = performance.now();
    const stepMove = (now: number) => {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      if (isWalkingLocal && !isDragging && !isMinimized) {
        const current = currentPosRef.current;
        let nextX = current.x + walkDir * walkSpeed * (dt * 60);

        // Boundary edge detection
        const minX = 20;
        const maxX = window.innerWidth - 130;

        if (nextX >= maxX) {
          nextX = maxX;
          walkDir = -1;
          setDirection(-1);
        } else if (nextX <= minX) {
          nextX = minX;
          walkDir = 1;
          setDirection(1);
        }

        setPos((p) => ({ ...p, x: nextX }));
        currentPosRef.current = { ...current, x: nextX };
      }

      walkLoopRef.current = requestAnimationFrame(stepMove);
    };

    walkLoopRef.current = requestAnimationFrame(stepMove);
    aiTimerRef.current = setTimeout(runAiCycle, 2000);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      if (walkLoopRef.current) cancelAnimationFrame(walkLoopRef.current);
    };
  }, [isMounted, walkEnabled, isDragging, isMinimized, say, direction]);

  // Click on Kafka to poke / trigger interaction
  const handlePuppetClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const expKeys = Object.keys(EXPRESSIONS) as KafkaExpression[];
    const nextExp = expKeys[Math.floor(Math.random() * expKeys.length)];
    selectExpression(nextExp);
  };

  if (!isMounted) return null;

  // Minimized Floating Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => {
            setIsMinimized(false);
            setExpression('boom');
            say('Boom~ Aku kembali!');
            playChime(659.25, 'sine', 0.25);
          }}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-purple-950/80 border border-purple-500/50 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400 transition-all duration-300"
          title="Restore Kafka"
        >
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-mono text-purple-200 group-hover:text-white transition-colors">
            🕷️ Kafka // Rest
          </span>
          <span className="text-[10px] text-purple-400 bg-purple-900/60 px-1.5 py-0.5 rounded-full border border-purple-700/40">
            Open
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Spider-Silk Thread when Dragging (Puppet on Strings) */}
      {isDragging && (
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="spiderSilkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#e879f9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
            <filter id="threadGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing Silk Line from top of screen to Kafka */}
          <path
            d={`M ${pos.x + 55} 0 C ${pos.x + 55 + dragTilt * 1.5} ${pos.y * 0.4}, ${pos.x + 55} ${pos.y * 0.7}, ${pos.x + 55} ${pos.y + 15}`}
            fill="none"
            stroke="url(#spiderSilkGrad)"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            filter="url(#threadGlow)"
            className="animate-pulse"
          />

          {/* Top Anchor Ring */}
          <circle cx={pos.x + 55} cy={6} r="4" fill="#f472b6" />
          <circle cx={pos.x + 55} cy={6} r="8" stroke="#c084fc" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      )}

      {/* Main Draggable Puppet Container */}
      <div
        ref={puppetRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${dragTilt}deg) scale(${
            bouncing ? '1.15, 0.88' : '1, 1'
          })`,
          transition: isDragging ? 'transform 0.05s ease-out' : 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          touchAction: 'none',
        }}
        className={`fixed top-0 left-0 z-50 select-none cursor-grab active:cursor-grabbing ${
          isDragging ? 'z-50' : ''
        }`}
      >
        {/* Dialogue Speech Bubble */}
        {dialogue && (
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bubble-pop pointer-events-none"
            style={{ filter: 'drop-shadow(0 4px 15px rgba(147, 51, 234, 0.4))' }}
          >
            <div className="relative px-3.5 py-1.5 rounded-2xl bg-black/90 border border-purple-500/60 backdrop-blur-md text-xs font-sans text-purple-100 flex items-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
              <span className="text-purple-400 font-bold">{'<'}</span>
              <span>{dialogue}</span>
              <span className="text-purple-400 font-bold">{'>'}</span>

              {/* Triangle Tail */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-500/80" />
            </div>
          </div>
        )}

        {/* Emote Selector & Controls (Shows when menu toggled or hover) */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-black/90 border border-purple-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all duration-300 ${
            showMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          {(['wink', 'boom', 'wine', 'phone', 'angry'] as KafkaExpression[]).map((exp) => (
            <button
              key={exp}
              onClick={(e) => {
                e.stopPropagation();
                selectExpression(exp);
              }}
              title={EXPRESSIONS[exp].label}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                expression === exp
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(192,132,252,0.8)] scale-110'
                  : 'text-purple-300 hover:bg-purple-900/50 hover:text-white'
              }`}
            >
              <Icon name={EXPRESSIONS[exp].icon} size={15} />
            </button>
          ))}

          {/* Toggle Walk / Stay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWalkEnabled(!walkEnabled);
              say(walkEnabled ? 'Aku akan berdiri di sini~' : 'Waktunya jalan-jalan lagi!');
              playChime(523.25, 'sine', 0.15);
            }}
            title={walkEnabled ? 'Pause Walking' : 'Enable Walking'}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
              walkEnabled ? 'text-green-400 hover:bg-green-950/50' : 'text-yellow-400 hover:bg-yellow-950/50'
            }`}
          >
            <Icon name={walkEnabled ? 'directions_walk' : 'front_hand'} size={15} />
          </button>

          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            title="Minimize Kafka"
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-gray-400 hover:bg-red-950/50 hover:text-red-300 transition-all"
          >
            <Icon name="close" size={14} />
          </button>
        </div>

        {/* Kafka Puppet Character Body */}
        <div
          onClick={handlePuppetClick}
          className="relative w-28 h-28 sm:w-32 sm:h-32 group flex items-center justify-center"
        >
          {/* Ambient Purple Aura behind Kafka */}
          <div
            className={`absolute inset-0 m-auto w-24 h-24 rounded-full bg-purple-600/30 blur-[25px] transition-all duration-300 pointer-events-none ${
              isDragging ? 'bg-fuchsia-500/50 scale-125' : 'group-hover:bg-purple-500/40'
            }`}
          />

          {/* Character Sprite with Walk / Dangle Animation */}
          <div
            style={{
              transform: `scaleX(${direction})`,
              transformOrigin: 'center bottom',
            }}
            className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${
              isDragging
                ? 'animate-puppet-dangle'
                : isWalking
                ? 'animate-puppet-waddle'
                : 'animate-float-slow'
            }`}
          >
            <img
              src={EXPRESSIONS[expression].src}
              alt="Kafka Honkai Star Rail"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)]"
              draggable={false}
            />
          </div>

          {/* Mini Quick-Toggle Button for Menu (top right corner of sprite) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            title="Kafka Controls"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black/80 border border-purple-500/60 text-purple-300 hover:text-white flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)] opacity-75 hover:opacity-100 transition-all"
          >
            <Icon name={showMenu ? 'expand_more' : 'tune'} size={13} />
          </button>

          {/* Sparkles Particle Canvas */}
          {sparkles.map((sp) => (
            <div
              key={sp.id}
              style={{
                left: sp.x - pos.x,
                top: sp.y - pos.y,
                width: sp.size,
                height: sp.size,
                backgroundColor: sp.color,
                boxShadow: `0 0 10px ${sp.color}`,
              }}
              className="absolute rounded-full animate-ping pointer-events-none"
            />
          ))}
        </div>
      </div>
    </>
  );
}
