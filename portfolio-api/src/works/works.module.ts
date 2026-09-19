import { Module } from '@nestjs/common';
import { WorksService } from './works.service.js';
import { WorksController } from './works.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
