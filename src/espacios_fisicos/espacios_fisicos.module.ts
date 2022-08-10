import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspacioFisicoEntity } from './entities/espacio_fisico.entity';
import { EspaciosFisicosController } from './controllers/espacios_fisicos.controller';
import { EspaciosFisicosService } from './services/espacios_fisicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([EspacioFisicoEntity])],
  controllers: [EspaciosFisicosController],
  providers: [EspaciosFisicosService],
})
export class EspaciosFisicosModule {
  
}