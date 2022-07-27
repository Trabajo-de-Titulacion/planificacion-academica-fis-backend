import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { RolService } from './services/rol.service';
import { RolEntity } from './entities/rol.entity';
import { RolController } from './controllers/rol.controller';
import { AccionEntity } from './entities/accion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, RolEntity, AccionEntity])],
  providers: [AuthService, RolService],
  controllers: [AuthController, RolController]
})
export class AuthModule {}


