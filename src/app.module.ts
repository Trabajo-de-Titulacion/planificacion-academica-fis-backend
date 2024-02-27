import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DocenteModule } from './docente/docente.module';
import { MailModule } from './mail/mail.module';
import { CarreraModule } from './carrera/carrera.module';
import configuracion from './config/configuracion';
import { PostgresConfigService } from './config/service/postgres-config.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EspaciosFisicosModule } from './espacios_fisicos/espacios_fisicos.module';
import { HorasNoDisponiblesModule } from './horas_no_disponibles/horas_no_disponibles.module';
import { ParametrosInicialesModule } from './parametros-iniciales/parametros-iniciales.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { ActividadesModule } from './actividades/actividades.module';
import { HorarioModule } from './horario/horario.module';
import { NivelesModule } from './niveles/niveles.module';
import { NumeroEstudiantesPorSemestreModule } from './numero_estudiantes/numeroEstudiantesPorSemestre.module';
import * as Joi from 'joi';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuracion],
      // Validation for env variables
      validationSchema: Joi.object({
        SPA_DB_DATABASE: Joi.string().required(),
        SPA_DB_USERNAME: Joi.string().required(),
        SPA_DB_PASSWORD: Joi.string().required(),
        SPA_DB_PORT: Joi.number().required(),
        SPA_DB_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        SPA_PORT: Joi.number().required(),
        PREFIX: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    //AuthModule,
    UsuariosModule,
    MailModule,
    CarreraModule,
    EspaciosFisicosModule,
    HorasNoDisponiblesModule,
    ParametrosInicialesModule,
    DocenteModule,
    AsignaturaModule,
    ActividadesModule,
    HorarioModule,
    NivelesModule,
    NumeroEstudiantesPorSemestreModule,
    TerminusModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
