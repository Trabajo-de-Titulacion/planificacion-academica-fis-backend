import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { configuraciones } from '../../config/swagger-config';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { AsignaturaDto } from '../../asignatura/dto/asignatura.dto';
import { AsignaturaService } from '../../asignatura/services/asignatura.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.asignatura.tag)
@Controller(configuraciones.controladores.asignatura.ruta)
export class AsignaturaController {

    constructor(private asignaturaService: AsignaturaService) { }

    /* ====================================================================================================================== */
    /* ====================================== CREAR UNA ASIGNATURA EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.crearUnaAsignatura.descripcion })
    @Post(configuraciones.controladores.asignatura.operaciones.crearUnaAsignatura.ruta)
    @Roles(RolesEnum.COORDINADOR)
    crearUnaAsignatura(@Body() asignaturaDto: AsignaturaDto) {
        // Formatear y generar los datos
        asignaturaDto.codigo = asignaturaDto.codigo.toUpperCase().trim();
        asignaturaDto.nombre = asignaturaDto.nombre.toUpperCase().trim();
        return this.asignaturaService.crearUnaAsignatura(asignaturaDto);
    }

    /* ====================================================================================================================== */
    /* ====================================== VARIAS ASIGNATURAS EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.crearVariasAsignaturas.descripcion })
    @Post(configuraciones.controladores.asignatura.operaciones.crearVariasAsignaturas.ruta)
    @UseInterceptors(FileInterceptor('archivoAsignaturas'))
    @Roles(RolesEnum.COORDINADOR)
    crearVariasAsignaturas(@UploadedFile() file: Express.Multer.File) {
        // Leer el archivo y generar los arreglos de datos
        const arreglo = this.leerArchivoAsignatura(file);
        return this.asignaturaService.crearVariasAsignaturas(arreglo);
    }


    /* ====================================================================================================================== */
    /* =================================== ACTUALIZAR UNA ASIGNATURA EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.actualizarAsignaturaPorID.descripcion })
    @Put(configuraciones.controladores.asignatura.operaciones.actualizarAsignaturaPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    actualizarAsignaturasPorID(@Param('id') idAsignatura: string, @Body() asignaturaDto: AsignaturaDto) {
        // Formatear y generar los datos
        asignaturaDto.codigo = asignaturaDto.codigo.toUpperCase().trim();
        asignaturaDto.nombre = asignaturaDto.nombre.toUpperCase().trim();
        return this.asignaturaService.actualizarAsignaturaPorID(idAsignatura, asignaturaDto);
    }

    /* ====================================================================================================================== */
    /* ==================================== ELIMINAR UNA ASIGNATURA EN LA BASE DE DATOS ===================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.eliminarAsignaturaPorID.descripcion })
    @Delete(configuraciones.controladores.asignatura.operaciones.eliminarAsignaturaPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    eliminarAsignaturaPorID(@Param('id') idAsignatura: string) {
        return this.asignaturaService.eliminarAsignaturaPorID(idAsignatura);
    }

    /* ====================================================================================================================== */
    /* ============================= OBTENER UNA ASIGNATURA POR SU CÓDIGO EN LA BASE DE DATOS =============================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.obtenerAsignaturaPorCodigo.descripcion })
    @Get(configuraciones.controladores.asignatura.operaciones.obtenerAsignaturaPorCodigo.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerAsignaturaPorCodigo(@Param('codigo') codigoAsignatura: string) {
        return this.asignaturaService.obtenerAsignaturaPorCodigo(codigoAsignatura);
    }

    /* ====================================================================================================================== */
    /* =============================== OBTENER UNA ASIGNATURA POR SU ID EN LA BASE DE DATOS ================================= */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.obtenerAsignaturaPorID.ruta })
    @Get(configuraciones.controladores.asignatura.operaciones.obtenerAsignaturaPorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerAsignaturaPorID(@Param('id') idAsignatura: string) {
        return this.asignaturaService.obtenerAsignaturaPorID(idAsignatura);
    }

    /* ====================================================================================================================== */
    /* ================================= OBTENER TODAS LAS ASIGNATURAS EN LA BASE DE DATOS ================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.asignatura.operaciones.obtenerAsignaturas.descripcion })
    @Get(configuraciones.controladores.asignatura.operaciones.obtenerAsignaturas.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerAsignatura() {
        return this.asignaturaService.obtenerAsignatura();
    }

    /* ====================================================================================================================== */
    /* =========================================== MÉTODO DE LECTURA DEL ARCHIVO ============================================ */
    /* ====================================================================================================================== */

    leerArchivoAsignatura(file: Express.Multer.File) {
        const arregloAsignatura: AsignaturaDto[] = [];
        const informacionAsignatura = file.buffer.toString().split(/['\r\n,']+/);
        for (let i = 0; i < informacionAsignatura.length; i = i + 3) {
            if (informacionAsignatura[i].trim() != "") {
                arregloAsignatura[i / 3] = {
                    codigo: informacionAsignatura[i].toUpperCase().trim(),
                    nombre: informacionAsignatura[i + 1].toUpperCase().trim(),
                    creditos: Number(informacionAsignatura[i + 2].toUpperCase().trim())
                }
            }
        }
        return arregloAsignatura;
    }

}
