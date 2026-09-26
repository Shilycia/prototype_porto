import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service.js';
import { CertificatesController } from './certificates.controller.js';
import { UploadModule } from '../upload/upload.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [UploadModule, AuthModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
