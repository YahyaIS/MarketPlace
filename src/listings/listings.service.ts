import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createListingDto: CreateListingDto) {
    return this.prisma.listing.create({
      data: createListingDto,
    });
  }

  findAll() {
    return this.prisma.listing.findMany();
  }

  findOne(id: number) {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
    });
  }

  remove(id: number) {
    return this.prisma.listing.delete({
      where: { id },
    });
  }
}