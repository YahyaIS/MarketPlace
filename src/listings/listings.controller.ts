import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AuthProtected } from 'src/auth/decorators/auth-protected.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @AuthProtected()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: number,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(userId, createListingDto);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @AuthProtected()
  @Get('me')
  findMyListings(@CurrentUser('id') userId: number) {
    return this.listingsService.findAll({ sellerId: userId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listingsService.findOne(id);
  }

  @AuthProtected()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, userId, updateListingDto);
  }

  @AuthProtected()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.listingsService.softDelete(id, userId);
  }
}
