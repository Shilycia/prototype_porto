'use client';

interface NebulaProps {
  variant?: 'cosmic' | 'purple' | 'fuchsia' | 'cyan' | 'indigo';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'center-left'
    | 'center-right'
    | 'none';
  direction?: 'normal' | 'reverse';
  intensity?: 'subtle' | 'normal' | 'vibrant';
  withSparkles?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-64 h-64 sm:w-80 sm:h-80',
  md: 'w-80 h-80 sm:w-[420px] sm:h-[420px]',
  lg: 'w-[450px] h-[450px] sm:w-[580px] sm:h-[580px]',
  xl: 'w-[600px] h-[600px] sm:w-[780px] sm:h-[780px]',
  full: 'w-full h-full',
};

const POSITION_MAP = {
  'top-left': 'absolute -top-16 -left-16 sm:-top-24 sm:-left-24',
  'top-right': 'absolute -top-16 -right-16 sm:-top-24 sm:-right-24',
  'bottom-left': 'absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24',
  'bottom-right': 'absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24',
  center: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-left': 'absolute top-1/2 -left-20 sm:-left-28 -translate-y-1/2',
  'center-right': 'absolute top-1/2 -right-20 sm:-right-28 -translate-y-1/2',
  none: '',
};

const INTENSITY_MAP = {
  subtle: 'opacity-50',
  normal: 'opacity-75',
  vibrant: 'opacity-100',
};

export default function Nebula({
  variant = 'cosmic',
  size = 'md',
  position = 'none',
  direction = 'normal',
  intensity = 'normal',
  withSparkles = true,
  className = '',
}: NebulaProps) {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const posClasses = POSITION_MAP[position] || '';
  const opacityClass = INTENSITY_MAP[intensity] || INTENSITY_MAP.normal;
  const driftAnimClass =
    direction === 'reverse'
      ? 'animate-nebula-drift-reverse'
      : 'animate-nebula-drift';

  return (
    <div
      className={`pointer-events-none select-none z-0 ${posClasses} ${sizeClasses} ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      <div className={`relative w-full h-full ${driftAnimClass}`}>
        {/* Layer 1: Base Core Cloud */}
        {variant === 'cosmic' && (
          <>
            {/* Primary Violet Deep Void */}
            <div
              className="absolute inset-0 rounded-full animate-nebula-morph blur-[80px] sm:blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at 45% 45%, rgba(147, 51, 234, 0.32) 0%, rgba(88, 28, 135, 0.2) 40%, rgba(30, 10, 60, 0.08) 65%, transparent 75%)',
              }}
            />
            {/* Secondary Vibrant Fuchsia Stardust Core */}
            <div
              className="absolute inset-4 rounded-full animate-nebula-morph blur-[60px] sm:blur-[90px] delay-300"
              style={{
                background:
                  'radial-gradient(circle at 60% 35%, rgba(217, 70, 239, 0.25) 0%, rgba(168, 85, 247, 0.15) 35%, transparent 68%)',
              }}
            />
            {/* Tertiary Cyber Cyan Gas Fringe */}
            <div
              className="absolute inset-10 rounded-full animate-nebula-morph blur-[70px] sm:blur-[95px] delay-700"
              style={{
                background:
                  'radial-gradient(circle at 35% 65%, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.14) 40%, transparent 70%)',
              }}
            />
          </>
        )}

        {variant === 'purple' && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-nebula-morph blur-[80px] sm:blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.35) 0%, rgba(109, 40, 217, 0.22) 45%, rgba(46, 16, 101, 0.08) 68%, transparent 78%)',
              }}
            />
            <div
              className="absolute inset-6 rounded-full animate-nebula-morph blur-[60px] sm:blur-[85px] delay-500"
              style={{
                background:
                  'radial-gradient(circle at 55% 40%, rgba(192, 132, 252, 0.26) 0%, rgba(126, 34, 206, 0.12) 45%, transparent 70%)',
              }}
            />
          </>
        )}

        {variant === 'fuchsia' && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-nebula-morph blur-[80px] sm:blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.3) 0%, rgba(192, 38, 211, 0.18) 45%, rgba(88, 28, 135, 0.08) 68%, transparent 78%)',
              }}
            />
            <div
              className="absolute inset-6 rounded-full animate-nebula-morph blur-[60px] sm:blur-[85px] delay-300"
              style={{
                background:
                  'radial-gradient(circle at 40% 60%, rgba(244, 114, 182, 0.22) 0%, rgba(147, 51, 234, 0.12) 40%, transparent 68%)',
              }}
            />
          </>
        )}

        {variant === 'cyan' && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-nebula-morph blur-[80px] sm:blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.16) 45%, rgba(30, 58, 138, 0.08) 68%, transparent 78%)',
              }}
            />
            <div
              className="absolute inset-6 rounded-full animate-nebula-morph blur-[60px] sm:blur-[85px] delay-500"
              style={{
                background:
                  'radial-gradient(circle at 60% 45%, rgba(99, 102, 241, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 70%)',
              }}
            />
          </>
        )}

        {variant === 'indigo' && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-nebula-morph blur-[80px] sm:blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, rgba(67, 56, 202, 0.18) 45%, transparent 75%)',
              }}
            />
            <div
              className="absolute inset-6 rounded-full animate-nebula-morph blur-[60px] sm:blur-[85px] delay-300"
              style={{
                background:
                  'radial-gradient(circle at 45% 55%, rgba(168, 85, 247, 0.2) 0%, transparent 65%)',
              }}
            />
          </>
        )}

        {/* Embedded Celestial Stardust Sparkles */}
        {withSparkles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span
              className="absolute top-[28%] left-[32%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#c084fc] animate-stardust"
              style={{ animationDelay: '200ms' }}
            />
            <span
              className="absolute top-[48%] left-[64%] w-1 h-1 rounded-full bg-purple-200 shadow-[0_0_6px_#d946ef] animate-stardust"
              style={{ animationDelay: '1100ms' }}
            />
            <span
              className="absolute top-[68%] left-[38%] w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8] animate-stardust"
              style={{ animationDelay: '1900ms' }}
            />
            <span
              className="absolute top-[35%] left-[70%] w-1 h-1 rounded-full bg-fuchsia-200 shadow-[0_0_6px_#fff] animate-stardust"
              style={{ animationDelay: '700ms' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
