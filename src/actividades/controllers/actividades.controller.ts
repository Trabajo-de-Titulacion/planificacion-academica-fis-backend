import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CrearActividadDto } from '../dtos/crear-actividad.dto';
import { ActividadesService } from '../services/actividades.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Actividades')
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

  @Get('obtenerActividad/:id')
  @Public()
  async obtenerActividadporId(@Param('id',ParseIntPipe) id:number){
    return await this.actividadesService.obtenerActividadPorId(id);
  }
}
