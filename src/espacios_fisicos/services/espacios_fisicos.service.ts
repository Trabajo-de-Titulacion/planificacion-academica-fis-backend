import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EspacioFisicoDTO } from '../dto';
import { EspacioFisicoEntity } from '../entities/espacio_fisico.entity';
import { TipoAulaService } from '../../../src/parametros-iniciales/services/tipo-aula.service';

@Injectable()
export class EspaciosFisicosService {

  constructor(
    @InjectRepository(EspacioFisicoEntity)
    private espaciosFisicosRepository: Repository<EspacioFisicoEntity>,
    private readonly tipoAulaService: TipoAulaService,
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
      const tipoAula = await this.tipoAulaService.obtenerTipoAulaPorId(espacio_fisico.tipo_id);

      const entidad_a_registrar = this.espaciosFisicosRepository.create();
      entidad_a_registrar.nombre = espacio_fisico.nombre;
      entidad_a_registrar.tipo = tipoAula;
      entidad_a_registrar.aforo = espacio_fisico.aforo;

      // Crear registro
      const registro_creado = await this.espaciosFisicosRepository.save(entidad_a_registrar);
      filas_alteradas = 1;
      mensaje = `Se creó el espacio físico ${espacio_fisico.nombre} de manera exitosa!`;
    }
    
    const respuesta = {
      filas_alteradas: filas_alteradas,
      mensaje: mensaje,
    }
    
    return respuesta;
  }

  async crearMultiplesEspaciosFisicos(espacios_fisicos: EspacioFisicoEntity[]) {

    // Buscar registros ya existentes
    const nombres = espacios_fisicos.map(espacio => {return {nombre: espacio.nombre}});

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: nombres
    });

    const nombres_coincidentes = coincidencias.map(espacio => espacio.nombre);

    // Arreglos para almacenar registros nuevos y repetidos
    const registros_nuevos: EspacioFisicoEntity[] = [];
    const registros_repetidos: EspacioFisicoEntity[] = [];

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
    let registros_creados: EspacioFisicoEntity[] = [];
    if (registros_nuevos.length > 0) {
      registros_creados = await this.espaciosFisicosRepository.save(registros_nuevos);
    }
    
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
  async obtenerEspaciosFisicos(): Promise<EspacioFisicoEntity[]> {
    return await this.espaciosFisicosRepository.find();
  }

  async obteneEspacioFisicoPorId(id: string): Promise<EspacioFisicoEntity> {
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
  async leerArchivoEspaciosFisicos(archivo: Express.Multer.File): Promise<EspacioFisicoEntity[]> {
    const datos = archivo.buffer.toString('utf-8');

    const expresionRegular = /[A-Za-z0-9 ]*;[A-Za-z0-9 ]*;[A-Za-z0-9 ]*;[0-9]+/g;
    const filas = datos.match(expresionRegular);

    const espacios_fisicos: EspacioFisicoEntity[] = [];

    if (filas) {
      for (const fila of filas) {
        const info = fila.split(';');
        const nombre = info[0];
        const tipo = info[1];
        const facultad = info[2];
        const aforo = Number(info[3]);

        const entidad_tipo = await this.tipoAulaService.obtenerTipoAulaPorNombreYFacultad(tipo, facultad);

        if (entidad_tipo) {
          const espacio_fisico = this.espaciosFisicosRepository.create();
          espacio_fisico.nombre = nombre;
          espacio_fisico.tipo = entidad_tipo;
          espacio_fisico.aforo = aforo;
          
          espacios_fisicos.push(espacio_fisico);
        }
      };
    }

    return espacios_fisicos;
  }

}