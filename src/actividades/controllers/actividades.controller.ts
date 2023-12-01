import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CrearActividadDto } from '../dtos/crear-actividad.dto';
import { ActividadesService } from '../services/actividades.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CrearRestriccionDto } from '../dtos/crear-restriccion.dto';

@ApiTags('Actividades')
@Controller('actividades')
export class ActividadesController {
  constructor(private actividadesService: ActividadesService) {}

  @Post('crearUnaActividad')
  crearUnaActividad(@Body() actividad: CrearActividadDto) {
    return this.actividadesService.crearActividad(actividad);
  }

  @Public()
  @Post('crearRestriccion')
  crearRestriccion(@Body() restriccion: CrearRestriccionDto){
    return this.actividadesService.crearRestriccion(restriccion);
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

  @Get('obtenerRestriccionesPorId/:id')
  @Public()
  async obtenerRestriccionesPorId(@Param('id',ParseIntPipe) id: number){
    return await this.actividadesService.obtenerRestriccionesPorId(id);
  }

  //PAra obtener reestricciones del docente por ID
  @Get('obtenerRestriccionesDelDocentePorId/:id')
  @Public()
  async obtenerRestriccionedelDocentePorId(@Param('id') id: string){
    return await this.actividadesService.obtenerRestriccionesDelDocentePorId(id);
  }

  @Delete('eliminarRestriccionPorId/:id')
  @Public()
  async eliminarRestriccionPorId(@Param('id',ParseIntPipe) id: number){
    return await this.actividadesService.eliminarRestriccionPorId(id);
  }

}
