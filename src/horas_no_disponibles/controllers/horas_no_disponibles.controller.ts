import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HorasNoDisponiblesService } from '../services/horas_no_disponibles.service';
import { HorasNoDisponiblesDTO } from '../dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';

@ApiTags(configuraciones.controladores.horas_no_disponibles.tag)
@Controller(configuraciones.controladores.horas_no_disponibles.ruta)
export class HorasNoDisponiblesController {
  constructor(private horasNoDisponiblesService: HorasNoDisponiblesService) {}

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.obtenerHorasNoDisponiblesPorDocenteId.descripcion})
  @Get(configuraciones.controladores.horas_no_disponibles.operaciones.obtenerHorasNoDisponiblesPorDocenteId.ruta)
  obtenerHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    return this.horasNoDisponiblesService.obtenerHorasNoDisponiblesPorDocenteId(id);
  }

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.crearHoraNoDisponible.descripcion})
  @Post(configuraciones.controladores.horas_no_disponibles.operaciones.crearHoraNoDisponible.ruta)
  crearHoraNoDisponible(@Body() hora_no_disponible: HorasNoDisponiblesDTO) {
    return this.horasNoDisponiblesService.crearHoraNoDisponible(hora_no_disponible);
  }

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.crearHorasNoDisponibles.descripcion})
  @Post(configuraciones.controladores.horas_no_disponibles.operaciones.crearHorasNoDisponibles.ruta)
  crearHorasNoDisponibles(@Body() horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    return this.horasNoDisponiblesService.crearHorasNoDisponibles(horas_no_disponibles);
  }

  @ApiOperation({summary: configuraciones.controladores.horas_no_disponibles.operaciones.eliminarHorasNoDisponiblesPorDocenteId.descripcion})
  @Delete(configuraciones.controladores.horas_no_disponibles.operaciones.eliminarHorasNoDisponiblesPorDocenteId.ruta)
  eliminarHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    return this.horasNoDisponiblesService.eliminarHorasNoDisponiblesPorDocenteId(id);
  }

}