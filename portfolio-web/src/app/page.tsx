import Link from 'next/link';
import HeroSection from '../components/HeroSection';
import ParallaxCard from '../components/ParallaxCard';
import CyberAperture from '../components/CyberAperture';
import Typewriter from '../components/Typewriter';
import ScrollReveal from '../components/ScrollReveal';
import SectionDivider from '../components/SectionDivider';
import Icon from '../components/Icon';
import Nebula from '../components/Nebula';
import { resolveMediaUrl } from '../lib/media';

async function getWorks() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://43.173.33.116:3001'}/works`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const works = await getWorks();

  return (
    <div className="flex flex-col bg-black text-white overflow-hidden" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>

      {/* ===================== HERO SECTION (3D Mouse & Scroll Parallax) ===================== */}
      <HeroSection />

      {/* Modern High-Tech Section Divider */}
      <SectionDivider />

      {/* ===================== SECTION 2: STATS BAND ===================== */}
      <section className="relative z-10 py-16 px-6 bg-black overflow-hidden section-deferred">
        {/* Ambient Cosmic Nebulae on empty sides */}
        <Nebula variant="cyan" size="md" position="center-left" direction="normal" intensity="normal" />
        <Nebula variant="purple" size="md" position="center-right" direction="reverse" intensity="normal" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: '3+', label: 'Years Experience' },
            { value: '50+', label: 'Projects Delivered' },
            { value: '100%', label: 'Client Satisfaction' },
            { value: '∞', label: 'Creative Ideas' },
          ].map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 100} direction="up">
              <div className="p-4 flex flex-col items-center group">
                <span className="text-4xl sm:text-6xl font-black text-gradient-purple block mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Seamless Divider */}
      <SectionDivider />

      {/* ===================== SECTION 3: VISI & MISI (THEMATIC CYBER LENS APERTURE OBJECT) ===================== */}
      <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-black via-purple-950/15 to-black section-deferred">
        {/* Thematic Background Object: Rotating Cyber Camera Lens Aperture */}
        <CyberAperture />

        {/* Ambient deep glows & Cosmic Nebulae */}
        <Nebula variant="cosmic" size="lg" position="top-right" direction="reverse" intensity="normal" />
        <Nebula variant="indigo" size="md" position="bottom-left" direction="normal" intensity="subtle" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-900/15 blur-[120px] rounded-full pointer-events-none animate-float-slow" />
        <div className="absolute right-0 bottom-10 w-[350px] h-[350px] bg-fuchsia-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

          {/* LEFT COLUMN: Vision & Mission Pillars */}
          <div className="flex-1 w-full">
            <ScrollReveal delay={50} direction="up">
              <p className="inline-flex items-center gap-2 text-gray-400 font-mono text-xs tracking-[0.2em] uppercase mb-6 border border-purple-900/40 bg-purple-950/20 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                <span className="text-purple-400 font-bold">{'{'}</span>
                Visi &amp; Misi
                <span className="text-purple-400 font-bold">{'}'}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="up">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] mb-6 text-white min-h-[3.5rem]">
                <Typewriter
                  text="Mengabadikan setiap momen menjadi karya yang bermakna."
                  speed={32}
                  startDelay={150}
                  className="text-white"
                />
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={250} direction="up">
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed min-h-[4.5rem]">
                <Typewriter
                  text="Setiap proyek adalah sebuah perjalanan estetika — dari konsep yang matang hingga hasil akhir yang memukau. Visi saya adalah menghadirkan visual storytelling yang kuat, berkarakter, dan tak lekang oleh waktu."
                  speed={16}
                  startDelay={600}
                  cursor={false}
                />
              </p>
            </ScrollReveal>

            {/* Mission pillars with staggered entrance */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'center_focus_strong', title: 'Presisi', desc: 'Setiap detail komposisi dan warna diperhatikan dengan seksama.' },
                { icon: 'palette', title: 'Kreativitas', desc: 'Ide segar, dinamis, dan pendekatan visual autentik di setiap karya.' },
                { icon: 'verified', title: 'Konsistensi', desc: 'Standar kualitas tinggi yang terjaga dari konsep hingga eksekusi.' },
                { icon: 'handshake', title: 'Kolaborasi', desc: 'Komunikasi erat bersama klien untuk mewujudkan visi bersama.' },
              ].map((p, idx) => (
                <ScrollReveal key={p.title} delay={300 + idx * 80} direction="up">
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-purple-900/20 hover:border-purple-500/40 hover:bg-purple-950/20 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300 shrink-0">
                      <Icon name={p.icon} size={22} fill={p.icon === 'verified'} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors">{p.title}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Quote Card */}
          <div className="flex-1 lg:max-w-md w-full">
            <ScrollReveal delay={200} direction="left">
              <div className="glass-card rounded-2xl p-8 relative overflow-hidden group">
                {/* Floating ambient glow in card */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Big decorative quote watermark */}
                <div className="absolute -top-6 -left-2 text-8xl font-black text-purple-600/15 select-none leading-none pointer-events-none font-serif">
                  “
                </div>

                <div className="relative z-10 mb-8 min-h-[7.5rem]">
                  <p className="text-gray-200 text-lg sm:text-xl leading-relaxed font-light">
                    <Typewriter
                      text={`"Misi saya adalah menghidupkan setiap cerita lewat lensa — menangkap emosi, keindahan, dan keautentikan yang bernilai abadi dalam setiap frame."`}
                      speed={24}
                      startDelay={350}
                    />
                  </p>
                </div>

                {/* Author profile block */}
                <div className="flex items-center gap-4 border-t border-white/5 pt-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(147,51,234,0.4)] shrink-0">
                    D
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Diyul</p>
                    <p className="text-gray-400 text-xs font-medium">Photographer &amp; Creative Director</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400">
                      <Icon name="verified" size={18} fill={true} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Collaboration Pill Badge */}
            <ScrollReveal delay={400} direction="up">
              <div className="mt-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-950/20 border border-purple-800/30 backdrop-blur-sm shadow-[0_0_20px_rgba(147,51,234,0.1)]">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                <span className="text-purple-300 text-sm font-semibold">
                  Terbuka untuk kolaborasi karya &amp; proyek kreatif
                </span>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* Seamless Divider */}
      <SectionDivider />

      {/* ===================== SECTION 4: FEATURED WORKS ===================== */}
      <section className="relative py-24 px-6 bg-black overflow-hidden section-deferred">
        {/* Cosmic Nebulae framing the works gallery in the empty void */}
        <Nebula variant="cosmic" size="xl" position="top-left" direction="normal" intensity="normal" />
        <Nebula variant="fuchsia" size="lg" position="bottom-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="center-right" direction="normal" intensity="subtle" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <ScrollReveal delay={50} direction="up">
              <div>
                <p className="text-purple-400 font-bold text-sm tracking-widest uppercase mb-3">Portfolio</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Latest Works</h2>
                <p className="text-gray-400 mt-3 max-w-lg text-base sm:text-lg">
                  Koleksi karya terbaru yang mengeksplorasi sinematografi, fotografi, dan seni visual.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="left">
              <Link
                href="/works"
                className="hidden md:inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group mt-4 md:mt-0 transition-colors"
              >
                View all works
                <Icon name="arrow_forward" size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Work Cards Grid */}
          {works.length === 0 ? (
            <ScrollReveal delay={100} direction="zoom">
              <div className="text-center py-24 text-gray-500 border border-dashed border-purple-900/30 rounded-2xl bg-purple-950/10">
                <Icon name="photo_library" size={52} className="text-purple-400/60 mb-4 animate-float-slow block mx-auto" />
                <p className="text-lg font-medium text-gray-300">Belum ada karya yang diunggah.</p>
                <p className="text-sm text-gray-500 mt-1">Karya yang ditambahkan melalui admin API akan langsung muncul di sini.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.slice(0, 6).map((work: any, i: number) => (
                <ScrollReveal key={work.id} delay={i * 80} direction="up">
                  <ParallaxCard className="rounded-2xl">
                    <div className="glass-card rounded-2xl overflow-hidden group h-full">
                      {/* Image / Media Container */}
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                        {work.media_urls?.length > 0 ? (
                          <img
                            src={resolveMediaUrl(work.media_urls[0])}
                            alt={work.nama_karya}
                            loading="lazy"
                            decoding="async"
                            className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950/40 to-black text-gray-600 text-sm">
                            No Media
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <span className="text-xs text-white font-bold uppercase tracking-widest bg-purple-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                            View Project
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">
                          {work.kategori || 'Creative'}
                        </span>
                        <h3 className="text-xl font-bold mt-2 mb-2 text-white group-hover:text-purple-200 transition-colors">
                          {work.nama_karya}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                          {work.deskripsi}
                        </p>
                      </div>
                    </div>
                  </ParallaxCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seamless Divider */}
      <SectionDivider />

      {/* ===================== SECTION 5: CTA BANNER (THEMATIC CYBER HORIZON) ===================== */}
      <section className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black section-deferred">
        {/* Cosmic Nebulae */}
        <Nebula variant="cosmic" size="xl" position="center" direction="normal" intensity="vibrant" />
        <Nebula variant="cyan" size="lg" position="bottom-left" direction="reverse" intensity="normal" />
        <Nebula variant="fuchsia" size="md" position="top-right" direction="normal" intensity="normal" />

        {/* Thematic Ambient Horizon Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-grid opacity-30 [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal delay={100} direction="up">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Let's create something{' '}
              <span className="text-shimmer">extraordinary</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={250} direction="up">
            <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Punya ide proyek, kebutuhan dokumentasi visual, atau ingin berkolaborasi? Mari diskusikan bersama dan wujudkan karya terbaik.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400} direction="up">
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] transition-all duration-300 group"
            >
              Start a Project
              <Icon name="arrow_forward" size={20} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
