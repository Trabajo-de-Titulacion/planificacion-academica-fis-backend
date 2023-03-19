import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoAulaDto } from '../dtos/tipo-aula.dto';
import { FacultadEntity } from '../entities/facultad.entity';
import { TipoAulaEntity } from '../entities/tipo-aula.entity';
import { FacultadService } from './facultad.service';

@Injectable()
export class TipoAulaService {
  constructor(
    @InjectRepository(TipoAulaEntity)
    private tipoAulaRepository: Repository<TipoAulaEntity>,
    private servicioFacultad: FacultadService,
  ) {}

  async crearTipoAula(tipoAula: TipoAulaDto) {
    const facultad = await this.servicioFacultad.obtenerFacultadPorSuID(
      tipoAula.idFacultad,
    );
    if (facultad) {
      const nuevoTipoAula = this.tipoAulaRepository.create(tipoAula);
      nuevoTipoAula.facultad = facultad;
      return this.tipoAulaRepository.save(nuevoTipoAula);
    } else {
      return new NotFoundException('Error en crear un tipo de aula');
    }
  }

  async obtenerTipoAulas() {
    return this.tipoAulaRepository.find({ relations: ['facultad'] });
  }

  obtenerCantidadLaboratorios(facultad: FacultadEntity) {
    return facultad.tiposAulas.filter((f) => f.tipo === 'LABORATORIO').length;
  }

  async obtenerTipoAulaPorId(id: string) {
    return this.tipoAulaRepository.findOne({
      where: { id: id },
    });
  }

  async obtenerTipoAulaPorNombreYFacultad(
    nombreTipo: string,
    nombreFacultad: string,
  ) {
    const facultad = await this.servicioFacultad.obtenerFacultadPorSuNombre(
      nombreFacultad,
    );
    return this.tipoAulaRepository.findOne({
      where: {
        tipo: nombreTipo,
        facultad: facultad,
      },
    });
  }

  async eliminarTipoAula(id: string) {
    const tipoAula = this.obtenerTipoAulaPorId(id);
    if (tipoAula) {
      return this.tipoAulaRepository.delete(id);
    } else {
      return null;
    }
  }

  async actualizarTipoAula(tipoAula: TipoAulaDto, id: string) {
    const tipoAulaExistente = await this.tipoAulaRepository.findOne(id);
    tipoAulaExistente.facultad =
      await this.servicioFacultad.obtenerFacultadPorSuID(tipoAula.idFacultad);
    tipoAulaExistente.tipo = tipoAula.tipo;
    return this.tipoAulaRepository.save(tipoAulaExistente);
  }
}
