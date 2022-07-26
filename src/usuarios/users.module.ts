import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsersService } from './services/users.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UsuarioEntity])
  ],
  controllers: [UsuariosController],
  providers: [UsersService]
})
export class UsersModule {}
