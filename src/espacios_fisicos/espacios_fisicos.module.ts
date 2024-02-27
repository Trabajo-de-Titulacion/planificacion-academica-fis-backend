import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspacioFisicoEntity } from './entities/espacio_fisico.entity';
import { EspaciosFisicosController } from './controllers/espacios_fisicos.controller';
import { EspaciosFisicosService } from './services/espacios_fisicos.service';
import { TipoAulaService } from '../../src/parametros-iniciales/services/tipo-aula.service';
import { TipoAulaEntity } from '../../src/parametros-iniciales/entities/tipo-aula.entity';
import { FacultadService } from '../../src/parametros-iniciales/services/facultad.service';
import { FacultadEntity } from '../../src/parametros-iniciales/entities/facultad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EspacioFisicoEntity,
      TipoAulaEntity,
      FacultadEntity,
    ]),
  ],
  controllers: [EspaciosFisicosController],
  providers: [EspaciosFisicosService, TipoAulaService, FacultadService],
  exports: [EspaciosFisicosService],
})
export class EspaciosFisicosModule {}
