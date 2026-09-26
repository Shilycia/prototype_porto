import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: { authorization?: string } }>();
    const authorization = request.headers?.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token || !this.authService.verifyAccessToken(token)) {
      throw new UnauthorizedException('Sesi admin tidak valid atau telah berakhir.');
    }

    return true;
  }
}
