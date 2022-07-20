import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspacioFisico } from './entities/espacio_fisico.entity';
import { EspaciosFisicosController } from './espacios_fisicos.controller';
import { EspaciosFisicosService } from './espacios_fisicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([EspacioFisico])],
  controllers: [EspaciosFisicosController],
  providers: [EspaciosFisicosService],
})
export class EspaciosFisicosModule {
  
}