import { NestFactory } from '@nestjs/core';
import { LoggerService } from '../utils/logger.service';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService()
  });

  const port = 3000;
  await app.listen(port);
  // Log the port on which we start the application
   console.log(`Application listening on port ${port}`);
}
bootstrap();
