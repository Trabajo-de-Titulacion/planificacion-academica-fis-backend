import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';
import { isUUID } from 'class-validator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { NumeroEstudiantesPorSemestreDTO } from '../dto/numeroEstudiantesPorSemestre.dto';
import { NumeroEstudiantesPorSemestreService } from '../services/numeroEstudiantesPorSemestre.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.numeroEstudiantesPorSemestre.tag)
@Controller(configuraciones.controladores.numeroEstudiantesPorSemestre.ruta)
export class NumeroEstudiantesPorSemestreController {
  constructor(
    private numeroEstudiantesPorSemestreService: NumeroEstudiantesPorSemestreService,
  ) {}

  @ApiOperation({
    summary:
      configuraciones.controladores.numeroEstudiantesPorSemestre.operaciones
        .registrarNumeroEstudiantesPorSemestre.descripcion,
  })
  @Post(
    configuraciones.controladores.numeroEstudiantesPorSemestre.operaciones
      .registrarNumeroEstudiantesPorSemestre.ruta,
  )
  @Roles(RolesEnum.COORDINADOR)
  async registrarNumeroEstudiantesPorSemestre(
    @Body()
    arregloNumeroEstudiantesPorSemestre: NumeroEstudiantesPorSemestreDTO[],
  ) {
    return await this.numeroEstudiantesPorSemestreService.registrarNumeroEstudiantesPorSemestre(
      arregloNumeroEstudiantesPorSemestre,
    );
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.numeroEstudiantesPorSemestre.operaciones
        .obtenerNumeroEstudiantesPorSemestreId.descripcion,
  })
  @Get(
    configuraciones.controladores.numeroEstudiantesPorSemestre.operaciones
      .obtenerNumeroEstudiantesPorSemestreId.ruta,
  )
  @Roles(RolesEnum.COORDINADOR)
  async obtenerNumeroEstudiantesPorSemestreId(@Param('id') idSemestre: string) {
    if (idSemestre && !isUUID(idSemestre)) {
      throw new HttpException(
        'ID de semestre inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.numeroEstudiantesPorSemestreService.obtenerNumeroEstudiantesPorSemestreId(
      idSemestre,
    );
  }
}
