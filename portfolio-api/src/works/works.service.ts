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

  private normalizeWork<T extends { media_urls?: string[]; dokumen_url?: string | null }>(work: T | null): T | null {
    if (!work) return null;
    const defaultUrl = 'http://43.173.33.116:3001';
    const baseUrl = (process.env.API_BASE_URL || defaultUrl).replace(/\/+$/, '');

    const fixUrl = (url: string): string => {
      if (
        url.startsWith('http://localhost:3001') ||
        url.startsWith('http://127.0.0.1:3001') ||
        url.startsWith('http://10.0.2.2:3001')
      ) {
        return url.replace(/^https?:\/\/[^/]+/, baseUrl);
      }
      if (url.startsWith('/uploads/')) {
        return `${baseUrl}${url}`;
      }
      return url;
    };

    if (work.media_urls && Array.isArray(work.media_urls)) {
      work.media_urls = work.media_urls.map(fixUrl);
    }
    if (work.dokumen_url) {
      work.dokumen_url = fixUrl(work.dokumen_url);
    }
    return work;
  }

  async create(createDto: CreateWorkDto) {
    const res = await this.prisma.work.create({
      data: createDto,
    });
    return this.normalizeWork(res);
  }

  async findAll() {
    const works = await this.prisma.work.findMany({
      orderBy: { created_at: 'desc' },
    });
    return works.map((w) => this.normalizeWork(w));
  }

  async findOne(id: number) {
    const work = await this.prisma.work.findUnique({ where: { id } });
    return this.normalizeWork(work);
  }

  async update(id: number, updateDto: UpdateWorkDto) {
    // If media_urls changed, clean up removed files from storage
    if (updateDto.media_urls) {
      try {
        const existing = await this.prisma.work.findUnique({ where: { id } });
        if (existing && existing.media_urls) {
          const newFileIds = new Set(
            updateDto.media_urls
              .map((u) => this.storageService.extractFileId(u))
              .filter(Boolean)
          );
          for (const oldUrl of existing.media_urls) {
            const oldId = this.storageService.extractFileId(oldUrl);
            if (oldId && !newFileIds.has(oldId)) {
              await this.storageService.deleteFile(oldId);
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`Failed cleaning up removed media files on work update: ${err.message}`);
      }
    }

    const res = await this.prisma.work.update({
      where: { id },
      data: updateDto,
    });
    return this.normalizeWork(res);
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