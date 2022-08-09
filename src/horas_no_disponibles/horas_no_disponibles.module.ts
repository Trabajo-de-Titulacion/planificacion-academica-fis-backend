import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoraNoDisponible } from './entities/hora_no_disponible.entity';
import { HorasNoDisponiblesController } from './controllers/horas_no_disponibles.controller';
import { HorasNoDisponiblesService } from './services/horas_no_disponibles.service';

@Module({
  imports: [TypeOrmModule.forFeature([HoraNoDisponible])],
  controllers: [HorasNoDisponiblesController],
  providers: [HorasNoDisponiblesService],
})
export class HorasNoDisponiblesModule {
  
}