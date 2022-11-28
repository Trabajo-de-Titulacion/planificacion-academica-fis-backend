import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaController } from './controllers/asignatura.controller';
import { AsignaturaEntity } from './entities/asignatura.entity';
import { AsignaturaService } from './services/asignatura.service';

@Module({
  imports: [TypeOrmModule.forFeature([AsignaturaEntity])],
  exports: [],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
})
export class AsignaturaModule {
  constructor(private asignaturaService: AsignaturaService) {}
}
