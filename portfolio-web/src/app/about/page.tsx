import Link from 'next/link';
import ScrollReveal from '../../components/ScrollReveal';
import CyberAperture from '../../components/CyberAperture';
import SectionDivider from '../../components/SectionDivider';
import Icon from '../../components/Icon';
import Nebula from '../../components/Nebula';
import { resolveMediaUrl } from '../../lib/media';

async function getProfile() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://43.173.33.116:3001'}/profile`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getExperiences() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/experience`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const SKILL_DOMAINS = [
  {
    category: 'Visual & Photography',
    icon: 'photo_camera',
    skills: ['Commercial Lookbook', 'Editorial Fashion', 'Architecture & Spaces', 'Chiaroscuro Lighting', 'Location Scouting'],
  },
  {
    category: 'Cinematography & Video',
    icon: 'movie',
    skills: ['Cinematic Storytelling', 'Advanced Color Grading', 'Commercial Ads', 'Music Videos', 'Post-Production'],
  },
  {
    category: 'Art Direction & Concept',
    icon: 'palette',
    skills: ['Creative Strategy', 'Brand Visual Identity', 'Moodboard Direction', 'Visual Aesthetics', 'Set Styling'],
  },
  {
    category: 'Hardware & Software',
    icon: 'terminal',
    skills: ['DaVinci Resolve Studio', 'Adobe Premiere Pro', 'Lightroom Classic', 'Sony Cinema Line', 'Studio Strobe Lights'],
  },
];

