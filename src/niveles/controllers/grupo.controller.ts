import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GrupoDto } from "../dto/grupo.dto";
import { GrupoService } from "../services/grupo.service";

@ApiBearerAuth('defaultBearerAuth')
@ApiTags("Grupos")
@Controller("api/grupo")
export class GrupoController {

    constructor(
        private grupoService: GrupoService
    ) { }

    @Post("/crearGrupo")
    crearGrupo(@Body() grupo: GrupoDto) {
        return this.grupoService.crearGrupo(grupo);
    }

    @Get("/obtenerGruposPorIdNivel/:idNivel")
    obtenerGruposPorIdNivel(@Param('idNivel') idNivel: string) {
        return this.grupoService.obtenerGruposPorIdNivel(idNivel);
    }

    @Get("/obtenerTodosLosGrupos")
    obtenerTodosLosNiveles() {
        return this.grupoService.obtenerTodosLosGrupos();
    }
}