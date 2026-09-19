import { Controller, Get, Header, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getRoot(@Req() req: Request): string {
    const host = req?.get?.('host') || '43.173.33.116:3001';
    const protocol = req?.protocol || 'http';
    const baseUrl = `${protocol}://${host}`;
    return this.appService.getLandingHtml(baseUrl);
  }

  @Get('status')
  getStatus() {
    return this.appService.getStatusJson();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
