import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  nama_pengalaman: string;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_mulai: string | Date;

  @IsOptional()
  @IsDateString()
  tanggal_selesai?: string | Date | null;
}
