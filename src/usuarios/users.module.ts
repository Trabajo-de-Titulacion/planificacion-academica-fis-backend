import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './controllers/usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioService } from './services/usuario.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UsuarioEntity])
  ],
  controllers: [UsuariosController],
  providers: [UsuarioService]
})
export class UsersModule {}
