import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

import { AfterStep, BeforeStep } from '@cucumber/cucumber';



BeforeStep(async function () {
  // Levantar aplicacion
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
});

AfterStep(async function () {
  // Cerrar aplicacion
  this.app.close();
});


