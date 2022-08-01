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

@Module({
  imports: [
    UsuariosModule,
    TypeOrmModule.forFeature([UsuarioEntity, RolEntity, AccionEntity, RolUsuarioEntity]),
    PassportModule, // para la estrategia local
    JwtModule.register({
      secret: 'asdasd',
      signOptions: {expiresIn: '3h'}
    })
  ],
  providers: [
    AuthService,
    RolService,
    AccionService,
    RolUsuarioService,  
  ],
  controllers: [AuthController, RolController, AccionController]
})
export class AuthModule {}


