import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  nama_sertifikat: string;

  @IsString()
  @IsNotEmpty()
  file_url: string;

  @IsOptional()
  @IsDateString()
  tanggal?: string | Date | null;

  @IsOptional()
  @IsString()
  penerbit?: string | null;
}
