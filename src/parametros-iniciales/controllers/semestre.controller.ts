import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SemestreDTO } from '../dtos/semestre.dto';
import { SemestreService } from '../services/semestre.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Semestres')
@Controller('/semestre')
export class SemestreController {
  constructor(private servicioSemestre: SemestreService) {}

  @Post('/crearSemestre')
  async crearSemestre(@Body() semestre: SemestreDTO) {
    return this.servicioSemestre.crearSemestre(semestre);
  }

  @Get('/obtenerSemestres')
  async obtenerSemestres() {
    return this.servicioSemestre.obtenerSemestres();
  }

  @Get('/obtenerSemestreConPlanificacionEnProgreso')
  async obtenerSemestreConPlanificacionEnProgreso() {
    return this.servicioSemestre.obtenerSemestreConPlanificacionEnProgreso();
  }
}
