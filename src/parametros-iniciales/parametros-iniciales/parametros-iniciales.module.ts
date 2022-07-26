import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioEntity } from '../entities/horario.entity';
import { SemestreEntity } from '../entities/semestre.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SemestreEntity, HorarioEntity])],
})
export class ParametrosInicialesModule {
    
}
