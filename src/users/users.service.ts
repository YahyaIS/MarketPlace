import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { UserWhereUniqueInput } from 'src/generated/prisma/models/User';

type FindUserOptions = {
  includeCounts?: boolean;
  withPassword?: boolean;
  withSession?: boolean;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private buildSelect(options: FindUserOptions = {}): Prisma.UserSelect {
    return {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: options.withPassword ?? false,
      sessions: options.withSession ?? false,
      ...(options.includeCounts && {
        _count: {
          select: {
            listings: true,
            offers: true,
          },
        },
      }),
    };
  }

  async findOne(query: UserWhereUniqueInput, options: FindUserOptions = {}) {
    return this.prisma.user.findUnique({
      where: query,
      select: this.buildSelect(options),
    });
  }

  async findAll(options: FindUserOptions = {}) {
    return this.prisma.user.findMany({
      select: this.buildSelect(options),
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prisma.user.create({ data, select: this.buildSelect() });
  }
}
