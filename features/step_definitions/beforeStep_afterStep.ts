import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import configuracion from '../../src/config/configuracion';
import { AfterStep, BeforeStep } from '@cucumber/cucumber';

BeforeStep(async function () {
  // Levantar aplicacion
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  // Para que se apliquen los DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(configuracion().http.port);

  this.app = await app;
});

AfterStep(async function () {
  // Cerrar aplicacion
  this.app.close();
});