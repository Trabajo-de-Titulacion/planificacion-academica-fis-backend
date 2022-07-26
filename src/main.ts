import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import configuracionesGlobales from './utils/configuraciones-globales';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuraciones para Swagger
  const configuracionSwagger = new DocumentBuilder()
    .setTitle(configuracionesGlobales.titulo)
    .setDescription(configuracionesGlobales.descripcion)
    .setVersion(configuracionesGlobales.version)
    .addTag(configuracionesGlobales.swaggerTag) // permite acceder a la documentación utilizando api/docs
    .build();

  // Levantamiento de Swagger
  const document = SwaggerModule.createDocument(app, configuracionSwagger);
  SwaggerModule.setup(`${configuracionesGlobales.swaggerTag}/docs`, app, document);

  await app.listen(configuracionesGlobales.puerto);
}
bootstrap();