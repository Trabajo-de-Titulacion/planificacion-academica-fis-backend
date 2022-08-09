import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JornadaLaboralDto } from "../dtos/jornada-laboral.dto";
import { JornadaLaboralService } from "../services/jornada-laboral.service";

@ApiTags("Jornada Laboral (días y horas laborales)")
@Controller("api/jornadaLaboral")
export class JornadaLaboralController {

    constructor(
        private servicioJornadaLaboral : JornadaLaboralService
    ){}

    @Post("/api/servicioJornadaLaboral")
    async crearJornadaLaboral(@Body() jornada : JornadaLaboralDto){
        this.servicioJornadaLaboral.crearJornadaLaboral(jornada);
    }

    @Get('/api/obtenerIntervalos/:idJornada')
    async obtenerIntervalos(@Param('idJornada') idJornada : string){
        return this.servicioJornadaLaboral.obtenerIntervalos(idJornada);
    }

    @Get('/api/obtenerJornadasLaborales')
    async obtenerJornadas(){
        return this.servicioJornadaLaboral.obtenerJornadasLaborales();
    }
}