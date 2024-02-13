import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SemestreDTO } from '../dtos/semestre.dto';
import { SemestreEntity } from '../entities/semestre.entity';
import ESTADO_SEMESTRE from '../types/estado-semestre.type';
import { JORNADA_NO_LABORABLE } from 'src/utils/constantes';
import DIAS from '../types/dia.type';

@Injectable()
export class SemestreService {
  constructor(
    @InjectRepository(SemestreEntity)
    private semestreRepository: Repository<SemestreEntity>,
  ) {}

  async crearSemestre(semestre: SemestreDTO) {
    const semestreCreado = await this.semestreRepository.save(semestre);
    await this.semestreRepository.update(
      { id: Not(semestreCreado.id) }, // WHERE
      { estado: ESTADO_SEMESTRE.PLANIFICACION_CULMINADA }, // SET
    );
    return semestreCreado;
  }

  async obtenerSemestrePorSuID(id: string) {
    return this.semestreRepository.findOne({
      where: {
        id,
      },
    });
  }

  async obtenerSemestres() {
    return this.semestreRepository.find();
  }

  async obtenerSemestreConPlanificacionEnProgreso() {
    const semestre = await this.semestreRepository.findOne({
      where: { estado: ESTADO_SEMESTRE.PLANIFICACION_EN_PROGRESO },
      relations: ['jornadas'],
    });
    semestre.jornadas = semestre.jornadas.map((e) => {
      if (e.dia === DIAS.SABADO || e.dia === DIAS.DOMINGO) {
        e.horaFin = JORNADA_NO_LABORABLE.find(
          (j) => j.dia === e.dia,
        ).horaInicio;
      }
      return e;
    });
    return semestre;
  }
}
