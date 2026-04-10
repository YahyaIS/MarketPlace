// src/listings/dto/create-listing.dto.ts
import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  MinLength,
  IsObject,
} from 'class-validator';
import { ListingStatus, ListingType } from 'src/generated/prisma/client';

export class CreateListingDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  name: string;

  @IsString()
  @MinLength(15, { message: 'Description must be at least 15 characters' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(ListingType, {
    message: `Listing type must be one of: ${Object.values(ListingType).join(', ')}`,
  })
  type: ListingType;

  @IsOptional()
  @IsEnum(ListingStatus, {
    message: `Listing status must be one of: ${Object.values(ListingStatus).join(', ')}`,
  })
  status?: ListingStatus;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