export default async function AboutPage() {
  const profiles = await getProfile();
  const experiences = await getExperiences();
  const profile = profiles.length > 0 ? profiles[0] : null;
  const resolvedPhoto = resolveMediaUrl(profile?.foto_profile);
  const profilePhoto = resolvedPhoto && !resolvedPhoto.includes('unsplash')
    ? resolvedPhoto
    : '/profile-transparent.png';

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>

      {/* ===================== SECTION 1: HERO PROFILE (THEMATIC LENS BACKGROUND) ===================== */}
      <div className="relative py-24 sm:py-28 px-6 overflow-hidden bg-gradient-to-b from-purple-950/25 via-black to-black">
        {/* Ambient Top Glow & Cosmic Nebulae */}
        <Nebula variant="fuchsia" size="lg" position="top-right" direction="normal" intensity="normal" />
        <Nebula variant="indigo" size="md" position="bottom-left" direction="reverse" intensity="subtle" />
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[650px] h-[350px] bg-purple-800/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Avatar & Cyber Aperture Spiral on the Left */}
          <ScrollReveal delay={100} direction="zoom">
            <div className="flex-shrink-0 relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Thematic Spiral Hologram (Positioned directly behind portrait on the left) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <CyberAperture position="center" className="opacity-75" />
              </div>

              {/* Ambient Head Halo Glow */}
              <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-purple-600/30 blur-[70px] pointer-events-none" />

              {/* Clean Cutout Photo (WITHOUT background or box) */}
              <div className="relative z-10 w-60 sm:w-72 md:w-80 flex items-center justify-center group">
                <img
                  src={profilePhoto}
                  alt={profile?.nama || 'Diyul Maulana'}
                  decoding="async"
                  className="w-full h-auto max-h-[350px] sm:max-h-[400px] object-contain select-none pointer-events-none drop-shadow-[0_15px_40px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-500"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                  }}
                />

                {/* Minimalist Techno Targeting Brackets & Telemetry */}
                <div className="absolute -inset-1 pointer-events-none">
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400/80" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400/80" />
                  <div className="absolute bottom-6 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-400/80" />
                  <div className="absolute bottom-6 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-400/80" />

                  {/* Techno Telemetry HUD Badge */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/85 border border-purple-500/50 backdrop-blur-md text-[10px] font-mono text-purple-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(147,51,234,0.35)] whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>OPTICAL CORE // LOCKED</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bio & Intro */}
          <div className="flex-1 text-center md:text-left">
            <ScrollReveal delay={150} direction="up">
              <p className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs tracking-[0.2em] uppercase mb-4 border border-purple-900/40 bg-purple-950/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                <span className="text-purple-400 font-bold">{'{'}</span>
                Director Profile
                <span className="text-purple-400 font-bold">{'}'}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={250} direction="up">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white">
                {profile?.nama || 'Diyul Maulana'}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={350} direction="up">
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-6">
                {profile?.deskripsi_diri || 'Seorang creative professional yang berfokus pada storytelling visual melalui fotografi, video, dan desain grafis modern.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={450} direction="up">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Icon name="location_on" size={16} className="text-purple-400" />
                  Indonesia
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1.5">
                  <Icon name="verified" size={16} fill={true} className="text-purple-400" />
                  3+ Years Industry Experience
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Available for Projects
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 2: SKILLS & CREATIVE ARSENAL ===================== */}
      <div className="py-24 px-6 bg-black relative overflow-hidden section-deferred">
        {/* Ambient Cosmic Nebulae filling empty sides */}
        <Nebula variant="cosmic" size="xl" position="top-left" direction="normal" intensity="normal" />
        <Nebula variant="purple" size="lg" position="bottom-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="center-left" direction="reverse" intensity="subtle" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center md:text-left mb-16">
            <ScrollReveal delay={50} direction="up">
              <p className="text-purple-400 font-bold text-sm tracking-widest uppercase mb-3">Capabilities</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">Creative Arsenal</h2>
              <p className="text-gray-400 text-base sm:text-lg mt-3 max-w-xl">
                Keahlian teknis dan pendekatan artistik yang diterapkan dalam setiap produksi visual.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILL_DOMAINS.map((domain, idx) => (
              <ScrollReveal key={domain.category} delay={idx * 90} direction="up">
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300">
                      <Icon name={domain.icon} size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                      {domain.category}
                    </h3>
                    <ul className="space-y-2">
                      {domain.skills.map((s) => (
                        <li key={s} className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 3: EXPERIENCE TIMELINE (THEMATIC NODES) ===================== */}
      <div className="py-24 px-6 overflow-hidden bg-gradient-to-b from-black via-purple-950/15 to-black relative section-deferred">
        {/* Cosmic Nebulae */}
        <Nebula variant="purple" size="lg" position="bottom-left" direction="reverse" intensity="subtle" />
        <Nebula variant="cosmic" size="md" position="top-right" direction="normal" intensity="normal" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-fuchsia-900/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal delay={50} direction="up">
            <p className="text-purple-400 font-bold text-sm tracking-widest uppercase mb-3">Track Record</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-16 text-white">Experience &amp; Career</h2>
          </ScrollReveal>

          {experiences.length === 0 ? (
            <ScrollReveal delay={100} direction="zoom">
              <div className="text-center py-20 text-gray-500 border border-dashed border-purple-900/30 rounded-2xl bg-purple-950/10">
                <p className="text-lg">Belum ada data pengalaman yang tercatat.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="relative">
              {/* Timeline Center Line */}
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-600 via-fuchsia-600 to-transparent hidden md:block" />

              <div className="space-y-10">
                {experiences.map((exp: any, i: number) => (
                  <ScrollReveal key={exp.id} delay={i * 90} direction="up">
                    <div className="relative md:pl-16">
                      {/* Glowing Nodal Point */}
                      <div className="hidden md:flex absolute left-0 top-6 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>

                      {/* Glass Timeline Card */}
                      <div className="glass-card rounded-2xl p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{exp.nama_pengalaman}</h3>
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-800/40 text-purple-300 text-sm font-semibold shrink-0">
                            {new Date(exp.tanggal_mulai).getFullYear()}
                            {' – '}
                            {exp.tanggal_selesai ? new Date(exp.tanggal_selesai).getFullYear() : 'Present'}
                          </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{exp.deskripsi}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 4: INVITATION CTA BANNER ===================== */}
      <div className="py-24 px-6 bg-black text-center relative overflow-hidden section-deferred">
        {/* Cosmic Nebulae framing CTA */}
        <Nebula variant="cosmic" size="xl" position="center" direction="normal" intensity="vibrant" />
        <Nebula variant="fuchsia" size="lg" position="center-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="bottom-left" direction="normal" intensity="subtle" />

        <div className="max-w-3xl mx-auto relative z-10">
          <ScrollReveal delay={100} direction="up">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
              Siap Mewujudkan <span className="text-shimmer">Visi Kreatif Anda?</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Diskusikan kebutuhan visual storytelling Anda bersama saya sekarang.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300} direction="up">
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-base shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 group"
            >
              Hubungi Saya
              <Icon name="arrow_forward" size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </ScrollReveal>
        </div>
      </div>

    </div>
  );
}
