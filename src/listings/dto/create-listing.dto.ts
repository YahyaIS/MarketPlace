import { ListingType } from '../../generated/prisma/client';

export class CreateListingDto {
  name: string;
  description: string;
  price: number;
  type: ListingType;
  sellerId: number;
  attributes?: Record<string, any>;
}