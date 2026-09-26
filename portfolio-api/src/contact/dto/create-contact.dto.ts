import { IsString, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  nomor_telepon?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  instagram?: string | null;

  @IsOptional()
  @IsString()
  linkedin?: string | null;

  @IsOptional()
  @IsString()
  basis_lokasi?: string | null;
}
