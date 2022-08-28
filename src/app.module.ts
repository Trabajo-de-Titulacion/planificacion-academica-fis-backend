import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocenteModule } from './docente/docente.module';
import { MailModule } from './mail/mail.module';
import { CarreraModule } from './carrera/carrera.module';
import { AuthModule } from './auth/auth.module';
import configuracion from './config/configuracion';
import { PostgresConfigService } from './config/service/postgres-config.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EspaciosFisicosModule } from './espacios_fisicos/espacios_fisicos.module';
import { HorasNoDisponiblesModule } from './horas_no_disponibles/horas_no_disponibles.module';
import { ParametrosInicialesModule } from './parametros-iniciales/parametros-iniciales.module';
import { AsignaturaService } from './asignatura/services/asignatura.service';
import { AsignaturaController } from './asignatura/controllers/asignatura.controller';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { ActividadesModule } from './actividades/actividades.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true,
        load: [configuracion]
      }
    ),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    AuthModule,
    UsuariosModule,
    MailModule,
    CarreraModule,
    EspaciosFisicosModule,
    HorasNoDisponiblesModule,
    ParametrosInicialesModule,
    DocenteModule,
    AsignaturaModule,
    ActividadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
