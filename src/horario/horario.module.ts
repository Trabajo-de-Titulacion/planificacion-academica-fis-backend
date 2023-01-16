import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesModule } from 'src/actividades/actividades.module';
import { AsignaturaModule } from 'src/asignatura/asignatura.module';
import { DocenteModule } from 'src/docente/docente.module';
import { EspaciosFisicosModule } from 'src/espacios_fisicos/espacios_fisicos.module';
import { HorasNoDisponiblesModule } from 'src/horas_no_disponibles/horas_no_disponibles.module';
import { NivelesModule } from 'src/niveles/niveles.module';
import { ParametrosInicialesModule } from 'src/parametros-iniciales/parametros-iniciales.module';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { UsuarioService } from '../../src/usuarios/services/usuario.service';
import { HorarioController } from './controllers/horario.controller';
import { HorarioEntity } from './entities/horario.entity';
import { HorarioService } from './services/horario.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorarioEntity, UsuarioEntity]),
    ParametrosInicialesModule,
    AsignaturaModule,
    DocenteModule,
    HorasNoDisponiblesModule,
    ActividadesModule,
    NivelesModule,
    EspaciosFisicosModule,
  ],
  controllers: [HorarioController],
  providers: [HorarioService, UsuarioService],
})
export class HorarioModule {}
