import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraEntity } from '../../../src/carrera/entities/carrera.entity';
import { CarreraService } from '../../../src/carrera/services/carrera.service';
import { Repository } from 'typeorm';
import { NivelDto } from '../dto/nivel.dto';
import { NivelEntity } from '../entities/nivel.entity';

@Injectable()
export class NivelService {
  constructor(
    @InjectRepository(NivelEntity)
    private nivelRepository: Repository<NivelEntity>,
    private carreraService: CarreraService,
  ) {}

  async crearNivel(nivel: NivelDto) {
    const nivelACrear = this.nivelRepository.create(nivel);
    const carrera = await this.carreraService.obtenerCarreraPorID(
      nivel.idCarrera,
    );
    if (carrera instanceof CarreraEntity) {
      nivelACrear.carrera = carrera;
      const nivel = await this.nivelRepository.save(nivelACrear);
      Logger.log(
        `Se ha creado el nivel con nombre: ${nivel.nombre} para la carrera: ${nivel.carrera.nombre}`,
      );
      return nivel;
    } else {
      throw new NotFoundException({
        code: 'CARRERA_NO_REGISTRADA',
        message: 'No existe una carrera con dicho ID.',
      });
    }
  }

  async obtenerTodosLosNiveles() {
    return await this.nivelRepository.find({ relations: ['carrera'] });
  }

  async obtenerTodosLosNivelesYGrupos() {
    return await this.nivelRepository.find({
      relations: ['carrera', 'grupos'],
    });
  }

  async obtenerNivelPorId(idNivel: string) {
    return await this.nivelRepository.findOne({
      where: {
        id: idNivel,
      },
    });
  }

  async obtenerNivelPorNombre(nombre: string) {
    return await this.nivelRepository.findOne({
      where: {
        nombre: nombre,
      },
    });
  }

  async obtenerNivelesPorCarrera(idCarrera: string) {
    const carrera = await this.carreraService.obtenerCarreraPorID(idCarrera);

    if (carrera instanceof NotFoundException) {
      throw new NotFoundException({
        code: 'CARRERA_NO_REGISTRADA',
        message: 'No existe una carrera con dicho ID.',
      });
    }

    const niveles = await this.nivelRepository.find({
      where: {
        carrera: carrera,
      },
    });

    Logger.log(`Se han encontrado: ${niveles.length} niveles`);
    return niveles;
  }

  eliminarNivel(idNivel: string) {
    return this.nivelRepository.delete(idNivel);
  }
}
