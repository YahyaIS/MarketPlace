import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingsModule } from './listings/listings.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [PrismaModule, UsersModule, ListingsModule, OffersModule, SessionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
