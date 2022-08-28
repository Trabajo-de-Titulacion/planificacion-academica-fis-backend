import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoEntity } from './entities/grupo.entity';
import { NivelEntity } from './entities/nivel.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([GrupoEntity, NivelEntity])
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class NivelesModule {}
