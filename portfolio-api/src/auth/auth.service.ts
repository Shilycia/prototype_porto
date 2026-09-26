import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private readonly tokenLifetimeSeconds = 60 * 60 * 12;

  private get tokenSecret(): string {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('AUTH_TOKEN_SECRET must be set to a value of at least 32 characters.');
    }
    return secret;
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.tokenSecret).update(payload).digest('base64url');
  }

  private createAccessToken(username: string): string {
    const payload = Buffer.from(JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + this.tokenLifetimeSeconds })).toString('base64url');
    return `${payload}.${this.sign(payload)}`;
  }

  verifyAccessToken(token: string): boolean {
    const [payload, signature, ...rest] = token.split('.');
    if (!payload || !signature || rest.length > 0) return false;

    const expectedSignature = this.sign(payload);
    const received = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;

    try {
      const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub?: string; exp?: number };
      return typeof data.sub === 'string' && typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  async login(body: import('./dto/login.dto.js').LoginDto) {
    const { username, password } = body;
    const admin = await this.prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.createAccessToken(admin.username),
      expires_in: this.tokenLifetimeSeconds,
      message: 'Login successful',
    };
  }
}
