import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NivelDto } from "../dto/nivel.dto";
import { NivelService } from "../services/nivel.service";

@ApiBearerAuth('defaultBearerAuth')
@ApiTags("Niveles")
@Controller("api/nivel")
export class NivelController{

    constructor(
        private nivelService : NivelService
    ){}

    @Post("/crearNivel")
    crearNivel(@Body() nivel: NivelDto){
        return this.nivelService.crearNivel(nivel);
    }

    @Get("/obtenerTodosLosNiveles")
    obtenerTodosLosNiveles(){
        return this.nivelService.obtenerTodosLosNiveles();
    }

    @Delete("/eliminarNivel/:idNivel")
    eliminarNivel(@Param('idNivel') idNivel : string){
        return this.nivelService.eliminarNivel(idNivel);
    }
}