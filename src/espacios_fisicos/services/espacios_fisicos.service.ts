import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EspacioFisicoDTO } from '../dto';
import { EspacioFisicoEntity } from '../entities/espacio_fisico.entity';
import { TipoAulaService } from '../../../src/parametros-iniciales/services/tipo-aula.service';
import { FacultadService } from '../../../src/parametros-iniciales/services/facultad.service';

@Injectable()
export class EspaciosFisicosService {

  constructor(
    @InjectRepository(EspacioFisicoEntity)
    private espaciosFisicosRepository: Repository<EspacioFisicoEntity>,
    private readonly tipoAulaService: TipoAulaService,
    private readonly facultadService: FacultadService,
  ) { }


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
    const nombres = espacios_fisicos.map(espacio => { return { nombre: espacio.nombre } });

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: nombres
    });

    const nombres_coincidentes = coincidencias.map(espacio => espacio.nombre);

    // Arreglos para almacenar registros nuevos y repetidos
    const registros_nuevos: EspacioFisicoEntity[] = [];
    const registros_repetidos: EspacioFisicoEntity[] = [];

    espacios_fisicos.forEach(espacio_fisico => {
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

    const mensaje_repetidos = (registros_repetidos.length > 0) ?
      ': ' + registros_repetidos.map(registro => registro.nombre).join(', ') : '';

    const respuesta = {
      filas_alteradas: registros_creados.length,
      mensaje: `Se han creado ${registros_creados.length} registros. Hay ${registros_repetidos.length} repetidos` + mensaje_repetidos + '.',
      registros_creados: registros_creados,
      registros_repetidos: registros_repetidos,
    }

    return respuesta;
  }


  /* Read */
  async obtenerEspaciosFisicos(): Promise<EspacioFisicoEntity[]> {
    return await this.espaciosFisicosRepository.find({
      relations: ['tipo'],
    });
  }

  async obtenerEspacioFisicoPorId(id: string): Promise<EspacioFisicoEntity> {
    return await this.espaciosFisicosRepository.findOne({
      where: { id: id },
      relations: ['tipo'],
    });
  }


  /* Update */
  async actualizarEspacioFisicoPorId(id: string, espacio_fisico: EspacioFisicoDTO) {
    let filas_alteradas: number;
    let mensaje: string;

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: { nombre: espacio_fisico.nombre }
    });

    // Si ya existen registros con el mismo nombre
    if (coincidencias.length > 1) {
      filas_alteradas = 0;
      mensaje = `El espacio físico con el nombre ${espacio_fisico.nombre} ya existe. Ingrese un nuevo nombre.`
    }
    // No existen registros con el mismo nombre
    else {
      const tipoAula = await this.tipoAulaService.obtenerTipoAulaPorId(espacio_fisico.tipo_id);
      const registroActualizado: EspacioFisicoEntity = {
        id: id,
        nombre: espacio_fisico.nombre,
        tipo: tipoAula,
        aforo: espacio_fisico.aforo
      };
      const registro = await this.espaciosFisicosRepository.update(id, registroActualizado);
      filas_alteradas = 1;
      mensaje = 'Actualizado exitosamente';
    }
    return {
      filas_alteradas: filas_alteradas,
      mensaje: mensaje,
    }
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
        // Se obtienen los datos de la fila del archivo
        const info = fila.split(';');
        const nombre = info[0];
        const tipo = info[1];
        const facultad = info[2];
        const aforo = Number(info[3]);

        // Busca si la facultad existe
        const entidadFacultad = await this.facultadService.obtenerFacultadPorSuNombre(facultad);
        // Si una facultad del archivo no existe
        if (!entidadFacultad) {
          throw new HttpException(
            'Se encontraron errores en la columna "Facultad". Verifique que las facultades indicadas en el archivo existan en el sistema.',
            HttpStatus.BAD_REQUEST
          );
        }

        // Comprueba que el aforo se encuentre bajo los límites establecidos
        if ((aforo < 3) || (aforo > 200) || !(Number.isInteger(aforo))) {
          throw new HttpException(
            'Se encontraron errores en la columna "Aforo". Verifique que el aforo sea un entero entre 3 y 200.',
            HttpStatus.BAD_REQUEST
          );
        }

        // Busca si el tipo existe en la facultad indicada
        const entidad_tipo = await this.tipoAulaService.obtenerTipoAulaPorNombreYFacultad(tipo, facultad);
        // El tipo existe en la facultad indicada
        if (entidad_tipo) {
          const espacio_fisico = this.espaciosFisicosRepository.create();
          espacio_fisico.nombre = nombre;
          espacio_fisico.tipo = entidad_tipo;
          espacio_fisico.aforo = aforo;

          espacios_fisicos.push(espacio_fisico);
        } else {
          throw new HttpException(
            'Se encontraron errores en la columna "Tipo". Verifique que los tipos indicados en el archivo correspondan a una facultad existente.',
            HttpStatus.BAD_REQUEST
          );
        }
      }
    }

    return espacios_fisicos;
  }

}