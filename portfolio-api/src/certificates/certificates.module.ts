import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service.js';
import { CertificatesController } from './certificates.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
