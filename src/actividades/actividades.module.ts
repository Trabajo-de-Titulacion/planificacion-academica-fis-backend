import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './entities/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ActividadesModule {}
