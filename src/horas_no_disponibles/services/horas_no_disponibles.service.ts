import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocenteService } from '../../../src/docente/services/docente.service';
import { JornadaLaboralService } from '../../../src/parametros-iniciales/services/jornada-laboral.service';
import { SemestreService } from '../../../src/parametros-iniciales/services/semestre.service';
import { Repository } from 'typeorm';
import { HorasNoDisponiblesDTO } from '../dto';
import { HoraNoDisponibleEntity } from '../entities/hora_no_disponible.entity';
import { isUUID, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HorasNoDisponiblesService {

  constructor(
    @InjectRepository(HoraNoDisponibleEntity)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponibleEntity>,
    private jornadasLaboralesService: JornadaLaboralService,
    private semestreService: SemestreService,
    private docentesService: DocenteService,
  ) {}

  /* Read */
  async obtenerHorasNoDisponiblesPorDocenteId(id: string) {
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }
    // Obtener semestre cuya planificación está en progreso
    const semestreEnProgreso = await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();
    // Obtener todas las horas no disponibles de un docente
    const horasNoDisponiblesDocente = await this.horasNoDisponiblesRepository.find({
      where: { docente: docente },
      relations: ['dia'],
    });;

    // Retornar aquellas horas que pertenezcan al semestre en progreso
    return horasNoDisponiblesDocente.filter(h => {
      return semestreEnProgreso.jornadas.map(jornada => jornada.id).includes(h.dia.id);
    });
  }

  /* Create */
  async solicitarHorasNoDisponibles(horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    const idDocente = horas_no_disponibles[0].docente_id;
    if (idDocente && !isUUID(idDocente)) {
      throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
    }
    
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(idDocente);
    if (docente instanceof NotFoundException) {
      throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }

    const registrosCorrectos: HoraNoDisponibleEntity[] = [];
    const registrosErroneos: HorasNoDisponiblesDTO[] = [];
    for (let horaDTO of horas_no_disponibles) {
      // Configuraciones iniciales
      const jornada = await this.jornadasLaboralesService.obtenerJornadaPorId(horaDTO.dia_id);
      if (!jornada) {
        registrosErroneos.push(horaDTO);
        continue;
      }
      const horaMinima = Number(jornada.horaInicio.split(':')[0]);
      const horaMaxima = Number(jornada.horaFin.split(':')[0]);
      const horaAlmuerzo = Number(jornada.horaAlmuerzo.split(':')[0]);

      // Filtrar de acuerdo a las configuraciones
      if ((horaDTO.hora_inicio >= horaMinima) &&
          (horaDTO.hora_inicio <= horaMaxima - 1) &&
          (horaDTO.hora_inicio != horaAlmuerzo))
      {
        const horaEntidad = this.horasNoDisponiblesRepository.create({
          docente: docente,
          dia: jornada,
          hora_inicio: horaDTO.hora_inicio,
        });
        registrosCorrectos.push(horaEntidad);
      } else {
        registrosErroneos.push(horaDTO);
      }
    }

    if (registrosCorrectos.length > 0) {
      // Eliminar horas anteriormente registradas
      await this.horasNoDisponiblesRepository.delete({
        docente: docente
      });

      // Crear los nuevos registros
      const registrosCreados = await this.horasNoDisponiblesRepository.save(registrosCorrectos);

      return {
        filas_alteradas: registrosCreados.length,
        mensaje: `Se ha(n) creado ${registrosCreados.length} registro(s). Hay ${registrosErroneos.length} erróneo(s).`,
        registros_creados: registrosCreados,
        registrosErroneos: registrosErroneos,
      }
    }
    return {
      filas_alteradas: 0,
      mensaje: `Los datos enviados son erróneos. Verifique si los días y horas seleccionadas pertenecen a la jornada laboral.`,
      registros_creados: [],
    }
  }

  /* Delete */
  async eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      return new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }
    return await this.horasNoDisponiblesRepository.delete({
      docente: docente
    });
  }

  async comprobarArregloDeHorasNoDisponibles(arreglo: any[]) {
    // Comprobar que lo recibido sea un arreglo
    if (!Array.isArray(arreglo)) {
      throw new HttpException('Los datos enviados no corresponden a un arreglo.', HttpStatus.BAD_REQUEST);
    }
    // Comprobar arreglo vacio
    if (arreglo.length == 0) {
      throw new HttpException('Los datos enviados corresponden a un arreglo vacío.', HttpStatus.BAD_REQUEST);
    }
    for (let item of arreglo) {
      if (!(typeof item === 'object' && item !== null && !Array.isArray(item))) {
        const dtoEjemplo = plainToInstance(HorasNoDisponiblesDTO, {});
        const errores = await validate(dtoEjemplo);
        const estructura = errores.map(error => {
          return { 'propiedad': error.property, 'restricciones': error.constraints }
        });

        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'El arreglo enviado no contiene elementos con la estructura requerida. Cada elemento debe tener las siguientes propiedades con sus respectivas restricciones:',
            estructura: estructura,
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const itemDTO = plainToInstance(HorasNoDisponiblesDTO, item);
      const errores = await validate(itemDTO);
      if (errores.length > 0) {
        throw new HttpException(errores, HttpStatus.BAD_REQUEST);
      }
    }
  }

}