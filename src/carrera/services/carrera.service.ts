import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CarreraDto } from '../dto/carrera.dto';
import { CarreraEntity } from '../entities/carrera.entity';

@Injectable()
export class CarreraService {
  constructor(
    @InjectRepository(CarreraEntity)
    private carreraRepository: Repository<CarreraEntity>,
  ) {}

  /* =================================================================================================================== */
  /* ======================================= CREAR UNA CARRERA EN LA BASE DE DATOS ===================================== */
  /* =================================================================================================================== */

  async crearUnaCarrera(carreraDto: CarreraDto) {
    // Busqueda en la base la existencia de una carrera en base a su código
    const existenciaCarrera = await this.obtenerCarreraPorCodigo(
      carreraDto.codigo,
    );
    // Si no existe, crea en la base de datos la carrera
    if (existenciaCarrera instanceof NotFoundException) {
      await this.carreraRepository.save(carreraDto);
      return {
        mensaje:
          'Se ha creado existosamente la carrera de ' + carreraDto.nombre + '.',
      };
    } else {
      return {
        mensaje:
          'La carrera ' + carreraDto.nombre + ' ya se encuentra registrada.',
      };
    }
  }

  /* =================================================================================================================== */
  /* =================================== ACTUALIZAR UNA CARRERA EN LA BASE DE DATOS ==================================== */
  /* =================================================================================================================== */

  async actualizarCarreraPorID(
    idCarrera: string,
    carreraDto: CarreraDto,
  ): Promise<UpdateResult | NotFoundException> {
    const carrera = await this.obtenerCarreraPorID(idCarrera);
    if (carrera) {
      return await this.carreraRepository.update(idCarrera, carreraDto);
    } else {
      return new NotFoundException(`No existe la carrera con id ${idCarrera}`);
    }
  }

  /* =================================================================================================================== */
  /* ==================================== ELIMINAR UNA CARRERA EN LA BASE DE DATOS ===================================== */
  /* =================================================================================================================== */

  async eliminarCarreraPorID(
    idCarrera: string,
  ): Promise<DeleteResult | NotFoundException> {
    const carrera = await this.obtenerCarreraPorID(idCarrera);
    if (carrera instanceof NotFoundException) {
      return new NotFoundException(`No existe la carrera con id ${idCarrera}`);
    } else {
      return await this.carreraRepository.delete(idCarrera);
    }
  }

  /* ====================================================================================================================== */
  /* ============================= OBTENER UNA CARRERA POR SU CÓDIGO EN LA BASE DE DATOS ================================== */
  /* ====================================================================================================================== */

  async obtenerCarreraPorCodigo(
    codigoCarrera: string,
  ): Promise<CarreraEntity | NotFoundException> {
    const carrera = await this.carreraRepository.findOne({
      where: { codigo: codigoCarrera },
    });
    if (carrera) {
      return carrera;
    } else {
      return new NotFoundException(
        `No existe la carrera con el código ${codigoCarrera}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* =============================== OBTENER UNA CARRERA POR SU ID EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  async obtenerCarreraPorID(
    idCarrera: string,
  ): Promise<CarreraEntity | NotFoundException> {
    const carrera = await this.carreraRepository.findOne({
      where: { id: idCarrera },
    });
    if (carrera) {
      return carrera;
    } else {
      return new NotFoundException(
        `No existe la carrera con el código ${idCarrera}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* ================================= OBTENER TODAS LAS CARRERA EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  async obtenerCarreras(): Promise<CarreraEntity[]> {
    return this.carreraRepository.find();
  }
}
