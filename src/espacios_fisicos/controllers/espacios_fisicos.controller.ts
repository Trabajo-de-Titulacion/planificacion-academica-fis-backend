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
import { configuraciones } from '../../config/swagger-config';
import { isUUID } from 'class-validator';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(configuraciones.controladores.espaciosFisicos.tag)
@Controller(configuraciones.controladores.espaciosFisicos.ruta)
//@Roles(RolesEnum.GESTOR_ESPACIOS_FISICOS)
export class EspaciosFisicosController {
  constructor(private espaciosFisicosService: EspaciosFisicosService) {}

  /* Read */
  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.espaciosFisicos.operaciones
        .obtenerEspaciosFisicos.descripcion,
  })
  @Get(
    configuraciones.controladores.espaciosFisicos.operaciones
      .obtenerEspaciosFisicos.ruta,
  )
  async obtenerEspaciosFisicos() {
    return await this.espaciosFisicosService.obtenerEspaciosFisicos();
  }

  //Controlador para obtener espacio fìsico por tipo de aula
  @Public()
  @ApiOperation({})
  @Get('obtenerEspaciosFisicoPorTipoDeAula/:idTipoAula')
  async obtenerEspaciosFisicoPorTipoDeAula(@Param('idTipoAula') id: string) {
    return await this.espaciosFisicosService.obtenerEspaciosFisicosPorTipoDeAula(
      id,
    );
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
