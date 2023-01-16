import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaModule } from 'src/asignatura/asignatura.module';
import { DocenteModule } from 'src/docente/docente.module';
import { NivelesModule } from 'src/niveles/niveles.module';
import { NumeroEstudiantesPorSemestreModule } from 'src/numero_estudiantes/numeroEstudiantesPorSemestre.module';
import { ParametrosInicialesModule } from 'src/parametros-iniciales/parametros-iniciales.module';
import { ActividadesController } from './controllers/actividades.controller';
import { ActividadEntity } from './entities/actividad.entity';
import { ActividadesService } from './services/actividades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActividadEntity]),
    AsignaturaModule,
    NivelesModule,
    DocenteModule,
    NumeroEstudiantesPorSemestreModule,
    ParametrosInicialesModule,
    NivelesModule,
  ],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [TypeOrmModule, ActividadesService],
})
export class ActividadesModule {}
