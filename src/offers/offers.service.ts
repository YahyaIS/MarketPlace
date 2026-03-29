import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOfferDto: CreateOfferDto) {
    return this.prisma.offer.create({
      data: createOfferDto,
    });
  }

  findAll() {
    return this.prisma.offer.findMany();
  }

  findOne(id: number) {
    return this.prisma.offer.findUnique({
      where: { id },
    });
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.prisma.offer.update({
      where: { id },
      data: updateOfferDto,
    });
  }

  remove(id: number) {
    return this.prisma.offer.delete({
      where: { id },
    });
  }
}