import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccionDto } from "../dtos/accion.dto";
import { AccionService } from "../services/accion.service";

@ApiTags("Acciones")
@Controller("api/accion")
export class AccionController {
    constructor(
        private servicioAccion : AccionService
    ){}

    @Get("obtenerAcciones")
    async obtenerAcciones(){
        return this.servicioAccion.obtenerAcciones();
    }

    @Get("obtenerAccionesPorRol/:id")
    async obtenerAccionesPorRol(@Param("id") id: string){
        return this.servicioAccion.obtenerAccionesPorRol(id);
    }
    
    @Post("crearAccion")
    async crearAccion(@Body() accion : AccionDto){
        return this.servicioAccion.crearAccion(accion);
    }
}