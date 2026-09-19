import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy data to Supabase...');

  // 1. Profile
  await prisma.profile.deleteMany();
  const profile = await prisma.profile.create({
    data: {
      nama: 'Diyul Maulana',
      deskripsi_diri:
        'Visual Storyteller, Creative Director, & Multimedia Artist berbasis di Indonesia. Berpengalaman lebih dari 3 tahun dalam memproduksi konten visual sinematik, fotografi komersial, editorial, dan arahan kreatif untuk berbagai brand independen hingga korporat.',
      foto_profile: '/profile-transparent.png',
    },
  });
  console.log('Profile seeded:', profile.nama);

  // 2. Works
  await prisma.work.deleteMany();
  const worksData = [
    {
      nama_karya: 'Neon Solitude: Urban Night Series',
      kategori: 'Photography',
      deskripsi:
        'Eksplorasi visual fotografi jalanan malam hari di tengah gemerlap lampu neon metropolitan Jakarta, menangkap refleksi kesunyian di antara hiruk pikuk kota modern.',
      media_urls: [
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2025-11-15'),
    },
    {
      nama_karya: 'Echoes of Silence: Short Cinema',
      kategori: 'Cinematography',
      deskripsi:
        'Proyek video sinematik pendek bernuansa atmosferik moody dengan gradasi warna gelap dan tata cahaya dramatis, mengangkat tema renungan personal.',
      media_urls: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2026-01-10'),
    },
    {
      nama_karya: 'Aethelgard: Dark Cyber Brand Identity',
      kategori: 'Design',
      deskripsi:
        'Pengembangan identitas visual, tipografi khusus, dan arahan seni bergaya dark-futuristic untuk studio kreatif digital internasional.',
      media_urls: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2026-02-04'),
    },
    {
      nama_karya: 'Midnight Velvet: Editorial Portrait',
      kategori: 'Editorial',
      deskripsi:
        'Sesi foto editorial fesyen konsep gelap dengan teknik pencahayaan kontras tinggi (chiaroscuro) yang menonjolkan tekstur pakaian dan ekspresi emosional model.',
      media_urls: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2025-08-20'),
    },
    {
      nama_karya: 'Aurora Spectrum: Experimental Visuals',
      kategori: 'Motion Graphics',
      deskripsi:
        'Koleksi karya visual eksperimental berbasis gelombang cahaya ultraviolet dan fluid dynamics digital untuk kebutuhan stage background konser.',
      media_urls: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2025-09-12'),
    },
    {
      nama_karya: 'Architectural Shadows: Modern Brutalism',
      kategori: 'Architecture',
      deskripsi:
        'Dokumentasi visual monokromatik sudut-sudut arsitektur brutalism dan garis geometris tegas gedung-gedung bersejarah di ibu kota.',
      media_urls: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      ],
      tanggal_pembuatan: new Date('2025-10-05'),
    },
  ];

  for (const w of worksData) {
    await prisma.work.create({ data: w });
  }
  console.log(`Seeded ${worksData.length} works.`);

  // 3. Experience
  await prisma.experience.deleteMany();
  const experiences = [
    {
      nama_pengalaman: 'Founder & Lead Creative Director — Diyul Visual Lab',
      deskripsi:
        'Memimpin arah visual, supervisi sinematografi, dan strategi kreatif untuk kampanye visual komersial, brand digital, serta video musik independen.',
      tanggal_mulai: new Date('2024-01-01'),
      tanggal_selesai: null,
    },
    {
      nama_pengalaman: 'Senior Commercial Photographer & Colorist — Lumina Studio',
      deskripsi:
        'Bertanggung jawab atas tata cahaya studio, pengolahan warna tingkat lanjut (color grading), serta pemotretan lookbook fesyen dan produk premium.',
      tanggal_mulai: new Date('2022-06-01'),
      tanggal_selesai: new Date('2023-12-31'),
    },
    {
      nama_pengalaman: 'Creative Videographer & Editor — Indie Motion Collective',
      deskripsi:
        'Memproduksi dokumenter pendek, liputan festival kreatif, dan konten video vertikal berestetika tinggi untuk media sosial dan platform streaming.',
      tanggal_mulai: new Date('2021-03-01'),
      tanggal_selesai: new Date('2022-05-31'),
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`Seeded ${experiences.length} experiences.`);

  // 4. Contact
  await prisma.contact.deleteMany();
  const contact = await prisma.contact.create({
    data: {
      email: 'contact@diyul.creative',
      nomor_telepon: '+6281234567890',
      instagram: '@diyul.raw',
      linkedin: 'https://linkedin.com/in/diyul-maulana',
      basis_lokasi: 'Jakarta Selatan, Indonesia',
    },
  });
  console.log('Contact seeded:', contact.email);

  // 5. Admin
  await prisma.admin.deleteMany();
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'adminpassword123',
    },
  });
  console.log('Admin seeded:', admin.username);

  console.log('All dummy data successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
