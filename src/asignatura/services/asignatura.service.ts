import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AsignaturaDto } from '../dto/asignatura.dto';
import { AsignaturaEntity } from '../entities/asignatura.entity';

@Injectable()
export class AsignaturaService {
  constructor(
    @InjectRepository(AsignaturaEntity)
    private asignaturaRepository: Repository<AsignaturaEntity>,
  ) {}

  /* ====================================================================================================================== */
  /* ====================================== CREAR UNA ASIGNATURA EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  async crearUnaAsignatura(asignaturaDto: AsignaturaDto) {
    const existenciaAsignatura = await this.obtenerAsignaturaPorCodigo(
      asignaturaDto.codigo,
    );
    if (existenciaAsignatura instanceof NotFoundException) {
      const asignaturaNueva = {
        codigo: asignaturaDto.codigo,
        nombre: asignaturaDto.nombre,
        creditos: Number(asignaturaDto.creditos),
      };
      await this.asignaturaRepository.save(asignaturaNueva);
      return {
        mensaje:
          'Se creó la asignatura ' +
          asignaturaDto.codigo +
          ' - ' +
          asignaturaDto.nombre +
          ' existosamente.',
      };
    } else {
      return {
        mensaje:
          'La asignatura ' +
          asignaturaDto.codigo +
          ' - ' +
          asignaturaDto.nombre +
          ' ya se encuentra registrada.',
      };
    }
  }

  /* ====================================================================================================================== */
  /* ====================================== VARIAS ASIGNATURAS EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  async crearVariasAsignaturas(arregloAsignaturas: AsignaturaDto[]) {
    const asignaturasNoGuardadas: AsignaturaDto[] = [];
    let cantidadAsignaturaNoGuardada = 0;
    const asignaturasGuardadas: AsignaturaDto[] = [];
    let cantidadAsignaturaGuardada = 0;

    for (let i = 0; i < arregloAsignaturas.length; i++) {
      // Busqueda de las asignaturas
      const existenciaAsignaturaArchivo = await this.obtenerAsignaturaPorCodigo(
        arregloAsignaturas[i].codigo,
      );
      if (existenciaAsignaturaArchivo instanceof NotFoundException) {
        const asignaturaNueva = {
          codigo: arregloAsignaturas[i].codigo,
          nombre: arregloAsignaturas[i].nombre,
          creditos: Number(arregloAsignaturas[i].creditos),
        };
        await this.asignaturaRepository.save(asignaturaNueva);
        // Arreglo de asignaturas guardadas
        asignaturasGuardadas[cantidadAsignaturaGuardada] =
          arregloAsignaturas[i];
        cantidadAsignaturaGuardada++;
      } else {
        // Arreglo de asignaturas no guardadas
        asignaturasNoGuardadas[cantidadAsignaturaNoGuardada] =
          arregloAsignaturas[i];
        cantidadAsignaturaNoGuardada++;
      }
    }
    // Envió de resultados
    if (cantidadAsignaturaNoGuardada == 0) {
      return {
        mensaje:
          'Se han creado exitosamente ' +
          cantidadAsignaturaGuardada +
          ' asignaturas.',
        asignaturasIngresadas: asignaturasGuardadas,
      };
    } else {
      // Crear un arreglo con los nombres de las asignaturas duplicadas
      const nombreAsignaturasDuplicados = asignaturasNoGuardadas.map(
        (asignatura) => {
          return asignatura.codigo + ' - ' + asignatura.nombre;
        },
      );

      const nombresImprimibles = nombreAsignaturasDuplicados.join(', ');

      return {
        mensaje:
          'Se han creado exitosamente ' +
          cantidadAsignaturaGuardada +
          ' asignaturas.  No se pudo crear la/s asignatura/s: ' +
          nombresImprimibles +
          ', ya que, existen dentro del sistema.',
        asignaturasIngresadas: asignaturasGuardadas,
        asignaturasNoIngresadas: asignaturasNoGuardadas,
      };
    }
  }

  /* ====================================================================================================================== */
  /* =================================== ACTUALIZAR UNA ASIGNATURA EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  async actualizarAsignaturaPorID(
    idAsignatura: string,
    asignaturaDto: AsignaturaDto,
  ): Promise<UpdateResult | NotFoundException> {
    const asignatura = await this.obtenerAsignaturaPorID(idAsignatura);
    if (asignatura) {
      return await this.asignaturaRepository.update(
        idAsignatura,
        asignaturaDto,
      );
    } else {
      return new NotFoundException(
        `No existe la asignatura con id ${idAsignatura}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* ==================================== ELIMINAR UNA ASIGNATURA EN LA BASE DE DATOS ===================================== */
  /* ====================================================================================================================== */

  async eliminarAsignaturaPorID(
    idAsignatura: string,
  ): Promise<DeleteResult | NotFoundException> {
    const asignatura = await this.obtenerAsignaturaPorID(idAsignatura);
    if (asignatura instanceof NotFoundException) {
      return new NotFoundException(
        `No existe la asignatura con id ${idAsignatura}`,
      );
    } else {
      return await this.asignaturaRepository.delete(idAsignatura);
    }
  }

  /* ====================================================================================================================== */
  /* ============================= OBTENER UNA ASIGNATURA POR SU CÓDIGO EN LA BASE DE DATOS =============================== */
  /* ====================================================================================================================== */

  async obtenerAsignaturaPorCodigo(
    codigoAsignatura: string,
  ): Promise<AsignaturaEntity | NotFoundException> {
    const asignatura = await this.asignaturaRepository.findOne({
      where: { codigo: codigoAsignatura },
    });
    if (asignatura) {
      return asignatura;
    } else {
      return new NotFoundException(
        `No existe la asignatura con el código ${codigoAsignatura}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* =============================== OBTENER UNA ASIGNATURA POR SU ID EN LA BASE DE DATOS ================================= */
  /* ====================================================================================================================== */

  async obtenerAsignaturaPorID(
    idAsignatura: string,
  ): Promise<AsignaturaEntity | NotFoundException> {
    const asignatura = await this.asignaturaRepository.findOne({
      where: { id: idAsignatura },
    });
    if (asignatura) {
      return asignatura;
    } else {
      return new NotFoundException(
        `No existe la asignatura con el código ${idAsignatura}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* ================================= OBTENER TODAS LAS ASIGNATURAS EN LA BASE DE DATOS ================================== */
  /* ====================================================================================================================== */

  async obtenerAsignatura(): Promise<AsignaturaEntity[]> {
    return this.asignaturaRepository.find();
  }
}
