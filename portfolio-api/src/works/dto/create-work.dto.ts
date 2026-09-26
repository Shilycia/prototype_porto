import { IsString, IsOptional, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  nama_karya: string;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @IsOptional()
  @IsDateString()
  tanggal_pembuatan?: string | null;

  @IsOptional()
  @IsString()
  log_proses?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  media_urls?: string[];

  @IsOptional()
  @IsString()
  dokumen_url?: string | null;

  @IsOptional()
  @IsString()
  kategori?: string | null;
}
