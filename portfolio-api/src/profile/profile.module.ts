import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { UploadModule } from '../upload/upload.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [UploadModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
