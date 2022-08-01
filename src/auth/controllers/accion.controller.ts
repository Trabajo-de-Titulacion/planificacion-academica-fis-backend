import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { configuraciones } from "src/config/swagger-config";
import { AccionDto } from "../dtos/accion.dto";
import { AccionService } from "../services/accion.service";

@ApiTags(configuraciones.controladores.accciones.tag)
@Controller(configuraciones.controladores.accciones.ruta)
export class AccionController {
    constructor(
        private servicioAccion: AccionService
    ) { }

    @ApiProperty({description: configuraciones.controladores.accciones.operaciones.obtenerAcciones.description})
    @Get(configuraciones.controladores.accciones.operaciones.obtenerAcciones.ruta)
    async obtenerAcciones() {
        return this.servicioAccion.obtenerAcciones();
    }

    @ApiProperty({description: configuraciones.controladores.accciones.operaciones.obtenerAccionesPorRol.description})
    @Get(configuraciones.controladores.accciones.operaciones.obtenerAccionesPorRol.ruta)
    async obtenerAccionesPorRol(@Param("id") id: string) {
        return this.servicioAccion.obtenerAccionesPorRol(id);
    }

    @Post("crearAccion")
    async crearAccion(@Body() accion: AccionDto) {
        return this.servicioAccion.crearAccion(accion);
    }

    @Put('actualizarAccion/:id')
    async actualizarAccion(@Param('id') idAccion: string, @Body() accion: AccionDto) {
        return this.servicioAccion.actualizarAccion(idAccion, accion);
    }

    @Delete('eliminarAccion/:id')
    async eliminarAccion(@Param('id') idAccion: string) {
        return this.servicioAccion.eliminarAccion(idAccion);
    }
}