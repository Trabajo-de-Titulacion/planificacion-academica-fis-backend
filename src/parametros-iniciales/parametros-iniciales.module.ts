import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestreEntity } from '../../src/parametros-iniciales/entities/semestre.entity';
import { SemestreController } from './controllers/semestre.controller';
import { SemestreService } from './services/semestre.service';
import { JornadaLaboralService } from './services/jornada-laboral.service';
import { JornadaLaboralEntity } from './entities/jornada-laboral.entity';
import { JornadaLaboralController } from './controllers/jornada-laboral.controller';
import { FacultadEntity } from './entities/facultad.entity';
import { FacultadService } from './services/facultad.service';
import { FacultadController } from './controllers/facultad.controller';
import { TipoAulaEntity } from './entities/tipo-aula.entity';
import { TipoAulaService } from './services/tipo-aula.service';
import { TipoAulaController } from './controllers/tipo-aula.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SemestreEntity, JornadaLaboralEntity, FacultadEntity, TipoAulaEntity])],
    controllers: [SemestreController,JornadaLaboralController, FacultadController, TipoAulaController],
    providers: [SemestreService, JornadaLaboralService, FacultadService, TipoAulaService]
})
export class ParametrosInicialesModule {}