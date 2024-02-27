import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TipoAulaDto } from '../dtos/tipo-aula.dto';
import { TipoAulaService } from '../services/tipo-aula.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Tipos de aulas de una facultad')
@Controller('/tipoAula')
export class TipoAulaController {
  constructor(private servicioTipoAula: TipoAulaService) {}

  @Post('/crearTipoAula')
  async crearTipoAula(@Body() tipoAula: TipoAulaDto) {
    return this.servicioTipoAula.crearTipoAula(tipoAula);
  }

  @Get('/obtenerTipoAulas')
  async obtenerTipoAulas() {
    return this.servicioTipoAula.obtenerTipoAulas();
  }

  @Delete('/eliminarTipoAula/:id')
  async eliminarTipoAula(@Param('id') id: string) {
    return this.servicioTipoAula.eliminarTipoAula(id);
  }

  @Put('/actualizarTipoAula/:id')
  async actualizarTipoAula(
    @Param('id') id: string,
    @Body() tipoAula: TipoAulaDto,
  ) {
    return this.servicioTipoAula.actualizarTipoAula(tipoAula, id);
  }
}
