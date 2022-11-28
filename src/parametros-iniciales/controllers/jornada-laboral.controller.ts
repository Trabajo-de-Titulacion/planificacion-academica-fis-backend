import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JornadaLaboralDto } from '../dtos/jornada-laboral.dto';
import { JornadaLaboralService } from '../services/jornada-laboral.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Jornada Laboral (días y horas laborales)')
@Controller('jornadaLaboral')
export class JornadaLaboralController {
  constructor(private servicioJornadaLaboral: JornadaLaboralService) {}

  @Post('/crearJornadaLaboral')
  crearJornadaLaboral(@Body() jornada: JornadaLaboralDto) {
    this.servicioJornadaLaboral.crearJornadaLaboral(jornada);
  }

  @Get('/obtenerIntervalos/:idJornada')
  obtenerIntervalos(@Param('idJornada') idJornada: string) {
    return this.servicioJornadaLaboral.obtenerIntervalos(idJornada);
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
