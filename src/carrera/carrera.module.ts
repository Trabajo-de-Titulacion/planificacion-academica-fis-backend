import { Module } from '@nestjs/common';
import { CarreraService } from './services/carrera.service';
import { CarreraController } from './controllers/carrera.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraEntity } from './entities/carrera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarreraEntity])
  ],
  providers: [CarreraService],
  controllers: [CarreraController]
})
export class CarreraModule { }
