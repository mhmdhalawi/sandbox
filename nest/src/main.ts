import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import session from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(
    session({
      keys: [process.env.SESSION_SECRET],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  await app.listen(9000);
}
bootstrap();
