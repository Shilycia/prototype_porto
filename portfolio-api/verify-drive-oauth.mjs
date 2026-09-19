import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

function parseFolderId(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const folderMatch = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return trimmed.split('?')[0].split('&')[0];
}

async function testOAuth() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('File .env tidak ditemukan!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  let clientId = null;
  let clientSecret = null;
  let refreshToken = null;
  let rawFolderId = null;

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('GOOGLE_CLIENT_ID')) clientId = trimmed.split('=')[1]?.trim().replace(/^"+|"+$/g, '');
    if (trimmed.startsWith('GOOGLE_CLIENT_SECRET')) clientSecret = trimmed.split('=')[1]?.trim().replace(/^"+|"+$/g, '');
    if (trimmed.startsWith('GOOGLE_REFRESH_TOKEN')) refreshToken = trimmed.split('=')[1]?.trim().replace(/^"+|"+$/g, '');
    if (trimmed.startsWith('GOOGLE_DRIVE_FOLDER_ID')) rawFolderId = trimmed.split('=')[1]?.trim().replace(/^"+|"+$/g, '');
  }

  const folderId = parseFolderId(rawFolderId);

  console.log('=== Google Drive OAuth 2.0 Verification ===');
  console.log('Client ID     :', clientId ? clientId.substring(0, 20) + '...' : '(Kosong)');
  console.log('Client Secret :', clientSecret ? 'TERSEDIA' : '(Kosong)');
  console.log('Refresh Token :', refreshToken ? refreshToken.substring(0, 15) + '...' : '(Kosong)');
  console.log('Folder ID     :', folderId || '(Root Folder)');

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('\n❌ Harap lengkapi GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, dan GOOGLE_REFRESH_TOKEN di file .env!');
    process.exit(1);
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    console.log('\nMenguji upload ke Google Drive...');
    const stream = Readable.from(Buffer.from('Tes koneksi Google Drive OAuth berhasil!'));
    const res = await drive.files.create({
      requestBody: {
        name: 'test_oauth_drive.txt',
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: 'text/plain',
        body: stream,
      },
      fields: 'id, name, webViewLink',
    });

    console.log('✅ BERHASIL UPLOAD! ID Berkas:', res.data.id);
    console.log('Tautan Berkas:', res.data.webViewLink);

    // Set permission
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });
    console.log('✅ Izin publik reader berhasil diset.');

    // Cleanup
    await drive.files.delete({ fileId: res.data.id });
    console.log('✅ Pembersihan berkas uji coba selesai.');
    console.log('\n🎉 SEMUA KREDENSIAL GOOGLE DRIVE OAUTH 2.0 VALID DAN BERJALAN SEMPURNA!');
  } catch (err) {
    console.error('\n❌ Gagal mengakses Google Drive:', err.message);
    if (err.response?.data) {
      console.error('Detail Error:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

testOAuth();
