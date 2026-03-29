import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: number;
    refreshToken: string;
    deviceName?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    const hashed = await bcrypt.hash(data.refreshToken, 10);
    return this.prisma.session.create({
      data: {
        userId: data.userId,
        refreshToken: hashed,
        deviceName: data.deviceName,
        deviceId: data.deviceId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async findAllByUser(userId: number) {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        deviceName: true,
        deviceId: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validate(sessionId: number, rawToken: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) return false;
    if (session.isRevoked) return false;
    if (session.expiresAt < new Date()) return false;

    return bcrypt.compare(rawToken, session.refreshToken);
  }

  async rotate(sessionId: number, newRawToken: string, expiresAt: Date) {
    const hashed = await bcrypt.hash(newRawToken, 10);
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { refreshToken: hashed, expiresAt },
    });
  }

  // Revoke a single session (logout from one device)
  async revoke(sessionId: number) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  // Revoke all sessions for a user (logout everywhere)
  async revokeAll(userId: number) {
    return this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}