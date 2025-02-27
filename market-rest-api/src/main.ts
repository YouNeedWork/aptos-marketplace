import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import 'reflect-metadata';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT);
}

bootstrap();
