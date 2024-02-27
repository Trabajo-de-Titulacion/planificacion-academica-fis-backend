import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JornadaLaboralDto } from '../dtos/jornada-laboral.dto';
import { JornadaLaboralEntity } from '../entities/jornada-laboral.entity';
import ESTADO_SEMESTRE from '../types/estado-semestre.type';
import { SemestreService } from './semestre.service';
import { JORNADA_NO_LABORABLE } from 'src/utils/constantes';

@Injectable()
export class JornadaLaboralService {
  constructor(
    @InjectRepository(JornadaLaboralEntity)
    private repositorioJornadaLaboral: Repository<JornadaLaboralEntity>,
    private servicioSemestre: SemestreService,
  ) {}

  async crearJornadaLaboral(jornada: JornadaLaboralDto) {
    const jornadaLaboralACrear = this.repositorioJornadaLaboral.create(jornada);
    const semestre = await this.servicioSemestre.obtenerSemestrePorSuID(
      jornada.idSemestre,
    );
    if (semestre) {
      jornadaLaboralACrear.semestre = semestre;
      return await this.repositorioJornadaLaboral.save(jornadaLaboralACrear);
    } else {
      return new NotFoundException('No se ha creado la jornada laboral');
    }
  }

  async obtenerJornadasLaborales() {
    let jornadas = await this.repositorioJornadaLaboral.find({
      relations: ['semestre'],
    });
    jornadas = jornadas.filter((e) => {
      return JORNADA_NO_LABORABLE.find(
        (j) =>
          e.dia != j.dia &&
          e.horaInicio != j.horaInicio &&
          e.horaFin != j.horaFin,
      );
    });
    return jornadas;
  }

  async obtenerJornadaLaboralPorSemestre(idSemestre: string) {
    let jornadas = await this.repositorioJornadaLaboral.find({
      where: { semestre: { id: idSemestre } },
    });
    jornadas = jornadas.filter((e) => {
      return JORNADA_NO_LABORABLE.find(
        (j) =>
          e.dia != j.dia &&
          e.horaInicio != j.horaInicio &&
          e.horaFin != j.horaFin,
      );
    });
    return jornadas;
  }

  async obtenerJornadaPorId(id: string) {
    const jornada = await this.repositorioJornadaLaboral.findOne({
      where: {
        id,
      },
    });
    return jornada;
  }

  async obtenerIntervalos(idJornada: string) {
    const jornada = await this.repositorioJornadaLaboral.findOne({
      where: {
        id: idJornada,
      },
    });
    return this.obtenerIntervalosDeUnaJornada(jornada);
  }

  async obtenerNumeroDeIntervalos(jornada: JornadaLaboralEntity) {
    return (await this.obtenerIntervalosDeUnaJornada(jornada)).length;
  }

  async obtenerIntervalosDeUnaJornada(jornada: JornadaLaboralEntity) {
    const horaInicio = jornada.horaInicio
      .split(':')
      .map((tiempo) => parseInt(tiempo))[0];
    const horaFin = jornada.horaFin
      .split(':')
      .map((tiempo) => parseInt(tiempo))[0];
    const horaAlmuerzo = jornada.horaAlmuerzo
      .split(':')
      .map((tiempo) => parseInt(tiempo))[0];

    const fecha = '08/08/2022';

    const fechaReferencialInicio = new Date(fecha);
    fechaReferencialInicio.setHours(horaInicio, 0, 0);

    const fechaReferencialFinal = new Date(fecha);
    fechaReferencialFinal.setHours(horaFin, 0, 0);

    const horas =
      fechaReferencialFinal.getHours() - fechaReferencialInicio.getHours();

    const intervalos = [];
    const formatoMinutos = ':00';

    if (horas > 0 && horaInicio < horaAlmuerzo && horaAlmuerzo < horaFin) {
      for (let hora = horaInicio; hora < horaFin; hora++) {
        if (hora != horaAlmuerzo) {
          intervalos.push([
            `${hora}${formatoMinutos}`,
            `${hora + 1}${formatoMinutos}`,
          ]);
        }
      }
      return intervalos;
    } else {
      return [];
    }
  }

  async eliminarJornadaLaboralPorSemestre(idSemestre: string) {
    const semestre =
      await this.servicioSemestre.obtenerSemestrePorSuID(idSemestre);
    if (semestre.estado === ESTADO_SEMESTRE.PLANIFICACION_EN_PROGRESO) {
      this.repositorioJornadaLaboral.delete({ semestre: { id: idSemestre } });
    } else {
      return new NotFoundException(
        'No se ha podido eliminar la jornada laboral',
      );
    }
  }
}
