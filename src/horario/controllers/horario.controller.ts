import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
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

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarioDocente.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarioDocente.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarioDocente(@Param('nombreDocente') nombreDocente: string, @Param('idHorario') idHorario: string) {
        // Formatear y convertir en mayúsculas
        nombreDocente = nombreDocente.toUpperCase();
        return this.horarioService.obtenerHorarioDocente(nombreDocente, idHorario);
    }

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarioGrupo.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarioGrupo(@Param('grupo') grupo: string, @Param('idHorario') idHorario: string) {
        // Formatear y convertir en mayúsculas
        grupo = grupo.toUpperCase();
        return this.horarioService.obtenerHorarioGrupo(grupo, idHorario);
    }

    @ApiOperation({ summary: configuraciones.controladores.horario.operaciones.obtenerHorarios.descripcion })
    @Get(configuraciones.controladores.horario.operaciones.obtenerHorarios.ruta)
    @Roles(RolesEnum.COORDINADOR || RolesEnum.SUBDECANO)
    obtenerHorarios() {
        return this.horarioService.obtenerHorarios();
    }
}