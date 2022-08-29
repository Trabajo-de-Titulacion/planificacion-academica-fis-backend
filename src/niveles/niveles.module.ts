import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraModule } from 'src/carrera/carrera.module';
import { CarreraEntity } from 'src/carrera/entities/carrera.entity';
import { CarreraService } from 'src/carrera/services/carrera.service';
import { GrupoController } from './controllers/grupo.controller';
import { NivelController } from './controllers/nivel.controller';
import { GrupoEntity } from './entities/grupo.entity';
import { NivelEntity } from './entities/nivel.entity';
import { GrupoService } from './services/grupo.service';
import { NivelService } from './services/nivel.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([GrupoEntity, NivelEntity]),
    CarreraModule
  ],
  controllers: [NivelController, GrupoController],
  providers: [NivelService, GrupoService],
  exports: [TypeOrmModule]
})
export class NivelesModule {}
