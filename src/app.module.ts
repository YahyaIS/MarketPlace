import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingModule } from './listing/listing.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [ListingModule, UserModule, PrismaModule, OfferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
