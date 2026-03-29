import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { SessionsService } from '../../sessions/sessions.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private sessionsService: SessionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_REFRESH_SECRET}`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const rawToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!rawToken) throw new UnauthorizedException();

    const isValid = await this.sessionsService.validate(
      payload.sessionId,
      rawToken,
    );
    if (!isValid)
      throw new UnauthorizedException('Refresh token invalid or expired');

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}
