import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../../src/app.module';
import configuracion from '../../src/config/configuracion';
import { configuracionesSwagger } from '../../src/config/swagger-config';

import { AfterStep, BeforeStep } from '@cucumber/cucumber';

BeforeStep(async function () {
  
  // Levantar aplicacion
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  
  // Configuraciones para Swagger
  const configuracionSwagger = new DocumentBuilder()
    .setTitle(configuracionesSwagger.titulo)
    .setDescription(configuracionesSwagger.descripcion)
    .setVersion(configuracionesSwagger.version)
    .addTag(configuracionesSwagger.tag) // permite acceder a la documentación utilizando api/docs
    .build();

  // Levantamiento de Swagger
  const document = SwaggerModule.createDocument(app, configuracionSwagger);
  SwaggerModule.setup(`${configuracionesSwagger.tag}/docs`, app, document);

  // Para que se apliquen los DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(configuracion().http.port);

  this.app = await app;
});

AfterStep(async function () {
  // Cerrar aplicacion
  this.app.close();
});