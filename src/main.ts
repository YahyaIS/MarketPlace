import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // This exposes the JSON spec at http://localhost:3000/api-json
  SwaggerModule.setup('api', app, document);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.PORT ?? 3000);
}
bootstrap();
