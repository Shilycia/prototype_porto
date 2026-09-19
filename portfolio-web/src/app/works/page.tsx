import Link from 'next/link';
import ScrollReveal from '../../components/ScrollReveal';
import ParallaxCard from '../../components/ParallaxCard';
import SectionDivider from '../../components/SectionDivider';
import Icon from '../../components/Icon';
import Nebula from '../../components/Nebula';
import { resolveMediaUrl } from '../../lib/media';

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

const CATEGORIES = ['All Works', 'Photography', 'Cinematography', 'Design', 'Editorial', 'Motion Graphics', 'Architecture'];

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>

      {/* ===================== SECTION 1: HEADER (THEMATIC LENS GLOW) ===================== */}
      <div className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-purple-950/25 via-black to-black">
        {/* Ambient Cosmic Nebulae */}
        <Nebula variant="cosmic" size="lg" position="top-right" direction="normal" intensity="normal" />
        <Nebula variant="cyan" size="md" position="bottom-left" direction="reverse" intensity="subtle" />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-700/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <ScrollReveal delay={50} direction="up">
            <p className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs tracking-[0.2em] uppercase mb-4 border border-purple-900/40 bg-purple-950/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.15)]">
              <span className="text-purple-400 font-bold">{'{'}</span>
              Creative Archive
              <span className="text-purple-400 font-bold">{'}'}</span>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              Selected <span className="text-shimmer">Works</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={250} direction="up">
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Arsip visual karya sinematografi, fotografi komersial, editorial, dan arahan seni digital yang dieksekusi dengan pendekatan estetika modern.
            </p>
          </ScrollReveal>

          {/* Category Filter Chips Bar */}
          <ScrollReveal delay={350} direction="up">
            <div className="mt-10 flex flex-wrap gap-2.5 justify-center md:justify-start">
              {CATEGORIES.map((cat, idx) => (
                <span
                  key={cat}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-default ${
                    idx === 0
                      ? 'bg-purple-600/90 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                      : 'bg-white/[0.03] text-gray-400 border border-white/5 hover:border-purple-500/30 hover:text-white'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 2: WORKS GALLERY ===================== */}
      <section className="relative w-full py-16 px-6 bg-black overflow-hidden section-deferred">
        {/* Ambient Cosmic Nebulae framing gallery in the empty void */}
        <Nebula variant="cosmic" size="xl" position="top-left" direction="normal" intensity="normal" />
        <Nebula variant="fuchsia" size="lg" position="bottom-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="center-left" direction="reverse" intensity="subtle" />
        <Nebula variant="indigo" size="md" position="center-right" direction="normal" intensity="subtle" />

        <div className="max-w-7xl mx-auto relative z-10">
        {works.length === 0 ? (
          <ScrollReveal delay={100} direction="zoom">
            <div className="text-center py-32 text-gray-500 border border-dashed border-purple-900/30 rounded-2xl bg-purple-950/10">
              <Icon name="photo_library" size={52} className="text-purple-400/60 mb-4 animate-float-slow block mx-auto" />
              <p className="text-lg font-medium text-gray-300">Belum ada karya yang diunggah.</p>
              <p className="text-sm text-gray-500 mt-1">Karya baru akan otomatis tertampil di sini saat ditambahkan.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work: any, i: number) => (
              <ScrollReveal key={work.id} delay={i * 70} direction="up">
                <ParallaxCard className="rounded-2xl h-full">
                  <div className="glass-card rounded-2xl overflow-hidden group block h-full">
                    {/* Image Container */}
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

                    {/* Info */}
                    <div className="p-6">
                      <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">
                        {work.kategori || 'Creative'}
                      </span>
                      <h3 className="text-xl font-bold mt-2 mb-2 text-white group-hover:text-purple-200 transition-colors">
                        {work.nama_karya}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{work.deskripsi}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                        <Icon name="calendar_today" size={14} className="text-purple-400/80" />
                        {work.tanggal_pembuatan
                          ? new Date(work.tanggal_pembuatan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
                          : 'Karya Terbaru'}
                      </div>
                    </div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 3: BOTTOM COLLABORATION BANNER (THEMATIC HORIZON) ===================== */}
      <div className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black section-deferred">
        {/* Cosmic Nebulae */}
        <Nebula variant="cosmic" size="xl" position="center" direction="normal" intensity="vibrant" />
        <Nebula variant="fuchsia" size="lg" position="bottom-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="top-left" direction="normal" intensity="subtle" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal delay={100} direction="up">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
              Tertarik Berkolaborasi untuk <span className="text-shimmer">Proyek Anda?</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Saya siap membantu mewujudkan konsep visual terbaik dari pra-produksi, sesi pemotretan, hingga pasca-produksi akhir.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300} direction="up">
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-base shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 group"
            >
              Hubungi Sekarang
              <Icon name="arrow_forward" size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </ScrollReveal>
        </div>
      </div>

    </div>
  );
}
