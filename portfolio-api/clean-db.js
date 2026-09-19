import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('Membersihkan database portofolio untuk persiapan deploy...');

  // 1. Hapus semua data karya portofolio
  const deletedWorks = await prisma.work.deleteMany();
  console.log(`✓ Data karya berhasil dibersihkan (${deletedWorks.count} data dihapus).`);

  // 2. Hapus semua data pengalaman / karir
  const deletedExp = await prisma.experience.deleteMany();
  console.log(`✓ Data pengalaman berhasil dibersihkan (${deletedExp.count} data dihapus).`);

  // 3. Hapus semua data sertifikat
  const deletedCert = await prisma.certificate.deleteMany();
  console.log(`✓ Data sertifikat berhasil dibersihkan (${deletedCert.count} data dihapus).`);

  // 4. Bersihkan kontak (buat record bersih kosongan)
  await prisma.contact.deleteMany();
  await prisma.contact.create({
    data: {
      email: null,
      nomor_telepon: null,
      instagram: null,
      linkedin: null,
      basis_lokasi: null,
    },
  });
  console.log('✓ Data kontak disiapkan dalam kondisi bersih (kosongan).');

  // 5. Bersihkan profil (siapkan template profil awal)
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      nama: 'Nama Anda',
      deskripsi_diri: 'Tuliskan bio atau deskripsi profil profesional Anda.',
      foto_profile: null,
    },
  });
  console.log('✓ Profil disiapkan dalam template default awal.');

  // 6. Pastikan akun Admin tetap aktif untuk login di aplikasi mobile
  await prisma.admin.deleteMany();
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'adminpassword123',
    },
  });
  console.log(`✓ Akun Admin disiapkan (Username: ${admin.username} / Password: adminpassword123).`);

  console.log('\nDatabase berhasil dikosongkan dan siap digunakan untuk production!');
}

cleanDatabase()
  .catch((e) => {
    console.error('Error saat membersihkan database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
