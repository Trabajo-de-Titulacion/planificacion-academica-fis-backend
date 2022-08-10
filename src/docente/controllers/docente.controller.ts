import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { DocenteService } from "../services/docente.service";
import { DocenteDto } from "../dto/docente.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { configuraciones } from "../../config/swagger-config";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RolesEnum } from "../../utils/enum/rol.enum";
import { CrearUsuarioDTO } from "../../usuarios/dtos/usuario.dto";
const crypto = require('crypto');

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.docente.tag)
@Controller(configuraciones.controladores.docente.ruta)
export class DocenteController {

    constructor(private docenteService: DocenteService) { }

    /* ====================================================================================================================== */
    /* ======================================== CREAR UN DOCENTE EN LA BASE DE DATOS ======================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.crearUnDocente.descripcion })
    @Post(configuraciones.controladores.docente.operaciones.crearUnDocente.ruta)
    @Roles(RolesEnum.COORDINADOR)
    crearDocente(@Body() docenteDto: DocenteDto) {
        //Formaterar y generar los datos
        docenteDto.nombreCompleto = docenteDto.nombreCompleto.toUpperCase();
        return this.docenteService.crearDocente(docenteDto, this.generarClaveDocente());
    }

    /* ====================================================================================================================== */
    /* ===================================== CREAR VARIOS DOCENTES EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.crearVariosDocentes.descripcion })
    @Post(configuraciones.controladores.docente.operaciones.crearVariosDocentes.ruta)
    @UseInterceptors(FileInterceptor('archivoDocentes'))
    @Roles(RolesEnum.COORDINADOR)
    crearVariosDocentes(@UploadedFile() file: Express.Multer.File) {
        // Leer el archivo y generar los arreglos de datos
        const arreglos = this.leerArchivoDocentes(file);
        return this.docenteService.crearVariosDocentes(arreglos.arregloDocente, arreglos.arregloUsuario);
    }

    /* ====================================================================================================================== */
    /* =================================== OBTENER UN DOCENTE POR ID EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.obtenerDocentePorID.descripcion })
    @Get(configuraciones.controladores.docente.operaciones.obtenerDocentePorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerDocentePorID(@Param('id') id: string) {
        return this.docenteService.obtenerDocentePorID(id); // Envio del id 
    }

    /* ====================================================================================================================== */
    /* =========================== OBTENER UN DOCENTE POR CORREO ELECTRÓNICO EN LA BASE DE DATOS ============================ */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.obtenerDocentePorCorreoElectronico.descripcion })
    @Get(configuraciones.controladores.docente.operaciones.obtenerDocentePorCorreoElectronico.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerDocentePorCorreoElectronico(@Param('correo') correoElectronicoDocente: string) {
        return this.docenteService.obtenerDocentePorCorreoElectronico(correoElectronicoDocente); // Envio del correo electronico
    }

    /* ====================================================================================================================== */
    /* ===================================== ACTUALIZAR UN DOCENTE EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.actualizarDocentePorID.descripcion })
    @Put(configuraciones.controladores.docente.operaciones.actualizarDocentePorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    actualizarDocentePorID(@Param('id') idDocente: string, @Body() docenteDto: DocenteDto) {
        return this.docenteService.actualizarDocentePorID(idDocente, docenteDto);
    }


    /* ====================================================================================================================== */
    /* ====================================== ELIMINAR UN DOCENTE EN LA BASE DE DATOS ======================================= */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.eliminarDocentePorID.descripcion })
    @Delete(configuraciones.controladores.docente.operaciones.eliminarDocentePorID.ruta)
    @Roles(RolesEnum.COORDINADOR)
    eliminarDocentePorID(@Param('id') idDocente: string) {
        return this.docenteService.eliminarDocentePorID(idDocente);
    }

    /* ====================================================================================================================== */
    /* ================================== OBTENER TODOS LOS DOCENTES EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.docente.operaciones.obtenerDocentes.descripcion })
    @Get(configuraciones.controladores.docente.operaciones.obtenerDocentes.ruta)
    @Roles(RolesEnum.COORDINADOR)
    obtenerDocentes() {
        return this.docenteService.obtenerDocentes();
    }

    /* ====================================================================================================================== */
    /* ========================================== MÉTODO DE GENERACIÓN DEL CÓDIGO =========================================== */
    /* ====================================================================================================================== */

    generarClaveDocente() {
        const generador = (
            length = 20, // Código de 20 digitos
            wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
        ) =>
            Array.from(crypto.randomFillSync(new Uint32Array(length)))
                .map((x) => wishlist[Number(x) % wishlist.length])
                .join('')
        return generador();
    }

    /* ====================================================================================================================== */
    /* =========================================== MÉTODO DE LECTURA DEL ARCHIVO ============================================ */
    /* ====================================================================================================================== */

    leerArchivoDocentes(file: Express.Multer.File) {
        const arregloDocente: DocenteDto[] = [];
        const arregloUsuario: CrearUsuarioDTO[] = []
        const informacionDocentes = file.buffer.toString().split(/['\r\n,']+/);

        for (let i = 0; i < informacionDocentes.length; i = i + 2) {
            if (informacionDocentes[i].trim() != "") {
                arregloDocente[i / 2] = {
                    nombreCompleto: informacionDocentes[i].toUpperCase(), correoElectronico: informacionDocentes[i + 1]
                }
                arregloUsuario[i / 2] = {
                    correo: informacionDocentes[i].toUpperCase(), clave: this.generarClaveDocente()
                }
            }
        }
        return { arregloDocente: arregloDocente, arregloUsuario: arregloUsuario }
    }

}