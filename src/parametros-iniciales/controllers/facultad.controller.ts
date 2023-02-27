import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacultadDTO } from '../dtos/facultad.dto';
import { FacultadService } from '../services/facultad.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Facultades')
@Controller('facultades')
export class FacultadController {
  constructor(private servicioFacultad: FacultadService) {}

  @Post('/crearFacultad')
  @ApiOperation({
    summary: 'Método que permite crear una facultad con su nombre.',
  })
  @ApiBody({
    type: FacultadDTO,
    description: 'Objeto con los atributos necesarios para crear una facultad',
  })
  async crearFacultad(@Body() facultad: FacultadDTO) {
    return await this.servicioFacultad.crearFacultad(facultad);
  }

  @Get('/obtenerFacultades')
  @ApiOperation({
    summary: 'Método para obtener todas las facultades',
  })
  async obtenerFacultades() {
    return await this.servicioFacultad.obtenerFacultades();
  }

  @Get('obtenerFacultadPorSuID/:id')
  @ApiOperation({
    summary: 'Método para obtener una facultad por su identificador (ID).',
  })
  async obtenerFacultadPorSuID(@Param('id') id: string) {
    return await this.servicioFacultad.obtenerFacultadPorSuID(id);
  }
}
