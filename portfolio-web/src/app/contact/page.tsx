import ScrollReveal from '../../components/ScrollReveal';
import ParallaxCard from '../../components/ParallaxCard';
import SectionDivider from '../../components/SectionDivider';
import CyberAperture from '../../components/CyberAperture';
import Icon from '../../components/Icon';
import Nebula from '../../components/Nebula';

async function getContact() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/contact`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CONTACT_LINKS = [
  {
    key: 'email',
    label: 'Email Langsung',
    iconName: 'mail',
    href: (v: string) => `mailto:${v}`,
    desc: 'Untuk proposal, penawaran proyek, atau briefing resmi.',
  },
  {
    key: 'nomor_telepon',
    label: 'WhatsApp / Telepon',
    iconName: 'chat',
    href: (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`,
    desc: 'Respon cepat untuk pertanyaan langsung dan konsultasi.',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    iconName: 'photo_camera',
    href: (v: string) => `https://instagram.com/${v.replace('@', '')}`,
    desc: 'Galeri karya harian dan cuplikan balik layar (behind the scene).',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn Profesional',
    iconName: 'badge',
    href: (v: string) => v,
    desc: 'Jejaring profesional dan riwayat kolaborasi korporat.',
  },
  {
    key: 'basis_lokasi',
    label: 'Lokasi Studio & Basis',
    iconName: 'location_on',
    href: null,
    desc: 'Menerima penugasan di seluruh kota di Indonesia & internasional.',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Konsultasi & Discovery',
    desc: 'Diskusikan visi, referensi visual, jadwal, dan ekspektasi hasil dari proyek Anda.',
    icon: 'chat_bubble',
  },
  {
    step: '02',
    title: 'Produksi & Pengambilan Gambar',
    desc: 'Eksekusi pemotretan atau syuting dengan tata cahaya dan komposisi sinematik tingkat tinggi.',
    icon: 'videocam',
  },
  {
    step: '03',
    title: 'Grading & Penyerahan Final',
    desc: 'Pengolahan warna presisi, kurasi ketat, dan revisi hingga hasil akhir memuaskan.',
    icon: 'auto_awesome',
  },
];

export default async function ContactPage() {
  const contacts = await getContact();
  const contact = contacts.length > 0 ? contacts[0] : null;

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}>

      {/* ===================== SECTION 1: HEADER (THEMATIC LENS GLOW) ===================== */}
      <div className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-purple-950/25 via-black to-black">
        {/* Ambient Cosmic Nebulae */}
        <Nebula variant="cosmic" size="lg" position="top-right" direction="normal" intensity="normal" />
        <Nebula variant="cyan" size="md" position="bottom-left" direction="reverse" intensity="subtle" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-800/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <ScrollReveal delay={50} direction="up">
            <p className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs tracking-[0.2em] uppercase mb-4 border border-purple-900/40 bg-purple-950/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.15)]">
              <span className="text-purple-400 font-bold">{'{'}</span>
              Get in Touch
              <span className="text-purple-400 font-bold">{'}'}</span>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              Let's create something <span className="text-shimmer">together.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={250} direction="up">
            <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-8">
              Tertarik untuk berkolaborasi, memiliki pertanyaan seputar proyek visual, atau ingin berdiskusi? Saya siap mendengarkan.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={350} direction="up">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-green-950/30 border border-green-700/40 text-green-400 text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Status: Terbuka untuk Penugasan Baru (Freelance &amp; Komersial)
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 2: CONTACT CHANNELS ===================== */}
      <section className="relative w-full py-16 px-6 bg-black overflow-hidden section-deferred">
        {/* Ambient Cosmic Nebulae filling empty space */}
        <Nebula variant="fuchsia" size="xl" position="top-left" direction="normal" intensity="normal" />
        <Nebula variant="purple" size="lg" position="bottom-right" direction="reverse" intensity="normal" />
        <Nebula variant="cyan" size="md" position="center-right" direction="normal" intensity="subtle" />

        <div className="max-w-6xl mx-auto relative z-10">
        {contact ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTACT_LINKS.map((item, i) => {
              const value = contact[item.key];
              if (!value) return null;
              const href = item.href ? item.href(value) : null;

              return (
                <ScrollReveal key={item.key} delay={i * 80} direction="up">
                  <ParallaxCard className="rounded-2xl h-full">
                    <div className="glass-card rounded-2xl p-7 group flex flex-col justify-between h-full">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:text-purple-200 transition-all duration-300">
                          <Icon name={item.iconName} size={24} />
                        </div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5">{item.label}</p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white text-base sm:text-lg font-bold hover:text-purple-300 transition-colors break-all block mb-2"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-white text-base sm:text-lg font-bold block mb-2">{value}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-3 pt-3 border-t border-white/5 leading-relaxed">{item.desc}</p>
                    </div>
                  </ParallaxCard>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <ScrollReveal delay={100} direction="zoom">
            <div className="text-center py-24 text-gray-500 border border-dashed border-purple-900/30 rounded-2xl bg-purple-950/10">
              <Icon name="contact_mail" size={52} className="text-purple-400/60 mb-4 animate-float-slow block mx-auto" />
              <p className="text-lg font-medium text-gray-300">Informasi kontak belum tersedia.</p>
              <p className="text-sm text-gray-500 mt-1">Data kontak dapat diisi melalui backend API.</p>
            </div>
          </ScrollReveal>
        )}
        </div>
      </section>

      {/* Seamless Transition Divider */}
      <SectionDivider />

      {/* ===================== SECTION 3: COLLABORATION PROCESS (THEMATIC APERTURE OBJECT) ===================== */}
      <div className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-black via-purple-950/15 to-black section-deferred">
        {/* Thematic Lens Hologram & Cosmic Nebulae */}
        <CyberAperture />
        <Nebula variant="cosmic" size="xl" position="center-right" direction="normal" intensity="normal" />
        <Nebula variant="cyan" size="md" position="bottom-left" direction="reverse" intensity="subtle" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal delay={50} direction="up">
              <p className="text-purple-400 font-bold text-sm tracking-widest uppercase mb-3">Working Flow</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Proses Kolaborasi
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mt-3 max-w-lg mx-auto">
                Alur kerja yang terstruktur dan transparan untuk memastikan visi Anda terealisasi sempurna.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((p, idx) => (
              <ScrollReveal key={p.step} delay={idx * 100} direction="up">
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300 h-full">
                  <span className="text-5xl font-black text-purple-900/40 group-hover:text-purple-600/40 transition-colors block mb-4 font-mono">
                    {p.step}
                  </span>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={p.icon} size={20} className="text-purple-400" />
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
