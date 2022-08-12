import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TipoAulaDto } from "../dtos/tipo-aula.dto";
import { TipoAulaService } from "../services/tipo-aula.service";

@ApiBearerAuth('defaultBearerAuth')
@ApiTags("Tipos de aulas de una facultad")
@Controller("/api/tipoAula")
export class TipoAulaController {

    constructor(
        private servicioTipoAula: TipoAulaService
    ) { }

    @Post("/crearTipoAula")
    async crearTipoAula(@Body() tipoAula: TipoAulaDto) {
        return this.servicioTipoAula.crearTipoAula(tipoAula);
    }

    @Get('/obtenerTipoAulas')
    async obtenerTipoAulas(){
        return this.servicioTipoAula.obtenerTipoAulas()
    }
}