import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../upload/storage.service.js';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: createProfileDto as any,
    });
  }

  async findAll() {
    return this.prisma.profile.findMany();
  }

  async findOne(id: number) {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    // If foto_profile is being replaced with a new photo, clean up old photo from storage
    if (updateProfileDto.foto_profile) {
      try {
        const existing = await this.prisma.profile.findUnique({ where: { id } });
        if (
          existing &&
          existing.foto_profile &&
          existing.foto_profile !== updateProfileDto.foto_profile &&
          !existing.foto_profile.startsWith('/') // don't delete local static default asset
        ) {
          await this.storageService.deleteFileByUrl(existing.foto_profile);
        }
      } catch (err: any) {
        this.logger.warn(`Failed cleaning up old profile photo: ${err.message}`);
      }
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto as any,
    });
  }

  async remove(id: number) {
    return this.prisma.profile.delete({ where: { id } });
  }
}
