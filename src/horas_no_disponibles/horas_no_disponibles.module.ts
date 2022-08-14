import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoraNoDisponibleEntity } from './entities/hora_no_disponible.entity';
import { HorasNoDisponiblesController } from './controllers/horas_no_disponibles.controller';
import { HorasNoDisponiblesService } from './services/horas_no_disponibles.service';
import { DocenteModule } from '../../src/docente/docente.module';
import { DocenteService } from '../../src/docente/services/docente.service';
import { DocenteEntity } from '../../src/docente/entities/docente.entity';
import { JornadaLaboralService } from '../../src/parametros-iniciales/services/jornada-laboral.service';
import { JornadaLaboralEntity } from '../../src/parametros-iniciales/entities/jornada-laboral.entity';
import { SemestreService } from '../../src/parametros-iniciales/services/semestre.service';
import { SemestreEntity } from '../../src/parametros-iniciales/entities/semestre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HoraNoDisponibleEntity, DocenteEntity, JornadaLaboralEntity, SemestreEntity]),
    DocenteModule
  ],
  controllers: [HorasNoDisponiblesController],
  providers: [HorasNoDisponiblesService, DocenteService, JornadaLaboralService, SemestreService],
})
export class HorasNoDisponiblesModule {
  
}