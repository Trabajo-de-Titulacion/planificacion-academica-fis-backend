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
  ) {}

  /* Create */
  async crearEspacioFisico(espacioFisico: EspacioFisicoDTO) {
    let filasAlteradas: number;
    let mensaje: string;

    // Buscar registros ya existentes
    const coincidencias = await this.espaciosFisicosRepository.find({
      where: { nombre: espacioFisico.nombre },
    });

    // Si ya existen registros con el mismo nombre
    if (coincidencias.length > 0) {
      filasAlteradas = 0;
      mensaje = `El espacio físico ${espacioFisico.nombre} ya está registrado.`;
    }
    // No existen registros con el mismo nombre
    else {
      const tipoAula = await this.tipoAulaService.obtenerTipoAulaPorId(
        espacioFisico.tipo_id,
      );

      const entidadARegistrar = this.espaciosFisicosRepository.create();
      entidadARegistrar.nombre = espacioFisico.nombre;
      entidadARegistrar.tipo = tipoAula;
      entidadARegistrar.aforo = espacioFisico.aforo;

      // Crear registro
      await this.espaciosFisicosRepository.save(entidadARegistrar);
      filasAlteradas = 1;
      mensaje = `Se creó el espacio físico ${espacioFisico.nombre} de manera exitosa!`;
    }

    const respuesta = {
      filasAlteradas: filasAlteradas,
      mensaje: mensaje,
    };

    return respuesta;
  }

  async crearMultiplesEspaciosFisicos(espaciosFisicos: EspacioFisicoEntity[]) {
    // Buscar registros ya existentes
    const nombres = espaciosFisicos.map((espacio) => {
      return { nombre: espacio.nombre };
    });

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: nombres,
    });

    const nombresCoincidentes = coincidencias.map((espacio) => espacio.nombre);

    // Arreglos para almacenar registros nuevos y repetidos
    const registrosNuevos: EspacioFisicoEntity[] = [];
    const registrosRepetidos: EspacioFisicoEntity[] = [];

    espaciosFisicos.forEach((espacioFisico) => {
      // Si ya existe un registro con el mismo nombre
      if (nombresCoincidentes.includes(espacioFisico.nombre)) {
        registrosRepetidos.push(espacioFisico);
      }
      // Si no existe un espacio físico con el mismo nombre
      else {
        registrosNuevos.push(espacioFisico);
      }
    });

    // Crear registros
    let registrosCreados: EspacioFisicoEntity[] = [];
    if (registrosNuevos.length > 0) {
      registrosCreados = await this.espaciosFisicosRepository.save(
        registrosNuevos,
      );
    }

    const mensajeRepetidos =
      registrosRepetidos.length > 0
        ? ': ' +
          registrosRepetidos.map((registro) => registro.nombre).join(', ')
        : '';

    const respuesta = {
      filasAlteradas: registrosCreados.length,
      mensaje:
        `Se han creado ${registrosCreados.length} registros. Hay ${registrosRepetidos.length} repetidos` +
        mensajeRepetidos +
        '.',
      registrosCreados: registrosCreados,
      registrosRepetidos: registrosRepetidos,
    };

    return respuesta;
  }

  /* Read */
  async obtenerEspaciosFisicos(): Promise<EspacioFisicoEntity[]> {
    return await this.espaciosFisicosRepository.find({
      relations: ['tipo', 'tipo.facultad'],
    });
  }

  async obtenerEspacioFisicoPorId(id: string): Promise<EspacioFisicoEntity> {
    return await this.espaciosFisicosRepository.findOne({
      where: { id: id },
      relations: ['tipo'],
    });
  }

  /* Update */
  async actualizarEspacioFisicoPorId(
    id: string,
    espacioFisico: EspacioFisicoDTO,
  ) {
    let filasAlteradas: number;
    let mensaje: string;

    const coincidencias = await this.espaciosFisicosRepository.find({
      where: { nombre: espacioFisico.nombre },
    });

    // Si ya existen registros con el mismo nombre
    if (coincidencias.length > 1) {
      filasAlteradas = 0;
      mensaje = `El espacio físico con el nombre ${espacioFisico.nombre} ya existe. Ingrese un nuevo nombre.`;
    }
    // No existen registros con el mismo nombre
    else {
      const tipoAula = await this.tipoAulaService.obtenerTipoAulaPorId(
        espacioFisico.tipo_id,
      );
      const registroActualizado: EspacioFisicoEntity = {
        id: id,
        nombre: espacioFisico.nombre,
        tipo: tipoAula,
        aforo: espacioFisico.aforo,
      };
      await this.espaciosFisicosRepository.update(id, registroActualizado);
      filasAlteradas = 1;
      mensaje = 'Actualizado exitosamente';
    }
    return {
      filasAlteradas: filasAlteradas,
      mensaje: mensaje,
    };
  }

  /* Delete */
  async eliminarEspacioFisicoPorId(id: string) {
    return await this.espaciosFisicosRepository.delete(id);
  }

  /* Leer informacion de un archivo y devolver un arreglo de Espacios Fisicos */
  async leerArchivoEspaciosFisicos(
    archivo: Express.Multer.File,
  ): Promise<EspacioFisicoEntity[]> {
    const datos = archivo.buffer.toString('utf-8');

    const expresionRegular =
      /[A-Za-z0-9 ]*;[A-Za-z0-9 ]*;[A-Za-z0-9 ]*;[0-9]+/g;
    const filas = datos.match(expresionRegular);

    const espaciosFisicos: EspacioFisicoEntity[] = [];

    if (filas) {
      for (const fila of filas) {
        // Se obtienen los datos de la fila del archivo
        const info = fila.split(';');
        const nombre = info[0];
        const tipo = info[1];
        const facultad = info[2];
        const aforo = Number(info[3]);

        // Busca si la facultad existe
        const entidadFacultad =
          await this.facultadService.obtenerFacultadPorSuNombre(facultad);
        // Si una facultad del archivo no existe
        if (!entidadFacultad) {
          throw new HttpException(
            'Se encontraron errores en la columna "Facultad". Verifique que las facultades indicadas en el archivo existan en el sistema.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Comprueba que el aforo se encuentre bajo los límites establecidos
        if (aforo < 3 || aforo > 200 || !Number.isInteger(aforo)) {
          throw new HttpException(
            'Se encontraron errores en la columna "Aforo". Verifique que el aforo sea un entero entre 3 y 200.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Busca si el tipo existe en la facultad indicada
        const entidadTipo =
          await this.tipoAulaService.obtenerTipoAulaPorNombreYFacultad(
            tipo,
            facultad,
          );
        // El tipo existe en la facultad indicada
        if (entidadTipo) {
          const espacioFisico = this.espaciosFisicosRepository.create();
          espacioFisico.nombre = nombre;
          espacioFisico.tipo = entidadTipo;
          espacioFisico.aforo = aforo;

          espaciosFisicos.push(espacioFisico);
        } else {
          throw new HttpException(
            'Se encontraron errores en la columna "Tipo". Verifique que los tipos indicados en el archivo correspondan a una facultad existente.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    return espaciosFisicos;
  }
}
