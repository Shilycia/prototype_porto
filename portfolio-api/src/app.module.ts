import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { WorksModule } from './works/works.module.js';
import { ExperienceModule } from './experience/experience.module.js';
import { CertificatesModule } from './certificates/certificates.module.js';
import { ContactModule } from './contact/contact.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    WorksModule,
    ExperienceModule,
    CertificatesModule,
    ContactModule,
    AdminModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
