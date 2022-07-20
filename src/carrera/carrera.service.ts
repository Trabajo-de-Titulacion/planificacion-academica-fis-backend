import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrera } from './entities/carrera.entity';

@Injectable()
export class CarreraService {

    constructor(
        @InjectRepository(Carrera)
        private carreraRepository: Repository<Carrera>
    ) { }

    // Crear una carrera en la base de datos

    async createCarrera(carreraDto) {

        // Busqueda en la base la existencia de una carrera en base a su código
        const existenciaCarrera = await this.carreraRepository.find({
            where: {
                codigo: carreraDto.codigo,
            }
        });

        // Si no existe, crea en la base de datos la carrera
        // caso contrario, solo muestra un mensaje 

        if (existenciaCarrera.length == 0) {
            await this.carreraRepository.save(carreraDto);
            return "Se ha creado existosamente la carrera de " + carreraDto.nombre + "."

        } else {
            return "La carrera " + carreraDto.nombre + " ya se encuentra registrada."

        }
    }
}
