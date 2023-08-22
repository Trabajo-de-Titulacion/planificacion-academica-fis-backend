import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HorasNoDisponiblesService } from '../services/horas_no_disponibles.service';
import { HorasNoDisponiblesDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';
import { isUUID } from 'class-validator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { VerificarIdDocentePorParametroGuard } from '../guards/verificar_id_docente_por_parametro.guard';
import { HoraDiaNoDisponibleDTO } from '../dto/hora_dia_noDisponible.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags(configuraciones.controladores.horasNoDisponibles.tag)
@Controller(configuraciones.controladores.horasNoDisponibles.ruta)
export class HorasNoDisponiblesController {
  constructor(private horasNoDisponiblesService: HorasNoDisponiblesService) {}

  @ApiOperation({
    summary:
      configuraciones.controladores.horasNoDisponibles.operaciones
        .solicitarHorasNoDisponibles.descripcion,
  })
  @Post(
    configuraciones.controladores.horasNoDisponibles.operaciones
      .solicitarHorasNoDisponibles.ruta,
  )
  @Roles(RolesEnum.DOCENTE)
  @UseGuards(VerificarIdDocentePorParametroGuard)
  async solicitarHorasNoDisponibles(
    @Param('id') idDocente: string,
    @Body() horas_no_disponibles: HorasNoDisponiblesDTO[],
  ) {
    if (idDocente && !isUUID(idDocente)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horasNoDisponiblesService.solicitarHorasNoDisponibles(
      idDocente,
      horas_no_disponibles,
    );
  }

  //Para horarios no disponibles
  @Public()
  @Post("hora_dia_noDisponible")
  async crearHoraDiaNoDisponible(@Body() data: HoraDiaNoDisponibleDTO){
    return await this.horasNoDisponiblesService.crearHoraDiaNoDisponible(data) 
    
  }

  @Public()
  @Get("horas_dias_noDisponibles/:idDocente")
  async obtenerHorasNoDisponiblesPorIdDocente(@Param("idDocente") idDocente: string){
      return await this.horasNoDisponiblesService.obtenerHorasDiasNoDisponiblesDelDocente(idDocente)
  }


  @ApiOperation({
    summary:
      configuraciones.controladores.horasNoDisponibles.operaciones
        .obtenerHorasNoDisponiblesSolicitadasPorDocenteId.descripcion,
  })
  @Get(
    configuraciones.controladores.horasNoDisponibles.operaciones
      .obtenerHorasNoDisponiblesSolicitadasPorDocenteId.ruta,
  )
  @Public()
  async obtenerHorasNoDisponiblesSolicitadasPorDocenteId(
    @Param('id') id: string,
  ) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horasNoDisponiblesService.obtenerHorasNoDisponiblesSolicitadasPorDocenteId(
      id,
    );
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.horasNoDisponibles.operaciones
        .aprobarSolicitudHorasNoDisponiblesPorDocenteId.descripcion,
  })
  @Get(
    configuraciones.controladores.horasNoDisponibles.operaciones
      .aprobarSolicitudHorasNoDisponiblesPorDocenteId.ruta,
  )
  @Public()
  async aprobarSolicitudHorasNoDisponiblesPorDocenteId(
    @Param('id') id: string,
  ) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.horasNoDisponiblesService.aprobarSolicitudHorasNoDisponiblesPorDocenteId(
      id,
    );
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.horasNoDisponibles.operaciones
        .rechazarSolicitudHorasNoDisponiblesPorDocenteId.descripcion,
  })
  @Get(
    configuraciones.controladores.horasNoDisponibles.operaciones
      .rechazarSolicitudHorasNoDisponiblesPorDocenteId.ruta,
  )
  @Roles(RolesEnum.JEFE_DE_DEPARTAMENTO)
  async rechazarSolicitudHorasNoDisponiblesPorDocenteId(
    @Param('id') id: string,
  ) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    return this.horasNoDisponiblesService.rechazarSolicitudHorasNoDisponiblesPorDocenteId(
      id,
    );
  }

}
