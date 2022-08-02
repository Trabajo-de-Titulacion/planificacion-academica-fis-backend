import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HorasNoDisponiblesService } from './horas_no_disponibles.service';
import { HorasNoDisponiblesDTO } from './dto';

@Controller('horas_no_disponibles')
export class HorasNoDisponiblesController {
  constructor(private horasNoDisponiblesService: HorasNoDisponiblesService) {}

  @Get(':id')
  obtenerHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    return this.horasNoDisponiblesService.obtenerHorasNoDisponiblesPorDocenteId(id);
  }

  @Post('crearHora')
  crearHoraNoDisponible(@Body() hora_no_disponible: HorasNoDisponiblesDTO) {
    return this.horasNoDisponiblesService.crearHoraNoDisponible(hora_no_disponible);
  }

  @Post('crearHoras')
  crearHorasNoDisponibles(@Body() horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    return this.horasNoDisponiblesService.crearHorasNoDisponibles(horas_no_disponibles);
  }

  @Delete(':id')
  eliminarHorasNoDisponiblesPorDocenteId(@Param('id') id: string) {
    return this.horasNoDisponiblesService.eliminarHorasNoDisponiblesPorDocenteId(id);
  }

}