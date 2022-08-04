import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EspaciosFisicosService } from './espacios_fisicos.service';
import { EspacioFisicoDTO } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../src/config/swagger-config';

@ApiTags(configuraciones.controladores.espacios_fisicos.tag)
@Controller(configuraciones.controladores.espacios_fisicos.ruta)
export class EspaciosFisicosController {
  constructor(private espaciosFisicosService: EspaciosFisicosService) {}


  /* Read */
  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.obtenerEspaciosFisicos.descripcion})
  @Get(configuraciones.controladores.espacios_fisicos.operaciones.obtenerEspaciosFisicos.ruta)
  obtenerEspaciosFisicos() {
    return this.espaciosFisicosService.obtenerEspaciosFisicos();
  }

  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.obtenerEspacioFisicoPorId.descripcion})
  @Get(configuraciones.controladores.espacios_fisicos.operaciones.obtenerEspacioFisicoPorId.ruta)
  obtenerEspacioFisicoPorId(@Param('id') id: string) {
    return this.espaciosFisicosService.obteneEspacioFisicoPorId(id);
  }


  /* Create */
  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.crearEspacioFisico.descripcion})
  @Post(configuraciones.controladores.espacios_fisicos.operaciones.crearEspacioFisico.ruta)
  crearEspacioFisico(@Body() espacio_fisico: EspacioFisicoDTO) {
    return this.espaciosFisicosService.crearEspacioFisico(espacio_fisico);
  }

  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.crearMultiplesEspaciosFisicos.descripcion})
  @Post(configuraciones.controladores.espacios_fisicos.operaciones.crearMultiplesEspaciosFisicos.ruta)
  @UseInterceptors(FileInterceptor('archivoEspaciosFisicos'))
  crearMultiplesEspaciosFisicos(
    @UploadedFile() archivo: Express.Multer.File
  ) {
    const espacios_fisicos = this.espaciosFisicosService.leerArchivoEspaciosFisicos(archivo);

    return this.espaciosFisicosService.crearMultiplesEspaciosFisicos(espacios_fisicos);
  }


  /* Update */
  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.actualizarEspacioFisicoPorId.descripcion})
  @Put(configuraciones.controladores.espacios_fisicos.operaciones.actualizarEspacioFisicoPorId.ruta)
  actualizarEspacioFisicoPorId(@Param('id') id: string, @Body() espacio_fisico: EspacioFisicoDTO) {
    return this.espaciosFisicosService.actualizarEspacioFisicoPorId(id, espacio_fisico);
  }


  /* Delete */
  @ApiOperation({summary: configuraciones.controladores.espacios_fisicos.operaciones.eliminarEspacioFisicoPorId.descripcion})
  @Delete(configuraciones.controladores.espacios_fisicos.operaciones.eliminarEspacioFisicoPorId.ruta)
  eliminarEspacioFisicoPorId(@Param('id') id: string) {
    return this.espaciosFisicosService.eliminarEspacioFisicoPorId(id);
  }


}