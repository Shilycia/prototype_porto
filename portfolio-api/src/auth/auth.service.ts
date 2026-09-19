import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: any) {
    const { username, password } = body;
    const admin = await this.prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Basic plain text check for MVP, should use bcrypt in production
    if (admin.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // MVP Token
    return {
      access_token: 'fake-jwt-token-for-mvp-1234',
      message: 'Login successful'
    };
  }
}
