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

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, RolEntity, AccionEntity])],
  providers: [AuthService, RolService, AccionService],
  controllers: [AuthController, RolController, AccionController]
})
export class AuthModule {}


