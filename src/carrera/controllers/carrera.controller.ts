import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CarreraService } from '../services/carrera.service';
import { CarreraDto } from '../../carrera/dto/carrera.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.carrera.tag)
@Controller(configuraciones.controladores.carrera.ruta)
export class CarreraController {

    constructor(private carreraService: CarreraService) { }

    /* =================================================================================================================== */
    /* ======================================= CREAR UNA CARRERA EN LA BASE DE DATOS ===================================== */
    /* =================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.crearUnaCarrera.descripcion })
    @Post(configuraciones.controladores.carrera.operaciones.crearUnaCarrera.ruta)
    @Roles(RolesEnum.COORDINADOR)
    crearUnaCarrera(@Body() carreraDto: CarreraDto) {
        // Formatear y convertir en mayúsculas
        carreraDto.codigo = carreraDto.codigo.toUpperCase();
        carreraDto.modalidad = carreraDto.modalidad.toUpperCase();
        carreraDto.nombre = carreraDto.nombre.toUpperCase();
        return this.carreraService.crearUnaCarrera(carreraDto);
    }

    /* =================================================================================================================== */
    /* =================================== ACTUALIZAR UNA CARRERA EN LA BASE DE DATOS ==================================== */
    /* =================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.actualizarCarreraPorID.descripcion })
    @Put(configuraciones.controladores.carrera.operaciones.actualizarCarreraPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    actualizarCarreraPorID(@Param('id') idCarrera: string, @Body() carreraDto: CarreraDto) {
        // Formatear y convertir en mayúsculas 
        carreraDto.codigo = carreraDto.codigo.toUpperCase();
        carreraDto.modalidad = carreraDto.modalidad.toUpperCase();
        carreraDto.nombre = carreraDto.nombre.toUpperCase();
        return this.carreraService.actualizarCarreraPorID(idCarrera, carreraDto);
    }

    /* =================================================================================================================== */
    /* ==================================== ELIMINAR UNA CARRERA EN LA BASE DE DATOS ===================================== */
    /* =================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.eliminarCarreraPorID.descripcion })
    @Delete(configuraciones.controladores.carrera.operaciones.eliminarCarreraPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    eliminarCarreraPorID(@Param('id') idCarrera: string) {
        return this.carreraService.eliminarCarreraPorID(idCarrera);
    }

    /* ====================================================================================================================== */
    /* ============================= OBTENER UNA CARRERA POR SU CÓDIGO EN LA BASE DE DATOS ================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.obtenerCarreraPorCodigo.desripcion })
    @Get(configuraciones.controladores.carrera.operaciones.obtenerCarreraPorCodigo.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerCarreraPorCodigo(@Param('codigo') codigoCarrera: string) {
        return this.carreraService.obtenerCarreraPorCodigo(codigoCarrera);
    }

    /* ====================================================================================================================== */
    /* =============================== OBTENER UNA CARRERA POR SU ID EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.obtenerCarreraPorID.descripcion })
    @Get(configuraciones.controladores.carrera.operaciones.obtenerCarreraPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerCarreraPorID(@Param('id') idCarrera: string) {
        return this.carreraService.obtenerCarreraPorID(idCarrera);
    }

    /* ====================================================================================================================== */
    /* ================================= OBTENER TODAS LAS CARRERA EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.carrera.operaciones.obtenerCarreras.descripcion })
    @Get(configuraciones.controladores.carrera.operaciones.obtenerCarreras.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerCarreras() {
        return this.carreraService.obtenerCarreras();
    }

}
