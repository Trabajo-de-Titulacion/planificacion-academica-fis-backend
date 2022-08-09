import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EspacioFisicoDTO } from '../dto';
import { EspacioFisico } from '../entities/espacio_fisico.entity';
import * as fs from 'fs';

@Injectable()
export class EspaciosFisicosService {

  constructor(
    @InjectRepository(EspacioFisico)
    private espaciosFisicosRepository: Repository<EspacioFisico>
  ) {}


  /* Create */
  async crearEspacioFisico(espacio_fisico: EspacioFisicoDTO) {

    let filas_alteradas: number;
    let mensaje: string;

    // Buscar registros ya existentes
    const coincidencias = await this.espaciosFisicosRepository.find({
      where: { nombre: espacio_fisico.nombre }
    });

    // Si ya existen registros con el mismo nombre
    if (coincidencias.length > 0) {
      filas_alteradas = 0;
      mensaje = `El espacio físico ${espacio_fisico.nombre} ya está registrado.`
    }
    // No existen registros con el mismo nombre
    else {
      // Crear registro
      const registro_creado: EspacioFisicoDTO = await this.espaciosFisicosRepository.save(espacio_fisico);
      filas_alteradas = 1;
      mensaje = `Se creó el espacio físico ${espacio_fisico.nombre} de manera exitosa!`;
    }
    
    const respuesta = {
      filas_alteradas: filas_alteradas,
      mensaje: mensaje,
    }
    
    return respuesta;
  }

  async crearMultiplesEspaciosFisicos(espacios_fisicos: EspacioFisicoDTO[]) {

    // Buscar registros ya existentes
    const nombres = espacios_fisicos.map(espacio => {return {nombre: espacio.nombre}});

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: nombres
    });

    const nombres_coincidentes = coincidencias.map(espacio => espacio.nombre);

    // Arreglos para almacenar registros nuevos y repetidos
    const registros_nuevos: EspacioFisicoDTO[] = [];
    const registros_repetidos: EspacioFisicoDTO[] = [];

    espacios_fisicos.forEach( espacio_fisico => {
      // Si ya existe un registro con el mismo nombre
      if (nombres_coincidentes.includes(espacio_fisico.nombre)) {
        registros_repetidos.push(espacio_fisico);
      }
      // Si no existe un espacio físico con el mismo nombre
      else {
        registros_nuevos.push(espacio_fisico);
      }
    });

    // Crear registros
    let registros_creados: EspacioFisicoDTO[] = [];
    if (registros_nuevos.length > 0)
      registros_creados = await this.espaciosFisicosRepository.save(registros_nuevos);
    
    const mensaje_repetidos = (registros_repetidos.length > 0)?
      ': ' + registros_repetidos.map(registro => registro.nombre).join(', ') : '';

    const respuesta = {
      filas_alteradas: registros_creados.length,
      mensaje: `Se han creado ${registros_creados.length} registros. Hay ${registros_repetidos.length} repetidos` + mensaje_repetidos + '.',
      registros_creados: registros_creados,
    }

    return respuesta;
  }


  /* Read */
  async obtenerEspaciosFisicos(): Promise<EspacioFisico[]> {
    return await this.espaciosFisicosRepository.find();
  }

  async obteneEspacioFisicoPorId(id: string): Promise<EspacioFisico> {
    return await this.espaciosFisicosRepository.findOne({
      where: {id: id},
    });
  }


  /* Update */
  async actualizarEspacioFisicoPorId(id: string, espacio_fisico: EspacioFisicoDTO) {
    return await this.espaciosFisicosRepository.update(id, espacio_fisico);
  }


  /* Delete */
  async eliminarEspacioFisicoPorId(id: string) {
    return await this.espaciosFisicosRepository.delete(id);
  }


  /* Leer informacion de un archivo y devolver un arreglo de Espacios Fisicos */
  leerArchivoEspaciosFisicos(archivo: Express.Multer.File): EspacioFisicoDTO[] {
    const datos = archivo.buffer.toString('utf-8');

    const expresionRegular = /[A-Za-z0-9]*;[A-Za-z0-9]*;[A-Za-z0-9]*/g;
    const filas = datos.match(expresionRegular);

    const espacios_fisicos: EspacioFisicoDTO[] = [];

    if (filas) {
      filas.forEach( fila => {
        if (fila.search(/nombre|tipo|aforo/gi) == -1) {
          const info = fila.split(';');
          const nombre = info[0];
          const tipo = info[1];
          const aforo = Number(info[2]);
  
          const espacio_fisico = new EspacioFisicoDTO(nombre, tipo, aforo);
          espacios_fisicos.push(espacio_fisico);
        }
      });
    }

    return espacios_fisicos;
  }

}