import { Body, Controller, Post } from '@nestjs/common';
import { CarreraService } from '../services/carrera.service';
import { CarreraDto } from '../dto/carrera.dto';

@Controller('carrera')
export class CarreraController {

    constructor(private carreraService: CarreraService) { }

    @Post('crearUno')
    createCarrera(@Body() carreraDto: CarreraDto) {

        // Convertir en mayúsculas el código, nombre y modalidad

        carreraDto.codigo = carreraDto.codigo.toUpperCase();
        carreraDto.modalidad = carreraDto.modalidad.toUpperCase();
        carreraDto.nombre = carreraDto.nombre.toUpperCase();

        return this.carreraService.createCarrera(carreraDto);
    }
}
