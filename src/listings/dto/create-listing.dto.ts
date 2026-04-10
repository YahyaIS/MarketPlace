import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Luxury Beachfront Villa',
    description: 'The display name of the property',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example:
      'A stunning 3-bedroom villa with a private pool and sunset views over the Pacific.',
    description: 'Detailed description (min 15 chars)',
  })
  @IsString()
  @MinLength(15)
  description: string;

  @ApiProperty({ example: 450.0, description: 'Price per night in USD' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: '123 Ocean Drive, Miami, FL', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    enum: ListingType,
    example: ListingType.BUSINESS, // Or a specific string value from your enum
  })
  @IsEnum(ListingType)
  type: ListingType;

  @ApiProperty({
    enum: ListingStatus,
    example: ListingStatus.PUBLISHED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiProperty({
    example: { wifi: true, parking: '2 spots', pool: 'private' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
