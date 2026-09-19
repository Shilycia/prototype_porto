'use client';

export default function CyberCity() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 w-full h-[520px] sm:h-[640px] md:h-[720px] pointer-events-none overflow-hidden z-0 select-none opacity-90"
      aria-hidden="true"
    >
      {/* Searchlight Beams scanning the sky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        {/* Beam 1 */}
        <div
          className="absolute bottom-24 left-[22%] w-[1.5px] h-[650px] bg-gradient-to-t from-purple-500 via-purple-400/40 to-transparent origin-bottom animate-searchlight-1"
          style={{ filter: 'blur(2.5px)' }}
        />
        {/* Beam 2 */}
        <div
          className="absolute bottom-32 right-[28%] w-[2px] h-[720px] bg-gradient-to-t from-cyan-400 via-cyan-400/30 to-transparent origin-bottom animate-searchlight-2"
          style={{ filter: 'blur(3px)' }}
        />
        {/* Beam 3 */}
        <div
          className="absolute bottom-20 left-[65%] w-[1.5px] h-[600px] bg-gradient-to-t from-fuchsia-400 via-fuchsia-400/30 to-transparent origin-bottom animate-searchlight-3"
          style={{ filter: 'blur(2.5px)' }}
        />
      </div>

      {/* Cyber City SVG Skyline */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Cyber Gradients */}
          <linearGradient id="cyberBackTowers" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1035" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0f071d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="cyberMidTowers" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#17072e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="cyberForeTowers" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f093d" stopOpacity="1" />
            <stop offset="40%" stopColor="#0a0314" stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="cyberNeonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
          </linearGradient>

          {/* Matrix Window Pattern */}
          <pattern id="matrixWindows" width="12" height="16" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="3" height="4" fill="#a855f7" fillOpacity="0.25" />
            <rect x="7" y="2" width="3" height="4" fill="#38bdf8" fillOpacity="0.2" />
            <rect x="2" y="9" width="3" height="4" fill="#e879f9" fillOpacity="0.22" />
            <rect x="7" y="9" width="3" height="4" fill="#a855f7" fillOpacity="0.15" />
          </pattern>

          <pattern id="matrixWindowsDense" width="8" height="12" patternUnits="userSpaceOnUse">
            <rect x="1.5" y="2" width="2" height="3" fill="#c084fc" fillOpacity="0.3" />
            <rect x="4.5" y="2" width="2" height="3" fill="#38bdf8" fillOpacity="0.25" />
            <rect x="1.5" y="7" width="2" height="3" fill="#ffffff" fillOpacity="0.18" />
            <rect x="4.5" y="7" width="2" height="3" fill="#d8b4fe" fillOpacity="0.2" />
          </pattern>
        </defs>

        {/* ================= LAYER 1: Distant Spire Towers ================= */}
        <g opacity="0.45">
          {/* Spire 1 */}
          <rect x="120" y="70" width="2" height="140" fill="#a855f7" />
          <circle cx="121" cy="68" r="3" fill="#f43f5e" className="animate-ping" />
          <path d="M100 210 L121 90 L142 210 Z" fill="url(#cyberBackTowers)" />

          {/* Tower 2 */}
          <rect x="260" y="80" width="70" height="260" fill="url(#cyberBackTowers)" />
          <line x1="295" y1="40" x2="295" y2="80" stroke="#818cf8" strokeWidth="1.5" />
          <circle cx="295" cy="38" r="2.5" fill="#f43f5e" />

          {/* Spire Center-Left */}
          <rect x="480" y="50" width="90" height="290" fill="url(#cyberBackTowers)" />
          <line x1="525" y1="10" x2="525" y2="50" stroke="#c084fc" strokeWidth="2" />
          <circle cx="525" cy="8" r="3" fill="#f43f5e" className="animate-pulse" />

          {/* Tall Mega-Spire Center-Right */}
          <rect x="820" y="35" width="80" height="305" fill="url(#cyberBackTowers)" />
          <line x1="860" y1="0" x2="860" y2="35" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="860" cy="0" r="3.5" fill="#f43f5e" className="animate-ping" />

          {/* Tower Far Right */}
          <rect x="1100" y="60" width="75" height="280" fill="url(#cyberBackTowers)" />
          <line x1="1137" y1="20" x2="1137" y2="60" stroke="#c084fc" strokeWidth="1.5" />
          <circle cx="1137" cy="18" r="2.5" fill="#f43f5e" />

          <rect x="1280" y="90" width="90" height="250" fill="url(#cyberBackTowers)" />
        </g>

        {/* ================= LAYER 2: Mid-ground Skyscraper Clusters ================= */}
        <g opacity="0.8">
          {/* Building A */}
          <rect x="40" y="140" width="80" height="200" fill="url(#cyberMidTowers)" />
          <rect x="44" y="150" width="72" height="140" fill="url(#matrixWindowsDense)" />
          {/* Neon Roof Rim */}
          <line x1="40" y1="140" x2="120" y2="140" stroke="#c084fc" strokeWidth="2" />

          {/* Building B - Stepped Cyber Tower */}
          <path d="M190 340 L190 120 L210 120 L210 95 L250 95 L250 120 L270 120 L270 340 Z" fill="url(#cyberMidTowers)" />
          <rect x="212" y="105" width="36" height="180" fill="url(#matrixWindows)" />
          <line x1="210" y1="95" x2="250" y2="95" stroke="#38bdf8" strokeWidth="2" />
          {/* Antenna */}
          <line x1="230" y1="65" x2="230" y2="95" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="230" cy="63" r="2" fill="#ef4444" className="animate-pulse" />

          {/* Building C - High tech angled corporate tower */}
          <path d="M370 340 L370 140 L440 90 L440 340 Z" fill="url(#cyberMidTowers)" />
          <line x1="370" y1="140" x2="440" y2="90" stroke="url(#cyberNeonGlow)" strokeWidth="2" />
          <rect x="380" y="150" width="50" height="150" fill="url(#matrixWindowsDense)" />

          {/* Building D - Center Left Grid Tower */}
          <rect x="580" y="110" width="95" height="230" fill="url(#cyberMidTowers)" />
          <rect x="585" y="120" width="85" height="170" fill="url(#matrixWindows)" />
          <line x1="580" y1="110" x2="675" y2="110" stroke="#e879f9" strokeWidth="2" />
          <line x1="627" y1="75" x2="627" y2="110" stroke="#e879f9" strokeWidth="1.5" />
          <circle cx="627" cy="73" r="2.5" fill="#ef4444" />

          {/* Building E - Neo-Tokyo spire tower */}
          <path d="M720 340 L720 160 L750 125 L780 160 L780 340 Z" fill="url(#cyberMidTowers)" />
          <line x1="750" y1="60" x2="750" y2="125" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="750" cy="58" r="3" fill="#f43f5e" className="animate-ping" />
          <rect x="730" y="170" width="40" height="130" fill="url(#matrixWindowsDense)" />

          {/* Building F - Stepped East Tower */}
          <path d="M940 340 L940 135 L965 135 L965 105 L1010 105 L1010 135 L1035 135 L1035 340 Z" fill="url(#cyberMidTowers)" />
          <line x1="965" y1="105" x2="1010" y2="105" stroke="#c084fc" strokeWidth="2" />
          <rect x="955" y="145" width="65" height="150" fill="url(#matrixWindows)" />

          {/* Building G - Angled Diagonal Tower */}
          <path d="M1170 340 L1170 80 L1230 130 L1230 340 Z" fill="url(#cyberMidTowers)" />
          <line x1="1170" y1="80" x2="1230" y2="130" stroke="#38bdf8" strokeWidth="2" />
          <rect x="1175" y="140" width="48" height="160" fill="url(#matrixWindowsDense)" />

          {/* Building H */}
          <rect x="1310" y="130" width="85" height="210" fill="url(#cyberMidTowers)" />
          <line x1="1310" y1="130" x2="1395" y2="130" stroke="#f472b6" strokeWidth="2" />
          <rect x="1320" y="145" width="65" height="150" fill="url(#matrixWindows)" />
        </g>

        {/* ================= LAYER 3: Foreground Angular Monoliths ================= */}
        <g opacity="0.95">
          {/* Left Angular Block */}
          <path d="M0 340 L0 180 L70 180 L100 210 L100 340 Z" fill="url(#cyberForeTowers)" />
          <line x1="0" y1="180" x2="70" y2="180" stroke="#a855f7" strokeWidth="1.5" />

          {/* Monolith 2 */}
          <rect x="135" y="170" width="75" height="170" fill="url(#cyberForeTowers)" />
          <line x1="135" y1="170" x2="210" y2="170" stroke="#c084fc" strokeWidth="1.5" />
          <rect x="142" y="185" width="60" height="110" fill="url(#matrixWindowsDense)" />

          {/* Slanted Cyber Monolith 3 */}
          <path d="M300 340 L300 160 L380 200 L380 340 Z" fill="url(#cyberForeTowers)" />
          <line x1="300" y1="160" x2="380" y2="200" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Center Megastructure */}
          <path d="M640 340 L640 180 L675 155 L740 155 L775 180 L775 340 Z" fill="url(#cyberForeTowers)" />
          <line x1="675" y1="155" x2="740" y2="155" stroke="url(#cyberNeonGlow)" strokeWidth="2" />
          <line x1="707" y1="115" x2="707" y2="155" stroke="#f472b6" strokeWidth="1.5" />
          <circle cx="707" cy="113" r="2.5" fill="#f43f5e" className="animate-ping" />
          <rect x="660" y="190" width="95" height="110" fill="url(#matrixWindowsDense)" />

          {/* Right Monolith 5 */}
          <rect x="850" y="175" width="80" height="165" fill="url(#cyberForeTowers)" />
          <line x1="850" y1="175" x2="930" y2="175" stroke="#c084fc" strokeWidth="1.5" />
          <rect x="860" y="190" width="60" height="110" fill="url(#matrixWindows)" />

          {/* Angular Block 6 */}
          <path d="M1060 340 L1060 210 L1120 170 L1150 170 L1150 340 Z" fill="url(#cyberForeTowers)" />
          <line x1="1120" y1="170" x2="1150" y2="170" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Far Right Corner Block */}
          <rect x="1250" y="185" width="90" height="155" fill="url(#cyberForeTowers)" />
          <line x1="1250" y1="185" x2="1340" y2="185" stroke="#a855f7" strokeWidth="1.5" />

          <path d="M1380 340 L1380 170 L1440 170 L1440 340 Z" fill="url(#cyberForeTowers)" />
        </g>
      </svg>

      {/* Cyberpunk Ground Fog & Horizon Neon Ambient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[90px] bg-purple-600/25 rounded-full blur-[60px] pointer-events-none" />
    </div>
  );
}
