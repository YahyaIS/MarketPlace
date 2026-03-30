import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';

type StringValue = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
  ) {}

  // ─── Called by LocalStrategy ──────────────────────────────────────────────
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const { passwordHash, ...result } = user;
    return result;
  }

  // ─── Public methods ───────────────────────────────────────────────────────
  async register(dto: RegisterDto, req: Request) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.createSessionAndTokens(user, req);
  }

  async login(user: any, req: Request) {
    return this.createSessionAndTokens(user, req);
  }

  async refresh(
    sessionId: number,
    userId: number,
    email: string,
    role: string,
  ) {
    const tokens = await this.generateTokens(userId, email, role, sessionId);
    const expiresAt = this.refreshExpiresAt();
    await this.sessionsService.rotate(
      sessionId,
      tokens.refreshToken,
      expiresAt,
    );
    return tokens;
  }

  async logout(sessionId: number) {
    await this.sessionsService.revoke(sessionId);
    return { message: 'Logged out successfully' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  private async createSessionAndTokens(user: any, req: Request) {
    const expiresAt = this.refreshExpiresAt();
    const deviceId = req.headers['x-device-id'] as string | undefined;
    const deviceName = this.parseDeviceName(req.headers['user-agent']);

    let session = await this.sessionsService.findByDevice(
      deviceId,
    );

    if (session) {
      const tokens = await this.generateTokens(
        user.id,
        user.email,
        user.role,
        session.id,
      );
      await this.sessionsService.rotate(
        session.id,
        tokens.refreshToken,
        expiresAt,
      );

      const { passwordHash, role, ...safeUser } = user;
      return { ...tokens, user: safeUser };
    }

    session = await this.sessionsService.create({
      userId: user.id,
      refreshToken: 'temp',
      deviceName,
      deviceId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt,
    });

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      session.id,
    );
    await this.sessionsService.rotate(
      session.id,
      tokens.refreshToken,
      expiresAt,
    );

    const { passwordHash, role, ...safeUser } = user;
    return { ...tokens, user: safeUser };
  }

  private async generateTokens(
    userId: number,
    email: string,
    role: string,
    sessionId: number,
  ) {
    const payload = { sub: userId, email, role, sessionId };

    const accessExpiry = (process.env.JWT_EXPIRES_IN ?? '15m') as StringValue;
    const refreshExpiry = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: accessExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshExpiry,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private refreshExpiresAt(): Date {
    const ms = this.parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN ?? '7d');
    return new Date(Date.now() + ms);
  }

  private parseDurationMs(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    const map: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return value * (map[unit] ?? 86_400_000);
  }

  private parseDeviceName(userAgent?: string): string {
    if (!userAgent) return 'Unknown device';
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown device';
  }
}
