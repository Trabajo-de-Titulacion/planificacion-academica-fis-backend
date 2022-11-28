import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { UsuarioService } from '../../src/usuarios/services/usuario.service';
import { HorarioController } from './controllers/horario.controller';
import { HorarioEntity } from './entities/horario.entity';
import { HorarioService } from './services/horario.service';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioEntity, UsuarioEntity])],
  controllers: [HorarioController],
  providers: [HorarioService, UsuarioService],
})
export class HorarioModule {}
