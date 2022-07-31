import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUsuarioEntity } from 'src/auth/entities/rol-usuario.entity';
import { UsuariosController } from './controllers/usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioService } from './services/usuario.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UsuarioEntity, RolUsuarioEntity])
  ],
  controllers: [UsuariosController],
  providers: [UsuarioService],
  exports: [TypeOrmModule, UsuarioService]
})
export class UsuariosModule {}
