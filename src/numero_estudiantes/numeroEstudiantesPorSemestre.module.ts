import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestreService } from '../parametros-iniciales/services/semestre.service';
import { SemestreEntity } from '../parametros-iniciales/entities/semestre.entity';
import { NumeroEstudiantesPorSemestreController } from './controllers/numeroEstudiantesPorSemestre.controller';
import { NumeroEstudiantesPorSemestreService } from './services/numeroEstudiantesPorSemestre.service';
import { NumeroEstudiantesPorSemestreEntity } from './entities/numeroEstudiantesPorSemestre.entity';
import { AsignaturaService } from '../../src/asignatura/services/asignatura.service';
import { AsignaturaEntity } from '../../src/asignatura/entities/asignatura.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NumeroEstudiantesPorSemestreEntity,
      SemestreEntity,
      AsignaturaEntity,
    ]),
  ],
  controllers: [NumeroEstudiantesPorSemestreController],
  providers: [NumeroEstudiantesPorSemestreService, SemestreService, AsignaturaService],
})
export class NumeroEstudiantesPorSemestreModule {
  
}