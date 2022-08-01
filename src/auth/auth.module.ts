import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { RolService } from './services/rol.service';
import { RolEntity } from './entities/rol.entity';
import { RolController } from './controllers/rol.controller';
import { AccionEntity } from './entities/accion.entity';
import { AccionController } from './controllers/accion.controller';
import { AccionService } from './services/accion.service';
import RolUsuarioService from './services/rol-usuario.service';
import { RolUsuarioEntity } from './entities/rol-usuario.entity';
import { UsuariosModule } from 'src/usuarios/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuracion from 'src/config/configuracion';
import { ConfigType } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsuariosModule,
    TypeOrmModule.forFeature([UsuarioEntity, RolEntity, AccionEntity, RolUsuarioEntity]),
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
    AuthService,
    RolService,
    AccionService,
    RolUsuarioService,
    LocalStrategy
  ],
  controllers: [AuthController, RolController, AccionController]
})
export class AuthModule { }


