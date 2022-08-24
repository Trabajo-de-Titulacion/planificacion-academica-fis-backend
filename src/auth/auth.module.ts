import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { RolService } from './services/rol.service';
import { RolEntity } from '../../src/auth/entities/rol.entity';
import { RolController } from './controllers/rol.controller';
import RolUsuarioService from './services/rol-usuario.service';
import { RolUsuarioEntity } from '../../src/auth/entities/rol-usuario.entity';
import { UsuariosModule } from '../../src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuracion from '../../src/config/configuracion';
import { ConfigType } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RolUsuarioController } from './controllers/rol-usuario.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsuariosModule,
    TypeOrmModule.forFeature([UsuarioEntity, RolEntity, RolUsuarioEntity]),
    PassportModule, // para la estrategia local
    JwtModule.registerAsync({
      inject: [configuracion.KEY],
      useFactory: (configService: ConfigType<typeof configuracion>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '5h',
          }
        }
      }
    })
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    RolService,
    RolUsuarioService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  controllers: [AuthController, RolController, RolUsuarioController],
  exports: [AuthService]
})
export class AuthModule { }


