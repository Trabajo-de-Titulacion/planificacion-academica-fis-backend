import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import configuracion from './config/configuracion';
import { configuracionesSwagger } from './config/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();