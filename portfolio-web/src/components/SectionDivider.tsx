'use client';

export default function SectionDivider({ glow = true }: { glow?: boolean }) {
  return (
    <div className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Soft Ambient Radial Blur behind divider */}
      {glow && (
        <div className="absolute w-[600px] h-[70px] bg-purple-600/10 rounded-full blur-[50px] -translate-y-1/2 top-1/2" />
      )}

      {/* Main fine gradient line */}
      <div className="w-full max-w-6xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent relative">
        {/* Animated gliding light ray */}
        <div className="absolute top-0 h-[1px] w-32 bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent animate-beam opacity-70" />
      </div>

      {/* Center diamond/pulsing point */}
      <div className="absolute flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.9)] animate-ping-slow" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
      </div>
    </div>
  );
}
