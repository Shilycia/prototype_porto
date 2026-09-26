import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service.js';
import { ExperienceController } from './experience.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
