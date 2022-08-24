import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultadController } from './controllers/facultad.controller';
import { FacultadEntity } from './entities/facultad.entity';
import { FacultadService } from './services/facultad.service';
import { JornadaLaboralController } from './controllers/jornada-laboral.controller';
import { JornadaLaboralEntity } from './entities/jornada-laboral.entity';
import { JornadaLaboralService } from './services/jornada-laboral.service';
import { SemestreController } from './controllers/semestre.controller';
import { SemestreEntity } from '../../src/parametros-iniciales/entities/semestre.entity';
import { SemestreService } from './services/semestre.service';
import { TipoAulaController } from './controllers/tipo-aula.controller';
import { TipoAulaEntity } from './entities/tipo-aula.entity';
import { TipoAulaService } from './services/tipo-aula.service';

@Module({
    imports: [TypeOrmModule.forFeature(
        [
            FacultadEntity,
            JornadaLaboralEntity,
            SemestreEntity,
            TipoAulaEntity
        ]
    )],
    controllers: [
        FacultadController,
        JornadaLaboralController,
        SemestreController,
        TipoAulaController
    ],
    providers: [
        FacultadService,
        JornadaLaboralService,
        SemestreService,
        TipoAulaService
    ]
})
export class ParametrosInicialesModule { }