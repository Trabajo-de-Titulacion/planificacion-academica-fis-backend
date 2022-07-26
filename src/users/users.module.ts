import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsersService } from './services/users.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UsuarioEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
