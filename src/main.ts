import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');

  if(process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    Logger.log(`Accepting request s from origin "${serverConfig.origin}"`);
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`App running in port ${port}.`);
}
bootstrap();
