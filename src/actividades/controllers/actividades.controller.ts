import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearActividadDto } from '../dtos/crear-actividad.dto';
import { ActividadesService } from '../services/actividades.service';

@Controller('actividades')
export class ActividadesController {
  constructor(private actividadesService: ActividadesService) {}

  @Post('crearUnaActividad')
  crearUnaActividad(@Body() actividad: CrearActividadDto) {
    return this.actividadesService.crearActividad(actividad);
  }

  @Get('obtenerActividades')
  obtenerActividades() {
    return this.actividadesService.obtenerActividades();
  }
}
