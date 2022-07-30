import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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

    @Put('actualizarAccion/:id')
    async actualizarAccion(@Param('id') idAccion : string, @Body() accion : AccionDto){
        return this.servicioAccion.actualizarAccion(idAccion, accion);
    }

    @Delete('eliminarAccion/:id')
    async eliminarAccion(@Param('id') idAccion : string){
        return this.servicioAccion.eliminarAccion(idAccion);
    }
}