import { Module } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
