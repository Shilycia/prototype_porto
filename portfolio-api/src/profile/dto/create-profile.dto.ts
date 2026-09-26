import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  deskripsi_diri: string;

  @IsOptional()
  @IsString()
  foto_profile?: string | null;
}
