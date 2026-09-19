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

  private normalizeProfile<T extends { foto_profile?: string | null }>(profile: T | null): T | null {
    if (!profile) return null;
    if (profile.foto_profile) {
      const defaultUrl = 'http://43.173.33.116:3001';
      const baseUrl = (process.env.API_BASE_URL || defaultUrl).replace(/\/+$/, '');
      if (
        profile.foto_profile.startsWith('http://localhost:3001') ||
        profile.foto_profile.startsWith('http://127.0.0.1:3001') ||
        profile.foto_profile.startsWith('http://10.0.2.2:3001')
      ) {
        profile.foto_profile = profile.foto_profile.replace(/^https?:\/\/[^/]+/, baseUrl);
      }
    }
    return profile;
  }

  async create(createProfileDto: CreateProfileDto) {
    const res = await this.prisma.profile.create({
      data: createProfileDto as any,
    });
    return this.normalizeProfile(res);
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany();
    return profiles.map((p) => this.normalizeProfile(p));
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    return this.normalizeProfile(profile);
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    // If foto_profile is being replaced with a new photo, clean up old photo from storage
    if (updateProfileDto.foto_profile) {
      try {
        const existing = await this.prisma.profile.findUnique({ where: { id } });
        if (
          existing &&
          existing.foto_profile &&
          !existing.foto_profile.startsWith('/') // don't delete local static default asset
        ) {
          const oldFileId = this.storageService.extractFileId(existing.foto_profile);
          const newFileId = this.storageService.extractFileId(updateProfileDto.foto_profile);
          if (oldFileId && newFileId && oldFileId !== newFileId) {
            await this.storageService.deleteFile(oldFileId);
          }
        }
      } catch (err: any) {
        this.logger.warn(`Failed cleaning up old profile photo: ${err.message}`);
      }
    }

    const res = await this.prisma.profile.update({
      where: { id },
      data: updateProfileDto as any,
    });
    return this.normalizeProfile(res);
  }

  async remove(id: number) {
    return this.prisma.profile.delete({ where: { id } });
  }
}
