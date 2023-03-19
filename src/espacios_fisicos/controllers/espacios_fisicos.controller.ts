import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EspaciosFisicosService } from '../services/espacios_fisicos.service';
import { EspacioFisicoDTO } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../config/swagger-config';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { isUUID } from 'class-validator';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.espaciosFisicos.tag)
@Controller(configuraciones.controladores.espaciosFisicos.ruta)
@Roles(RolesEnum.GESTOR_ESPACIOS_FISICOS)
export class EspaciosFisicosController {
  constructor(private espaciosFisicosService: EspaciosFisicosService) {}

  /* Read */
  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .obtenerEspaciosFisicos.descripcion,
  })
  @Get(
    configuraciones.controladores.espaciosFisicos.operaciones
      .obtenerEspaciosFisicos.ruta,
  )
  obtenerEspaciosFisicos() {
    return this.espaciosFisicosService.obtenerEspaciosFisicos();
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .obtenerEspacioFisicoPorId.descripcion,
  })
  @Get(
    configuraciones.controladores.espaciosFisicos.operaciones
      .obtenerEspacioFisicoPorId.ruta,
  )
  obtenerEspacioFisicoPorId(@Param('id') id: string) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    return this.espaciosFisicosService.obtenerEspacioFisicoPorId(id);
  }

  /* Create */
  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .crearEspacioFisico.descripcion,
  })
  @Post(
    configuraciones.controladores.espaciosFisicos.operaciones.crearEspacioFisico
      .ruta,
  )
  crearEspacioFisico(@Body() espacioFisico: EspacioFisicoDTO) {
    return this.espaciosFisicosService.crearEspacioFisico(espacioFisico);
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .crearMultiplesEspaciosFisicos.descripcion,
  })
  @Post(
    configuraciones.controladores.espaciosFisicos.operaciones
      .crearMultiplesEspaciosFisicos.ruta,
  )
  @UseInterceptors(FileInterceptor('archivoEspaciosFisicos'))
  async crearMultiplesEspaciosFisicos(
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    const espaciosFisicos =
      await this.espaciosFisicosService.leerArchivoEspaciosFisicos(archivo);

    if (espaciosFisicos.length == 0) {
      throw new HttpException(
        'El archivo no contiene registros válidos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.espaciosFisicosService.crearMultiplesEspaciosFisicos(
      espaciosFisicos,
    );
  }

  /* Update */
  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .actualizarEspacioFisicoPorId.descripcion,
  })
  @Put(
    configuraciones.controladores.espaciosFisicos.operaciones
      .actualizarEspacioFisicoPorId.ruta,
  )
  actualizarEspacioFisicoPorId(
    @Param('id') id: string,
    @Body() espacioFisico: EspacioFisicoDTO,
  ) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    return this.espaciosFisicosService.actualizarEspacioFisicoPorId(
      id,
      espacioFisico,
    );
  }

  /* Delete */
  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .eliminarEspacioFisicoPorId.descripcion,
  })
  @Delete(
    configuraciones.controladores.espaciosFisicos.operaciones
      .eliminarEspacioFisicoPorId.ruta,
  )
  eliminarEspacioFisicoPorId(@Param('id') id: string) {
    if (id && !isUUID(id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    return this.espaciosFisicosService.eliminarEspacioFisicoPorId(id);
  }
}
