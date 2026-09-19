export class CreateCertificateDto {
  nama_sertifikat?: string;
  file_url?: string;
  tanggal?: string | Date | null;
  penerbit?: string | null;
}
