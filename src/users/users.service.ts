import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly safeSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    listings: true,
    offers: true,
    sessions: false,
    passwordHash: false,
  } satisfies Prisma.UserSelect;

  async findById(id: number, includePassword: boolean = false) {
    return this.prisma.user.findUnique({
      where: { id },
      ...(!includePassword && { select: this.safeSelect }),
    });
  }

  async findByEmail(email: string, includePassword: boolean = false) {
    return this.prisma.user.findUnique({
      where: { email },
      ...(!includePassword && { select: this.safeSelect }),
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash and refreshToken excluded
      },
    });
  }
}
