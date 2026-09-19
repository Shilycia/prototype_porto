import { Injectable, Logger } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto.js';
import { UpdateCertificateDto } from './dto/update-certificate.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../upload/storage.service.js';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async create(createDto: CreateCertificateDto) {
    return this.prisma.certificate.create({
      data: createDto as any,
    });
  }

  async findAll() {
    return this.prisma.certificate.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.certificate.findUnique({ where: { id } });
  }

  async update(id: number, updateDto: UpdateCertificateDto) {
    // If file_url is being replaced with a different URL, delete the old file
    if (updateDto.file_url) {
      try {
        const existing = await this.prisma.certificate.findUnique({ where: { id } });
        if (existing && existing.file_url && existing.file_url !== updateDto.file_url) {
          await this.storageService.deleteFileByUrl(existing.file_url);
        }
      } catch (err: any) {
        this.logger.warn(`Failed cleaning up old certificate file on update: ${err.message}`);
      }
    }

    return this.prisma.certificate.update({
      where: { id },
      data: updateDto as any,
    });
  }

  async remove(id: number) {
    // Auto-delete certificate file before deleting record
    try {
      const cert = await this.prisma.certificate.findUnique({ where: { id } });
      if (cert?.file_url) {
        await this.storageService.deleteFileByUrl(cert.file_url);
      }
    } catch (err: any) {
      this.logger.warn(`Failed deleting certificate file from storage: ${err.message}`);
    }

    return this.prisma.certificate.delete({ where: { id } });
  }
}