import { Injectable, Logger } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto.js';
import { UpdateWorkDto } from './dto/update-work.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../upload/storage.service.js';

@Injectable()
export class WorksService {
  private readonly logger = new Logger(WorksService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async create(createDto: CreateWorkDto) {
    return this.prisma.work.create({
      data: createDto as any,
    });
  }

  async findAll() {
    return this.prisma.work.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.work.findUnique({ where: { id } });
  }

  async update(id: number, updateDto: UpdateWorkDto) {
    // If media_urls changed, clean up removed files from storage
    if (updateDto.media_urls) {
      try {
        const existing = await this.prisma.work.findUnique({ where: { id } });
        if (existing && existing.media_urls) {
          const removedUrls = existing.media_urls.filter(
            (oldUrl) => !updateDto.media_urls!.includes(oldUrl)
          );
          for (const url of removedUrls) {
            await this.storageService.deleteFileByUrl(url);
          }
        }
      } catch (err: any) {
        this.logger.warn(`Failed cleaning up removed media files on work update: ${err.message}`);
      }
    }

    return this.prisma.work.update({
      where: { id },
      data: updateDto as any,
    });
  }

  async remove(id: number) {
    // 1. Fetch work to find associated media URLs before deletion
    try {
      const work = await this.prisma.work.findUnique({ where: { id } });
      if (work) {
        // Auto-delete each image/media in Google Drive
        if (work.media_urls && Array.isArray(work.media_urls)) {
          for (const url of work.media_urls) {
            await this.storageService.deleteFileByUrl(url);
          }
        }
        // Auto-delete document if present
        if (work.dokumen_url) {
          await this.storageService.deleteFileByUrl(work.dokumen_url);
        }
      }
    } catch (err: any) {
      this.logger.warn(`Error during auto-deletion of work media files: ${err.message}`);
    }

    // 2. Delete database record
    return this.prisma.work.delete({ where: { id } });
  }
}