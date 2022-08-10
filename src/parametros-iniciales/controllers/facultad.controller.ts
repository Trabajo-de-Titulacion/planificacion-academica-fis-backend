import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FacultadDTO } from "../dtos/facultad.dto";
import { FacultadService } from "../services/facultad.service";

@ApiTags("Facultades")
@Controller("api/facultades")
export class FacultadController {

    constructor(
        private servicioFacultad : FacultadService
    ){}

    @Post('/crearFacultad')
    async crearFacultad(@Body() facultad : FacultadDTO){
        return await this.servicioFacultad.crearFacultad(facultad);
    }

    @Get('/obtenerFacultades')
    async obtenerFacultades(){
        return await this.servicioFacultad.obtenerFacultades()
    }

    @Get('obtenerFacultadPorSuID/:id')
    async obtenerFacultadPorSuID(@Param('id') id : string ){
        return await this.servicioFacultad.obtenerFacultadPorSuID(id);
    }
}