import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CrearActividadDto } from '../dtos/crear-actividad.dto';
import { ActividadesService } from '../services/actividades.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CrearRestriccionDto } from '../dtos/crear-restriccion.dto';
import { ActualizarActividadDto } from '../dtos/actualizar-actividad.dto';

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
  crearRestriccion(@Body() restriccion: CrearRestriccionDto) {
    return this.actividadesService.crearRestriccion(restriccion);
  }

  @Get('obtenerActividades')
  obtenerActividades() {
    return this.actividadesService.obtenerActividades();
  }

  @Get('obtenerActividad/:id')
  @Public()
  async obtenerActividadporId(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.obtenerActividadPorId(id);
  }

  //Actualizar por Id
  @Put('actualizarActividadPorId/:id')
  @Public()
  async actualizarActividadPorId(
    @Param('id') idActividad: number,
    @Body() actividadDto: ActualizarActividadDto,
  ) {
    console.log('actualizar actividad', idActividad, actividadDto);
    return await this.actividadesService.actualizarActividadPorId(
      idActividad,
      actividadDto,
    );
  }

  @Get('obtenerRestriccionesPorId/:id')
  @Public()
  async obtenerRestriccionesPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.obtenerRestriccionesPorId(id);
  }

  //PAra obtener reestricciones del docente por ID
  @Get('obtenerRestriccionesDelDocentePorId/:id')
  @Public()
  async obtenerRestriccionedelDocentePorId(@Param('id') id: string) {
    return await this.actividadesService.obtenerRestriccionesDelDocentePorId(
      id,
    );
  }

  @Delete('eliminarRestriccionPorId/:id')
  @Public()
  async eliminarRestriccionPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.eliminarRestriccionPorId(id);
  }

  //
  @Delete('eliminarActividadPorId/:id')
  @Public()
  async eliminarActividad(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.eliminarActividadPorId(id);
  }
}
