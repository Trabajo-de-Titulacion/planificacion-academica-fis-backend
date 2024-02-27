import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocenteService } from '../services/docente.service';
import { DocenteDto } from '../dto/docente.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { configuraciones } from '../../config/swagger-config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { CrearUsuarioDTO } from '../../usuarios/dtos/usuario.dto';
import { isUUID } from 'class-validator';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.docente.tag)
@Controller(configuraciones.controladores.docente.ruta)
export class DocenteController {
  constructor(private docenteService: DocenteService) {}

  /* ====================================================================================================================== */
  /* ======================================== CREAR UN DOCENTE EN LA BASE DE DATOS ======================================== */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.crearUnDocente
        .descripcion,
  })
  @Post(configuraciones.controladores.docente.operaciones.crearUnDocente.ruta)
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  crearDocente(@Body() docenteDto: DocenteDto) {
    //Formatear y generar los datos
    docenteDto.nombreCompleto = docenteDto.nombreCompleto.toUpperCase().trim();
    return this.docenteService.crearDocente(
      docenteDto,
      this.generarClaveDocente(),
    );
  }

  /* ====================================================================================================================== */
  /* ===================================== CREAR VARIOS DOCENTES EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.crearVariosDocentes
        .descripcion,
  })
  @Post(
    configuraciones.controladores.docente.operaciones.crearVariosDocentes.ruta,
  )
  @UseInterceptors(FileInterceptor('archivoDocentes'))
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  crearVariosDocentes(@UploadedFile() file: Express.Multer.File) {
    // Leer el archivo y generar los arreglos de datos
    const arreglos = this.leerArchivoDocentes(file);
    return this.docenteService.crearVariosDocentes(
      arreglos.arregloDocente,
      arreglos.arregloUsuario,
    );
  }

  /* ====================================================================================================================== */
  /* =================================== OBTENER UN DOCENTE POR ID EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.obtenerDocentePorID
        .descripcion,
  })
  @Get(
    configuraciones.controladores.docente.operaciones.obtenerDocentePorID.ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  obtenerDocentePorID(@Param('id') id: string) {
    if (id && !isUUID(id)) {
      throw new HttpException(
        'ID del docente inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.docenteService.obtenerDocentePorID(id); // Envio del id
  }

  /* ====================================================================================================================== */
  /* =========================== OBTENER UN DOCENTE POR CORREO ELECTRÓNICO EN LA BASE DE DATOS ============================ */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones
        .obtenerDocentePorCorreoElectronico.descripcion,
  })
  @Get(
    configuraciones.controladores.docente.operaciones
      .obtenerDocentePorCorreoElectronico.ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  obtenerDocentePorCorreoElectronico(
    @Param('correo') correoElectronicoDocente: string,
  ) {
    return this.docenteService.obtenerDocentePorCorreoElectronico(
      correoElectronicoDocente,
    ); // Envio del correo electronico
  }

  /* ====================================================================================================================== */
  /* ===================================== ACTUALIZAR UN DOCENTE EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.actualizarDocentePorID
        .descripcion,
  })
  @Put(
    configuraciones.controladores.docente.operaciones.actualizarDocentePorID
      .ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  actualizarDocentePorID(
    @Param('id') idDocente: string,
    @Body() docenteDto: DocenteDto,
  ) {
    if (idDocente && !isUUID(idDocente)) {
      throw new HttpException(
        'ID del docente inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    docenteDto.correoElectronico = docenteDto.correoElectronico.trim();
    docenteDto.nombreCompleto = docenteDto.nombreCompleto.toUpperCase().trim();
    return this.docenteService.actualizarDocentePorID(idDocente, docenteDto);
  }

  /* ====================================================================================================================== */
  /* ====================================== ELIMINAR UN DOCENTE EN LA BASE DE DATOS ======================================= */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.eliminarDocentePorID
        .descripcion,
  })
  @Delete(
    configuraciones.controladores.docente.operaciones.eliminarDocentePorID.ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  eliminarDocentePorID(@Param('id') idDocente: string) {
    if (idDocente && !isUUID(idDocente)) {
      throw new HttpException(
        'ID del docente inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.docenteService.eliminarDocentePorID(idDocente);
  }

  /* ====================================================================================================================== */
  /* ================================== OBTENER TODOS LOS DOCENTES EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.docente.operaciones.obtenerDocentes
        .descripcion,
  })
  @Get(configuraciones.controladores.docente.operaciones.obtenerDocentes.ruta)
  @Roles(RolesEnum.COORDINADOR, RolesEnum.ASISTENTE_ACADEMICO)
  obtenerDocentes() {
    return this.docenteService.obtenerDocentes();
  }

  /* ====================================================================================================================== */
  /* ========================================== MÉTODO DE GENERACIÓN DEL CÓDIGO =========================================== */
  /* ====================================================================================================================== */

  generarClaveDocente() {
    const valoresPosibles = {
      mayusculas: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      minusculas: 'qwertyuiopasdfghjklzxcvbnm',
      numeros: '1234567890',
      simbolos: '!@$%&*',
    };

    const obtenerValorAleatorioDelString = (str) =>
      str.charAt(Math.floor(Math.random() * str.length));
    let clave = '';
    clave += obtenerValorAleatorioDelString(valoresPosibles.mayusculas);
    clave += obtenerValorAleatorioDelString(valoresPosibles.minusculas);
    clave += obtenerValorAleatorioDelString(valoresPosibles.numeros);
    clave += obtenerValorAleatorioDelString(valoresPosibles.simbolos);
    for (let i = clave.length; i < 16; i++) {
      clave += obtenerValorAleatorioDelString(
        Object.values(valoresPosibles).join(''),
      );
    }
    return clave;
  }

  /* ====================================================================================================================== */
  /* =========================================== MÉTODO DE LECTURA DEL ARCHIVO ============================================ */
  /* ====================================================================================================================== */

  leerArchivoDocentes(file: Express.Multer.File) {
    const arregloDocente: DocenteDto[] = [];
    const arregloUsuario: CrearUsuarioDTO[] = [];
    const informacionDocentes = file.buffer.toString().split(/['\r\n,']+/);

    for (let i = 0; i < informacionDocentes.length; i = i + 2) {
      if (informacionDocentes[i].trim() != '') {
        arregloDocente[i / 2] = {
          nombreCompleto: informacionDocentes[i].toUpperCase().trim(),
          correoElectronico: informacionDocentes[i + 1],
        };
        arregloUsuario[i / 2] = {
          correo: informacionDocentes[i].toUpperCase().trim(),
          clave: this.generarClaveDocente(),
        };
      }
    }
    return { arregloDocente: arregloDocente, arregloUsuario: arregloUsuario };
  }
}
