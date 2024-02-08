import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { join } from 'path';
import * as hbsUtils from 'hbs-utils';

const coockieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.engine('hbs', hbs({ extname: 'hbs' }));
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/layouts'));
  app.setViewEngine('hbs');
  app.use(
    coockieSession({
      keys: ['asdfghjkl'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3333);
}
bootstrap();
