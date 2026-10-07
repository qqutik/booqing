import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(app.get(ConfigService).getOrThrow<number>('PORT'));
}
await bootstrap();
