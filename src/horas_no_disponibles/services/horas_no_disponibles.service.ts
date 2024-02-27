import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocenteService } from '../../../src/docente/services/docente.service';
import { JornadaLaboralService } from '../../../src/parametros-iniciales/services/jornada-laboral.service';
import { SemestreService } from '../../../src/parametros-iniciales/services/semestre.service';
import { Repository } from 'typeorm';
import { HorasNoDisponiblesDTO } from '../dto';
import { HoraNoDisponibleEntity } from '../entities/hora_no_disponible.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MailService } from '../../../src/mail/services/mail.service';
import { HoraDiaNoDisponibleDTO } from 'src/horas_no_disponibles/dto/hora_dia_noDisponible.dto';
import { DocenteEntity } from 'src/docente/entities/docente.entity';
import { JornadaLaboralEntity } from 'src/parametros-iniciales/entities/jornada-laboral.entity';

@Injectable()
export class HorasNoDisponiblesService {
  constructor(
    @InjectRepository(HoraNoDisponibleEntity)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponibleEntity>,
    private jornadasLaboralesService: JornadaLaboralService,
    private semestreService: SemestreService,
    private docentesService: DocenteService,
    private mailService: MailService,
  ) {}

  async solicitarHorasNoDisponibles(
    idDocente: string,
    horasNoDisponibles: HorasNoDisponiblesDTO[],
  ) {
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(idDocente);
    if (docente instanceof NotFoundException) {
      throw new HttpException(
        'No se encontró el docente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Buscar si existe una solicitud ya creada
    const solicitudActual =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(idDocente);
    if (solicitudActual && solicitudActual.estaAprobada) {
      throw new HttpException(
        'No se puede modificar la solicitud puesto que ya ha sido aprobada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const registrosCorrectos: HoraNoDisponibleEntity[] = [];
    const registrosErroneos: HorasNoDisponiblesDTO[] = [];
    for (const horaDTO of horasNoDisponibles) {
      // Configuraciones iniciales
      const jornada = await this.jornadasLaboralesService.obtenerJornadaPorId(
        horaDTO.dia_id,
      );
      if (!jornada) {
        registrosErroneos.push(horaDTO);
        continue;
      }
      const horaMinima = Number(jornada.horaInicio.split(':')[0]);
      const horaMaxima = Number(jornada.horaFin.split(':')[0]);
      const horaAlmuerzo = Number(jornada.horaAlmuerzo.split(':')[0]);

      // Filtrar de acuerdo a las configuraciones
      if (
        horaDTO.hora_inicio >= horaMinima &&
        horaDTO.hora_inicio <= horaMaxima - 1 &&
        horaDTO.hora_inicio != horaAlmuerzo
      ) {
        const horaEntidad = this.horasNoDisponiblesRepository.create({
          jornada: jornada,
          hora_inicio: horaDTO.hora_inicio,
        });
        registrosCorrectos.push(horaEntidad);
      } else {
        registrosErroneos.push(horaDTO);
      }
    }

    if (registrosCorrectos.length > 0 && registrosErroneos.length == 0) {
      // Mensaje a devolver
      let mensaje: string;
      // Si ya existe una solicitud
      if (solicitudActual) {
        // Eliminar horas anteriormente registradas
        await this.horasNoDisponiblesRepository.delete({
          //solicitud: solicitudActual,
        });
        // Se asocian las nuevas horas a la solicitud ya creada
        //registrosCorrectos.forEach(
        //(hora) => (hora.solicitud = solicitudActual),
        //);
        // Se actualiza la fecha de modificación de la solicitud
        //await this.solicitudHorasNoDisponiblesRepository.update(
        //solicitudActual,
        //{
        //ultimaModificacion: new Date(),
        //},
        //);
        // Se guardan los nuevos registros de horas
        await this.horasNoDisponiblesRepository.save(registrosCorrectos);
        // Mensaje al actualizar
        mensaje = `Se ha actualizado su solicitud para el semestre ${solicitudActual.semestre.abreviatura}, con ${registrosCorrectos.length} hora(s) no disponible(s).`;
      } else {
        // Crear nueva solicitud
        const semestreEnProgreso =
          await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();
        if (!semestreEnProgreso) {
          throw new HttpException(
            'No existe un semestre cuya planificación esté en progreso.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      // Retornar mensaje y arreglo de los registros creados
      return {
        mensaje: mensaje,
        registros_creados: registrosCorrectos,
      };
    }
    throw new HttpException(
      `Los datos enviados son erróneos. Verifique si los días y horas seleccionadas pertenecen a la jornada laboral.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  async obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id: string) {
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      throw new HttpException(
        'No se encontró el docente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return null;
  }

  async obtenerHorasNoDisponiblesSolicitadasPorDocenteId(id: string) {
    const solicitudActual =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id);
    if (!solicitudActual) {
      return [];
    }

    return await this.horasNoDisponiblesRepository.find({
      where: {},
      relations: ['dia', 'solicitud'],
    });
  }

  async aprobarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      throw new HttpException(
        'No se encontró el docente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Buscar solicitud
    const solicitudDocente =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id);
    if (!solicitudDocente) {
      throw new HttpException(
        'El docente indicado no ha realizado ninguna solicitud.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Si la solicitud ya ha sido aprobada antes
    if (solicitudDocente.estaAprobada) {
      throw new HttpException(
        'La solicitud ya ha sido aprobada anteriormente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Promise(() => {
      solicitudDocente.docente = docente;
      // Enviar notificación al docente sobre la aprobación de sus horas solicitadas
    });
  }

  async rechazarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      throw new HttpException(
        'No se encontró el docente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Buscar solicitud
    const solicitudDocente =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id);
    if (!solicitudDocente) {
      throw new HttpException(
        'El docente indicado no ha realizado ninguna solicitud.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Si la solicitud ya ha sido aprobada antes
    if (solicitudDocente.estaAprobada) {
      throw new HttpException(
        'La solicitud ya ha sido aprobada anteriormente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Promise(() => {
      solicitudDocente.docente = docente;
      // Enviar notificación al docente sobre el rechazo de sus horas solicitadas
    });
  }

  async comprobarArregloDeHorasNoDisponibles(arreglo: any[]) {
    // Comprobar que lo recibido sea un arreglo
    if (!Array.isArray(arreglo)) {
      throw new HttpException(
        'Los datos enviados no corresponden a un arreglo.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Comprobar arreglo vacio
    if (arreglo.length == 0) {
      throw new HttpException(
        'Los datos enviados corresponden a un arreglo vacío.',
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const item of arreglo) {
      if (
        !(typeof item === 'object' && item !== null && !Array.isArray(item))
      ) {
        const dtoEjemplo = plainToInstance(HorasNoDisponiblesDTO, {});
        const errores = await validate(dtoEjemplo);
        const estructura = errores.map((error) => {
          return {
            propiedad: error.property,
            restricciones: error.constraints,
          };
        });

        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message:
              'El arreglo enviado no contiene elementos con la estructura requerida. Cada elemento debe tener las siguientes propiedades con sus respectivas restricciones:',
            estructura: estructura,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const itemDTO = plainToInstance(HorasNoDisponiblesDTO, item);
      const errores = await validate(itemDTO);
      if (errores.length > 0) {
        throw new HttpException(errores, HttpStatus.BAD_REQUEST);
      }
    }
  }

  //Para crar hora dia NO disponible
  async crearHoraDiaNoDisponible(data: HoraDiaNoDisponibleDTO) {
    console.log("DATA",data)
    
    console.log('Se han recibido los datos');
    const docente = await this.docentesService.obtenerDocentePorID(
      data.docente_id,
    );

    const jornada = await this.jornadasLaboralesService.obtenerJornadaPorId(
      data.jornada_id,
    );

    const dataHoraInicio = this.convertirNumeroAFecha(data.hora_inicio);

    console.log("Comparacion: ", jornada.horaInicio, dataHoraInicio);

    /*const operation = await this.horasNoDisponiblesRepository.delete({
      
        docente: docente as DocenteEntity,
        jornada: jornada,
        hora_inicio: data.hora_inicio,
      
    });
    console.log("OPeration: ", operation);*/

    const horaNoDisponibleExiste =
      await this.horasNoDisponiblesRepository.findOne({
        where: {
          docente: docente as DocenteEntity,
          jornada: jornada,
          hora_inicio: data.hora_inicio,
        },
      });
    if (horaNoDisponibleExiste) {
      /*throw new BadRequestException({
        code: 'HORA_DIA_YA_EXISTE',
        message:
          'La hora y dia no disponible ya se encuentra registrada en el sistema',
      });*/
      await this.horasNoDisponiblesRepository.remove(horaNoDisponibleExiste);
      console.log("Hora no disponible eliminada con éxito.");
    }

    await this.horasNoDisponiblesRepository.save({
      docente: docente as DocenteEntity,
      jornada: jornada,
      hora_inicio: data.hora_inicio,
    });
  }

  async calcultarTotalDeHorasNoDisponiblesDelDocente(idDocente: string) {
    const horasNoDisponiblesDelDocente =
      await this.obtenerHorasDiasNoDisponiblesDelDocente(idDocente);
    return horasNoDisponiblesDelDocente.length;
  }

  //Para obtener horas dias No disponbiles por id docente
  async obtenerHorasDiasNoDisponiblesDelDocente(idDocente: string) {
    const docente = await this.docentesService.obtenerDocentePorID(idDocente);
    const horasNoDisponbilesDelDocente =
      await this.horasNoDisponiblesRepository.find({
        where: {
          docente: docente as DocenteEntity,
        },
        relations: ['jornada'],
      });
    const horasNoDisponiblesFiltro = horasNoDisponbilesDelDocente.map((e) => {
      return {
        idHoraNoDisponible: e.id,
        idJornada: e.jornada.id,
        dia: e.jornada.dia,
        hora_inicio: e.hora_inicio,
      };
    });
    return horasNoDisponiblesFiltro;
  }

  //Metodo para archivo FET

  async getEtiquetasHorarios() {
    const docentes = await this.docentesService.obtenerDocentes();

    let output = [];
    const output_promises = docentes.map(async (docente) => {
      const weight_percentage = 100;
      const totalHoras =
        await this.calcultarTotalDeHorasNoDisponiblesDelDocente(docente.id);
      const horasNoDisponiblesDocente =
        await this.obtenerHorasDiasNoDisponiblesDelDocente(docente.id);
      const horasFiltro = horasNoDisponiblesDocente.map(
        (horaNoDisponibleDocente) => {
          const day =
            horaNoDisponibleDocente.dia &&
            typeof horaNoDisponibleDocente.dia === 'string'
              ? horaNoDisponibleDocente.dia.charAt(0) +
                horaNoDisponibleDocente.dia.slice(1).toLowerCase()
              : '';

          const startHour =
            horaNoDisponibleDocente.hora_inicio < 10
              ? '0' + horaNoDisponibleDocente.hora_inicio
              : horaNoDisponibleDocente.hora_inicio;

          const endHour =
            horaNoDisponibleDocente.hora_inicio + 1 < 10
              ? '0' + (horaNoDisponibleDocente.hora_inicio + 1)
              : horaNoDisponibleDocente.hora_inicio + 1;

          return {
            Day: day,
            Hour: `${startHour}:00-${endHour}:00`,
          };

          //return {
          //day: horaNoDisponibleDocente.dia,
          //hour: `${horaNoDisponibleDocente.hora_inicio < 10 ? '0' + horaNoDisponibleDocente.hora_inicio : horaNoDisponibleDocente.hora_inicio}:00-${horaNoDisponibleDocente.hora_inicio+1 < 10 ? '0'+horaNoDisponibleDocente.hora_inicio+1 : horaNoDisponibleDocente.hora_inicio+1}:00`,
          //}
        },
      );
      return {
        Weight_Percentage: weight_percentage,
        Teacher: docente.nombreCompleto,
        Number_of_Not_Available_Times: totalHoras,
        Not_Available_Time: horasFiltro,
      };
    });
    return Promise.all(output_promises).then((resultados) => {
      output = resultados;
      return output;
    });
  }

  convertirNumeroAFecha(numero:number): string {
    const horas = numero.toString().padStart(2, '0');
    return `${horas}:00`;
  }

}
