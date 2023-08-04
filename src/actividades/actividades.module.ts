import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaModule } from '../../src/asignatura/asignatura.module';
import { DocenteModule } from '../../src/docente/docente.module';
import { NivelesModule } from '../../src/niveles/niveles.module';
import { NumeroEstudiantesPorSemestreModule } from '../../src/numero_estudiantes/numeroEstudiantesPorSemestre.module';
import { ParametrosInicialesModule } from '../../src/parametros-iniciales/parametros-iniciales.module';
import { ActividadesController } from './controllers/actividades.controller';
import { ActividadEntity } from './entities/actividad.entity';
import { ActividadesService } from './services/actividades.service';
import { RestriccionActividadEntity } from './entities/restriccion-actividad.entity';
import { EspaciosFisicosModule } from 'src/espacios_fisicos/espacios_fisicos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActividadEntity, RestriccionActividadEntity]),
    AsignaturaModule,
    NivelesModule,
    DocenteModule,
    NumeroEstudiantesPorSemestreModule,
    ParametrosInicialesModule,
    NivelesModule,
    EspaciosFisicosModule
  ],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [TypeOrmModule, ActividadesService],
})
export class ActividadesModule {}
