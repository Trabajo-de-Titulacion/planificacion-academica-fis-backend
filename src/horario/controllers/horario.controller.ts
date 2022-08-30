import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { isUUID } from "class-validator";
import { Roles } from "../../../src/auth/decorators/roles.decorator";
import { configuraciones } from "../../../src/config/swagger-config";
import { RolesEnum } from "../../../src/utils/enum/rol.enum";
import { HorarioDto } from "../dto/horario.dto";
import { HorarioService } from "../services/horario.service";

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.horario.tag)
@Controller(configuraciones.controladores.horario.ruta)
export class HorarioController {

    constructor(
        private horarioService: HorarioService
    ) { }

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.crearHorario.descripcion })
    @Post(configuraciones.controladores.horario.operaciones.crearHorario.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    crearHorario(@Body() horario: HorarioDto) {
        this.horarioService.crearHorario(horario);
    }

    /* ===================================================================================================== */
    /* ======================================= OBTENER HORARIO DOCENTE ===================================== */
    /* ===================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarioDocente.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarioDocente.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarioDocente(@Param('nombreDocente') nombreDocente: string, @Param('idHorario') idHorario: string) {
        // Formatear y convertir en mayúsculas
        nombreDocente = nombreDocente.toUpperCase();
        return this.horarioService.obtenerHorarioDocente(nombreDocente, idHorario);
    }

    /* ===================================================================================================== */
    /* ======================================= OBTENER HORARIO GRUPO ======================================= */
    /* ===================================================================================================== */

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarioGrupo(@Param('grupo') grupo: string, @Param('idHorario') idHorario: string) {
        // Formatear y convertir en mayúsculas
        grupo = grupo.toUpperCase();
        return this.horarioService.obtenerHorarioGrupo(grupo, idHorario);
    }

    /* ========================================================================================================= */
    /* ======================================= OBTENER TODOS LOS HORARIOS  ===================================== */
    /* ========================================================================================================= */

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarios.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarios.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarios() {
        return this.horarioService.obtenerHorarios();
    }

    /* ================================================================================================= */
    /* ======================================= OBTENER UN HORARIO  ===================================== */
    /* ================================================================================================= */

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarioPorID.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarioPorID.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarioPorID(@Param('id') idHorario: string) {
        if (idHorario && !isUUID(idHorario)) {
            throw new HttpException('ID de horario inválido', HttpStatus.BAD_REQUEST);
        }
        return this.horarioService.obtenerHorarioPorID(idHorario);
    }
}