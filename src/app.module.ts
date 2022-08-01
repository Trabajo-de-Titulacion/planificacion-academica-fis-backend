import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuracion from './config/configuracion';
import { PostgresConfigService } from './config/service/postgres-config.service';
import { UsuariosModule } from './usuarios/users.module';
import { EspaciosFisicosModule } from './espacios_fisicos/espacios_fisicos.module';
import { HorasNoDisponiblesModule } from './horas_no_disponibles/horas_no_disponibles.module';

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
    EspaciosFisicosModule,
    HorasNoDisponiblesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
