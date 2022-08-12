import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JornadaLaboralDto } from "../dtos/jornada-laboral.dto";
import { JornadaLaboralService } from "../services/jornada-laboral.service";

@ApiBearerAuth('defaultBearerAuth')
@ApiTags("Jornada Laboral (días y horas laborales)")
@Controller("api/jornadaLaboral")
export class JornadaLaboralController {

    constructor(
        private servicioJornadaLaboral : JornadaLaboralService
    ){}

    @Post("/servicioJornadaLaboral")
    async crearJornadaLaboral(@Body() jornada : JornadaLaboralDto){
        this.servicioJornadaLaboral.crearJornadaLaboral(jornada);
    }

    @Get('/obtenerIntervalos/:idJornada')
    async obtenerIntervalos(@Param('idJornada') idJornada : string){
        return this.servicioJornadaLaboral.obtenerIntervalos(idJornada);
    }

    @Get('/obtenerJornadasLaborales')
    async obtenerJornadasLaborales(){
        return this.servicioJornadaLaboral.obtenerJornadasLaborales();
    }

    @Get('/obtenerJornadaLaboralPorSemestre/:idSemestre')
    async obtenerJornadaLaboralPorSemestre(@Param('idSemestre') idSemestre : string){
        return this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(idSemestre);
    }
}