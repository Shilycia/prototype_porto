export class CreateWorkDto {
  nama_karya?: string;
  deskripsi?: string;
  tanggal_pembuatan?: string | Date | null;
  log_proses?: string | null;
  media_urls?: string[];
  dokumen_url?: string | null;
  kategori?: string | null;
}
