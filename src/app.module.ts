import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuracion from './config/configuracion';
import { PostgresConfigService } from './config/service/postgres-config.service';
import { ParametrosInicialesModule } from './parametros-iniciales/parametros-iniciales.module';
import { UsuariosModule } from './usuarios/usuarios.module';

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
    ParametrosInicialesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
