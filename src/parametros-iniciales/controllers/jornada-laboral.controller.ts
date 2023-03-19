import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JornadaLaboralDto } from '../dtos/jornada-laboral.dto';
import { JornadaLaboralService } from '../services/jornada-laboral.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Jornada Laboral (días y horas laborales)')
@Controller('jornadaLaboral')
export class JornadaLaboralController {
  constructor(private servicioJornadaLaboral: JornadaLaboralService) {}

  @Post('/crearJornadaLaboral')
  @ApiOperation({
    summary:
      'Método para crear una jornada laboral indicando la hora de inicio, almuerzo y fin, y los días de la jornada laboral.',
    description: '',
  })
  async crearJornadaLaboral(@Body() jornada: JornadaLaboralDto) {
    return await this.servicioJornadaLaboral.crearJornadaLaboral(jornada);
  }

  @Get('/obtenerIntervalos/:idJornada')
  async obtenerIntervalos(@Param('idJornada') idJornada: string) {
    return await this.servicioJornadaLaboral.obtenerIntervalos(idJornada);
  }

  @Get('/obtenerJornadasLaborales')
  obtenerJornadasLaborales() {
    return this.servicioJornadaLaboral.obtenerJornadasLaborales();
  }

  @Get('/obtenerJornadaLaboralPorSemestre/:idSemestre')
  obtenerJornadaLaboralPorSemestre(@Param('idSemestre') idSemestre: string) {
    return this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(
      idSemestre,
    );
  }

  @Delete('/jornadaLaboral/:idSemestre')
  eliminarJornadaLaboralPorSemestre(@Param('idSemestre') idSemestre: string) {
    return this.servicioJornadaLaboral.eliminarJornadaLaboralPorSemestre(
      idSemestre,
    );
  }
}
