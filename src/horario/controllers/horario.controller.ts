import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Roles } from '../../../src/auth/decorators/roles.decorator';
import { configuraciones } from '../../../src/config/swagger-config';
import { RolesEnum } from '../../../src/utils/enum/rol.enum';
import { GenerarHorarioDto } from '../dto/generar-horario.dto';
import { HorarioDto } from '../dto/horario.dto';
import { HorarioService } from '../services/horario.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.horario.tag)
@Controller(configuraciones.controladores.horario.ruta)
export class HorarioController {
  constructor(private horarioService: HorarioService) {}

  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.crearHorario
        .descripcion,
  })
  @Post(configuraciones.controladores.horario.operaciones.crearHorario.ruta)
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  async crearHorario(@Body() horario: HorarioDto) {
    await this.horarioService.crearHorario(horario);
  }

  /* ===================================================================================================== */
  /* ======================================= OBTENER HORARIO DOCENTE ===================================== */
  /* ===================================================================================================== */

  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.obtenerHorarioDocente
        .descripcion,
  })
  @Get(
    configuraciones.controladores.horario.operaciones.obtenerHorarioDocente
      .ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  obtenerHorarioDocente(
    @Param('nombreDocente') nombreDocente: string,
    @Param('idHorario') idHorario: string,
  ) {
    // Formatear y convertir en mayúsculas
    nombreDocente = nombreDocente.toUpperCase();
    return this.horarioService.obtenerHorarioDocente(nombreDocente, idHorario);
  }

  /* ===================================================================================================== */
  /* ======================================= OBTENER HORARIO GRUPO ======================================= */
  /* ===================================================================================================== */

  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo
        .descripcion,
  })
  @Get(
    configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo.ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  async obtenerHorarioGrupo(
    @Param('grupo') grupo: string,
    @Param('idHorario') idHorario: string,
  ) {
    // Formatear y convertir en mayúsculas
    grupo = grupo.toUpperCase();
    return await this.horarioService.obtenerHorarioGrupo(grupo, idHorario);
  }

  /* ===================================================================================================== */
  /* ======================================= OBTENER HORARIO AULA ===================================== */
  /* ===================================================================================================== */

  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.obtenerHorarioAula
        .descripcion,
  })
  @Get(
    configuraciones.controladores.horario.operaciones.obtenerHorarioAula
      .ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  obtenerHorarioAula(
    @Param('nombreAula') nombreAula: string,
    @Param('idHorario') idHorario: string,
  ) {
    // Formatear y convertir en mayúsculas
    nombreAula = nombreAula.toUpperCase();
    return this.horarioService.obtenerHorarioAula(nombreAula, idHorario);
  }

  /* ========================================================================================================= */
  /* ======================================= OBTENER TODOS LOS HORARIOS  ===================================== */
  /* ========================================================================================================= */

  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.obtenerHorarios
        .descripcion,
  })
  @Get(configuraciones.controladores.horario.operaciones.obtenerHorarios.ruta)
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  obtenerHorarios() {
    return this.horarioService.obtenerHorarios();
  }

  /* ================================================================================================= */
  /* ======================================= OBTENER UN HORARIO  ===================================== */
  /* ================================================================================================= */

  @ApiOperation({
    summary:
      configuraciones.controladores.horario.operaciones.obtenerHorarioPorID
        .descripcion,
  })
  @Get(
    configuraciones.controladores.horario.operaciones.obtenerHorarioPorID.ruta,
  )
  @Roles(RolesEnum.COORDINADOR, RolesEnum.SUBDECANO)
  obtenerHorarioPorID(@Param('id') idHorario: string) {
    if (idHorario && !isUUID(idHorario)) {
      throw new HttpException('ID de horario inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horarioService.obtenerHorarioPorID(idHorario);
  }

  @Post('generarHorario')
  generarHorario(@Body() data: GenerarHorarioDto) {
    return this.horarioService.generarHorario(data.email);
  }

  @Post('cargarFET')
  @UseInterceptors(FileInterceptor('archivoFet'))
  @Roles(RolesEnum.COORDINADOR)
  async cargarFET(@UploadedFile() file: Express.Multer.File) {
    // Guardar información
    const informacion = file.buffer.toString();

    Logger.log('[CARGAR_FET] cargando fet...');
    return await this.horarioService.procesarPlanificacion(
      informacion,
      'coordinador@epn.edu.ec',
    );
  }
}
