import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { HorasNoDisponiblesService } from '../services/horas_no_disponibles.service';
import { HorasNoDisponiblesDTO } from '../dto';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';
import { isUUID } from 'class-validator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { VerificarIdDocentePorParametroGuard } from '../guards/verificar_id_docente_por_parametro.guard';
import { VerificarIdDocentePorCuerpoGuard } from '../guards/verificar_id_docente_por_cuerpo.guard';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.horas_no_disponibles.tag)
@ApiExtraModels(HorasNoDisponiblesDTO)
@Controller(configuraciones.controladores.horas_no_disponibles.ruta)
@Roles(RolesEnum.DOCENTE)
export class HorasNoDisponiblesController {
  constructor(private horasNoDisponiblesService: HorasNoDisponiblesService) {}

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.obtenerHorasNoDisponiblesPorDocenteId.descripcion})
  @Get(configuraciones.controladores.horas_no_disponibles.operaciones.obtenerHorasNoDisponiblesPorDocenteId.ruta)
  @UseGuards(VerificarIdDocentePorParametroGuard)
  obtenerHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horasNoDisponiblesService.obtenerHorasNoDisponiblesPorDocenteId(id);
  }
  
  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.crearHorasNoDisponibles.descripcion})
  @Post(configuraciones.controladores.horas_no_disponibles.operaciones.crearHorasNoDisponibles.ruta)
  @UseGuards(VerificarIdDocentePorCuerpoGuard)
  async solicitarHorasNoDisponibles(@Body() horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    return this.horasNoDisponiblesService.solicitarHorasNoDisponibles(horas_no_disponibles);
  }

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.eliminarHorasNoDisponiblesPorDocenteId.descripcion})
  @Delete(configuraciones.controladores.horas_no_disponibles.operaciones.eliminarHorasNoDisponiblesPorDocenteId.ruta)
  @UseGuards(VerificarIdDocentePorParametroGuard)
  eliminarHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horasNoDisponiblesService.eliminarHorasNoDisponiblesPorDocenteId(id);
  }

}