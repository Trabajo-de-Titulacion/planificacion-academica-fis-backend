import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SemestreDTO } from "../dtos/semestre.dto";
import { SemestreService } from "../services/semestre.service";

@ApiTags("Semestres")
@Controller("/api/semestre")
export class SemestreController {

    constructor(
        private servicioSemestre: SemestreService
    ) { }

    @Post("/crearSemestre")
    async crearSemestre(@Body() semestre: SemestreDTO) {
        return this.servicioSemestre.crearSemestre(semestre);
    }

    @Get('/obtenerSemestres')
    async obtenerSemestres(){
        return this.servicioSemestre.obtenerSemestres();
    }
}