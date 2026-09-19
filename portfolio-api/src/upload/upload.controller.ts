import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService, UploadResult } from './storage.service.js';

@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
      },
    })
  )
  async uploadFile(@UploadedFile() file: any): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan dalam request.');
    }

    return await this.storageService.uploadFile(file);
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    const success = await this.storageService.deleteFile(fileId);
    return {
      success,
      message: success
        ? 'File berhasil dihapus dari penyimpanan.'
        : 'File tidak ditemukan atau gagal dihapus.',
    };
  }
}
