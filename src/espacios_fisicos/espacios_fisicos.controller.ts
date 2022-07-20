import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EspaciosFisicosService } from './espacios_fisicos.service';
import { EspacioFisicoDTO } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('espacios_fisicos')
export class EspaciosFisicosController {
  constructor(private espaciosFisicosService: EspaciosFisicosService) {}


  /* Read */
  @Get()
  obtenerEspaciosFisicos() {
    return this.espaciosFisicosService.obtenerEspaciosFisicos();
  }

  @Get(':id')
  obtenerEspacioFisicoPorId(@Param('id') id: string) {
    return this.espaciosFisicosService.obteneEspacioFisicoPorId(id);
  }


  /* Create */
  @Post('crearUno')
  crearEspacioFisico(@Body() espacio_fisico: EspacioFisicoDTO) {
    return this.espaciosFisicosService.crearEspacioFisico(espacio_fisico);
  }

  @Post('crearMultiples')
  @UseInterceptors(FileInterceptor('archivoEspaciosFisicos'))
  crearMultiplesEspaciosFisicos(
    @UploadedFile() archivo: Express.Multer.File
  ) {
    const espacios_fisicos = this.espaciosFisicosService.leerArchivoEspaciosFisicos(archivo);

    return this.espaciosFisicosService.crearMultiplesEspaciosFisicos(espacios_fisicos);
  }


  /* Update */
  @Put(':id')
  actualizarEspacioFisicoPorId(@Param('id') id: string, @Body() espacio_fisico: EspacioFisicoDTO) {
    return this.espaciosFisicosService.actualizarEspacioFisicoPorId(id, espacio_fisico);
  }


  /* Delete */
  @Delete(':id')
  eliminarEspacioFisicoPorId(@Param('id') id: string) {
    return this.espaciosFisicosService.eliminarEspacioFisicoPorId(id);
  }


}