import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { StorageService } from './storage.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [StorageService],
  exports: [StorageService],
})
export class UploadModule {}
