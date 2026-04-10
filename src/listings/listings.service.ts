import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingStatus } from 'src/generated/prisma/client';
import { ListingWhereInput } from 'src/generated/prisma/models';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(sellerId: number, createListingDto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...createListingDto,
        sellerId,
      },
    });
  }

  findAll(query?: ListingWhereInput) {
    return this.prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing #${id} not found`);
    }

    return listing;
  }

  async update(
    id: number,
    sellerId: number,
    updateListingDto: UpdateListingDto,
  ) {
    await this.assertOwnership(id, sellerId);

    return this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
    });
  }

  async softDelete(id: number, sellerId: number) {
    await this.assertOwnership(id, sellerId);

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.DRAFT },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private async assertOwnership(id: number, sellerId: number): Promise<void> {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException(`Listing #${id} not found`);
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException(
        'You are not allowed to modify this listing',
      );
    }
  }
}
