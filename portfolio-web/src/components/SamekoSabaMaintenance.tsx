"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SamekoSabaMaintenanceProps {
  onBypass?: () => void;
}

const DIALOGUES = [
  "Awaawa~! Saba gak sengaja numpahin kopi ke kabel server... Kaniki lagi benerin! ☕💦",
  "Kaniki Engineering lagi kencengin baut-baut Helipod Cloud! Dikit lagi ya~ 🦀🔧",
  "Kalibrasi Mercusuar Port 3000 sedang berlangsung! Jangan sampai tersesat di laut kabut~ 🚨🌊",
  "Sambil nunggu server reboot, yuk kumpulin kerang laut bareng Saba! 🐚✨",
  "Tenang Kaniki bros! Kita bakal berenang online lagi secepatnya! 🦈💙",
];

export default function SamekoSabaMaintenance({ onBypass }: SamekoSabaMaintenanceProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [cheerCount, setCheerCount] = useState(42);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; src: string; x: number }[]>([]);
  const [uptimeStr, setUptimeStr] = useState("00:00:00");

  // Cycle Saba dialogues every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % DIALOGUES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Timer counter
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const seconds = String(diff % 60).padStart(2, "0");
      setUptimeStr(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cute Web Audio API chime sound
  const playCuteChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Handle Cheer click with sticker burst
  const handleCheer = () => {
    playCuteChime();
    setCheerCount((c) => c + 1);

    const stickers = [
      "/stickers/saba-crab.png",
      "/stickers/saba-fish.png",
      "/stickers/saba-boat.png",
    ];
    const src = stickers[Math.floor(Math.random() * stickers.length)];
    const newParticle = {
      id: Date.now() + Math.random(),
      src,
      x: Math.random() * 80 - 40,
    };

    setFloatingParticles((prev) => [...prev.slice(-12), newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* =========================================
          ANIMATED BEACH BACKGROUND (Sameko Saba Beach)
          ========================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Base Beach Image */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom md:bg-center transform scale-[1.02] transition-transform duration-1000"
          style={{
            backgroundImage: "url('/saba-beach-bg.png')",
          }}
        />

        {/* Ambient Darkening Overlay for Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/35 to-slate-950/80 backdrop-blur-[0.5px]" />

        {/* Animated Water Caustic Shimmer on Lower Ocean Half */}
        <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-cyan-500/15 via-teal-400/10 to-transparent pointer-events-none animate-water-glimmer" />

        {/* Animated Shoreline Wave Foam (Ebb & Flow Tide) */}
        <div className="absolute bottom-[32%] sm:bottom-[36%] inset-x-0 h-16 pointer-events-none animate-wave-ebb">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full opacity-60 animate-wave-shift">
            <path
              d="M0,40 C150,80 350,10 500,45 C650,80 850,20 1000,50 C1100,65 1180,45 1200,40 L1200,120 L0,120 Z"
              fill="rgba(165, 243, 252, 0.45)"
              className="animate-foam-pulse"
            />
          </svg>
        </div>

        {/* Secondary Delicate Wave Foam Layer */}
        <div className="absolute bottom-[30%] sm:bottom-[33%] inset-x-0 h-14 pointer-events-none animate-wave-ebb" style={{ animationDelay: "-3s" }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full opacity-35">
            <path
              d="M0,50 C200,20 400,70 600,35 C800,75 1000,30 1200,55 L1200,120 L0,120 Z"
              fill="rgba(255, 255, 255, 0.35)"
            />
          </svg>
        </div>

        {/* Ambient Floating Hand-drawn Stickers on Beach Scene */}
        <div className="absolute top-28 left-[6%] w-14 h-11 opacity-70 pointer-events-none animate-float-slow hidden md:block" style={{ animationDelay: "0.5s" }}>
          <img src="/stickers/saba-boat.png" alt="Origami Boat" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <div className="absolute bottom-28 left-[10%] w-12 h-9 opacity-75 pointer-events-none animate-float-slow hidden md:block" style={{ animationDelay: "2s" }}>
          <img src="/stickers/saba-fish.png" alt="Blue Fish" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <div className="absolute top-36 right-[8%] w-14 h-11 opacity-65 pointer-events-none animate-float-slow hidden md:block" style={{ animationDelay: "1.5s" }}>
          <img src="/stickers/saba-boat.png" alt="Origami Boat" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <div className="absolute bottom-24 right-[12%] w-14 h-10 opacity-80 pointer-events-none animate-crab-scuttle hidden md:block">
          <img src="/stickers/saba-crab.png" alt="Kaniki Crab" className="w-full h-full object-contain drop-shadow-md" />
        </div>

        {/* Rising Ocean Bubbles */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200/30 border border-cyan-100/50 pointer-events-none backdrop-blur-xs"
            style={{
              width: `${10 + (i % 5) * 8}px`,
              height: `${10 + (i % 5) * 8}px`,
              left: `${(i * 6.5 + 3) % 96}%`,
              bottom: "-40px",
              animation: `bubbleFloatUp ${7 + (i % 6) * 3}s linear infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* =========================================
          TOP HEADER BAR
          ========================================= */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-300/30 p-1.5">
            <img src="/stickers/saba-fish.png" alt="Sameko Saba Fish" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider uppercase text-cyan-300 drop-shadow">
                Sameko Saba &bull; Beach Mode
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-300 font-mono drop-shadow">PORT 3000 &bull; SYSTEM MAINTENANCE</p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-inner text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">Helipod Host:</span>
          <span className="text-cyan-300 font-semibold">Tuning Beach Station</span>
        </div>
      </header>

      {/* =========================================
          MAIN MAINTENANCE STAGE
          ========================================= */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 py-6 flex flex-col items-center text-center my-auto">
        
        {/* Official Sameko Saba Beach Logo */}
        <div className="mb-4 animate-float-slow select-none">
          <img 
            src="/stickers/saba-logo.png" 
            alt="Sameko Saba Official Logo" 
            className="w-44 sm:w-56 h-auto object-contain drop-shadow-[0_10px_25px_rgba(6,182,212,0.4)] mx-auto hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Saba & Kaniki Interactive Avatar Stage */}
        <div className="relative mb-6">
          {/* Character Container with Floating Motion */}
          <div className="relative group cursor-pointer animate-float-slow" onClick={handleCheer}>
            
            {/* Glow Aura */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/30 via-sky-400/30 to-pink-500/30 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
            
            {/* Saba Animated GIF Frame */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-cyan-400 via-sky-300 to-amber-200 shadow-2xl shadow-cyan-500/50 border-2 border-cyan-200/60 overflow-hidden bg-slate-950 flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
                <img
                  src="/saba-maintenance.gif"
                  alt="Sameko Saba Maintenance"
                  className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                />
              </picture>
            </div>

            {/* Click to Cheer Hint Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 font-extrabold text-[11px] px-3 py-0.5 rounded-full shadow-lg shadow-cyan-500/40 border border-cyan-200 transition">
              ✨ Klik Saba untuk Semangat!
            </div>
          </div>

          {/* Kaniki Mascot (Hardhat Technician Crab) */}
          <div 
            className="absolute -bottom-4 -right-6 sm:-right-10 flex flex-col items-center animate-crab-scuttle cursor-pointer"
            onClick={handleCheer}
            title="Kaniki: Engineering on duty! 🦀🔧"
          >
            {/* Yellow Hardhat */}
            <div className="w-8 h-4 bg-yellow-400 rounded-t-full border border-yellow-600 shadow-md flex items-center justify-center -mb-1 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
            </div>
            {/* Custom Crab Sticker & Tools */}
            <div className="w-16 h-12 relative filter drop-shadow-md select-none flex items-center justify-center">
              <img src="/stickers/saba-crab.png" alt="Kaniki Crab" className="w-full h-full object-contain" />
              <span className="absolute -top-1 -right-2 text-base">🔧</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-400/40 shadow mt-0.5">
              Kaniki
            </span>
          </div>
        </div>

        {/* Dynamic Saba Dialogue Speech Bubble */}
        <div 
          onClick={() => setDialogueIndex((prev) => (prev + 1) % DIALOGUES.length)}
          className="relative max-w-xl mx-auto mb-8 cursor-pointer group"
          title="Klik untuk dialog berikutnya!"
        >
          <div className="relative bg-slate-900/85 backdrop-blur-xl border border-cyan-400/40 hover:border-cyan-300 px-6 py-4 rounded-2xl shadow-xl shadow-cyan-950/60 transition-all duration-300 group-hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-1.5 justify-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <img src="/stickers/saba-boat.png" alt="Origami Boat" className="w-5 h-4 object-contain inline-block" />
                <span>Sameko Saba berkata:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">(Klik untuk ganti)</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed transition-all">
              &ldquo;{DIALOGUES[dialogueIndex]}&rdquo;
            </p>
          </div>
          {/* Bubble Pointer Tail */}
          <div className="w-4 h-4 bg-slate-900/85 border-b border-r border-cyan-400/40 rotate-45 mx-auto -mt-2 shadow-md" />
        </div>

        {/* Title & Under Maintenance Description */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            PEMELIHARAAN SISTEM BERKALA
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-400 drop-shadow-sm">
            Website Sedang Maintenance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Portal web portofolio kreatif sedang dalam perbaikan dan optimasi performa bersama tim mercusuar <strong>Sameko Saba</strong> & <strong>Kaniki Engineering</strong>.
          </p>
        </div>

        {/* Progress Bar with Swimming Shark Fin */}
        <div className="w-full max-w-lg mb-8 bg-slate-900/70 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <img src="/stickers/saba-boat.png" alt="Boat" className="w-4 h-3.5 object-contain inline-block" />
              <span>Status Kalibrasi:</span>
            </span>
            <span className="text-cyan-400 font-bold">88% Selesai</span>
          </div>

          <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-300 rounded-full transition-all duration-500 relative"
              style={{ width: "88%" }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
            {/* Swimming Fish Sticker at 88% */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-5 select-none transition-all duration-500 flex items-center justify-center"
              style={{ left: "calc(88% - 12px)" }}
            >
              <img src="/stickers/saba-fish.png" alt="Saba Fish" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5">
            <span>Durasi Maintenance: <strong className="text-slate-200">{uptimeStr}</strong></span>
            <span>Target: <strong className="text-cyan-300">Port 3000 Web</strong></span>
          </div>
        </div>

        {/* Interactive Cheer Button with Sound & Particles */}
        <div className="relative mb-10">
          <button
            onClick={handleCheer}
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-cyan-200/50"
          >
            <img src="/stickers/saba-crab.png" alt="Kaniki Crab" className="w-7 h-5 object-contain group-hover:rotate-12 transition-transform" />
            <span>Kirim Semangat ke Saba & Kaniki!</span>
            <span className="bg-slate-950/25 px-2 py-0.5 rounded-full text-xs font-mono text-slate-900">
              +{cheerCount}
            </span>
          </button>

          {/* Floating sticker particle burst */}
          {floatingParticles.map((p) => (
            <div
              key={p.id}
              className="absolute left-1/2 -top-6 pointer-events-none animate-fade-in-up"
              style={{
                transform: `translateX(${p.x}px) translateY(-40px)`,
                transition: "all 1.2s ease-out",
              }}
            >
              <img src={p.src} alt="cheer sticker" className="w-8 h-8 object-contain drop-shadow-lg" />
            </div>
          ))}
        </div>

        {/* Server Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left mb-8">
          <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Infrastruktur Host</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">Helipod.io Cloud</div>
            <div className="text-[10px] text-cyan-400 font-mono">Ubuntu 24.04 LTS</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Core REST API</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">PORT 3001 &bull; Active</div>
            <a 
              href="http://43.173.33.116:3001" 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:underline font-mono"
            >
              Periksa Endpoint &rarr;
            </a>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400">Pengembang Sistem</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">shilycia&apos;s DEV</div>
            <div className="text-[10px] text-pink-400 font-mono">Bintang Putra Adryan</div>
          </div>
        </div>

        {/* Quick Links & Emergency Contact */}
        <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-semibold">
          <a
            href="https://wa.me/6282211516084"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition"
          >
            <span>💬</span> WhatsApp Kontak Darurat
          </a>

          <a
            href="https://github.com/Shilycia"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition"
          >
            <span>🐙</span> GitHub: @Shilycia
          </a>

          <a
            href="http://43.173.33.116"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition"
          >
            <span>🏠</span> Portal Utama (Port 80)
          </a>

          {/* Admin Bypass Link (if callback or query supported) */}
          {onBypass ? (
            <button
              onClick={onBypass}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 hover:text-slate-300 transition"
            >
              🔓 Admin Bypass Preview
            </button>
          ) : (
            <Link
              href="/?bypass=true"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 hover:text-slate-300 transition"
            >
              🔓 Admin Bypass Preview
            </Link>
          )}
        </div>

      </main>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>&copy; 2026 Diyul Creative Portfolio &bull; Managed by shilycia&apos;s DEV</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            Beach Keeper: Sameko Saba
            <img src="/stickers/saba-fish.png" alt="Saba Fish" className="w-4 h-3 object-contain inline-block" />
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1.5">
            Crab Mascot: Kaniki
            <img src="/stickers/saba-crab.png" alt="Kaniki Crab" className="w-4.5 h-3.5 object-contain inline-block" />
          </span>
        </div>
      </footer>

    </div>
  );
}
