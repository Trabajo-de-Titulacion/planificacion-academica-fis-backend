import {
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
import { SolicitudHoraNoDisponibleEntity } from '../entities/solicitudHoraNoDisponible.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MailService } from '../../../src/mail/services/mail.service';
import ESTADO_SOLICITUD_HORA_NO_DISPONIBLE from '../types/estadoSolicitudHoraNoDisponible.type';

@Injectable()
export class HorasNoDisponiblesService {
  constructor(
    @InjectRepository(HoraNoDisponibleEntity)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponibleEntity>,
    @InjectRepository(SolicitudHoraNoDisponibleEntity)
    private solicitudHorasNoDisponiblesRepository: Repository<SolicitudHoraNoDisponibleEntity>,
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
          dia: jornada,
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
          solicitud: solicitudActual,
        });
        // Se asocian las nuevas horas a la solicitud ya creada
        registrosCorrectos.forEach(
          (hora) => (hora.solicitud = solicitudActual),
        );
        // Se actualiza la fecha de modificación de la solicitud
        await this.solicitudHorasNoDisponiblesRepository.update(
          solicitudActual,
          {
            ultimaModificacion: new Date(),
          },
        );
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
        const solicitud = this.solicitudHorasNoDisponiblesRepository.create({
          docente: docente,
          semestre: semestreEnProgreso,
          horasNoDisponibles: registrosCorrectos,
        });
        await this.solicitudHorasNoDisponiblesRepository.save(solicitud);
        // Mensaje al crear nueva solicitud
        mensaje = `Se ha creado una nueva solicitud para el semestre ${solicitud.semestre.abreviatura}, con ${registrosCorrectos.length} hora(s) no disponible(s).`;
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

    // Buscar solicitud del semestre en progreso
    const semestreEnProgreso =
      await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();
    const solicitudDocente =
      await this.solicitudHorasNoDisponiblesRepository.findOne({
        where: { docente: docente, semestre: semestreEnProgreso },
        relations: ['semestre'],
      });

    return solicitudDocente;
  }

  async obtenerHorasNoDisponiblesSolicitadasPorDocenteId(id: string) {
    const solicitudActual =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id);
    if (!solicitudActual) {
      return [];
    }

    return await this.horasNoDisponiblesRepository.find({
      where: { solicitud: solicitudActual },
      relations: ['dia', 'solicitud'],
    });
  }

  async obtenerSolicitudesDelSemestreEnProgreso() {
    const semestreEnProgreso =
      await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();
    if (!semestreEnProgreso) {
      throw new HttpException(
        'No hay un semestre cuya planificación esté en progreso.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.solicitudHorasNoDisponiblesRepository.find({
      where: { semestre: semestreEnProgreso },
      relations: ['docente'],
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

    // Aprobar solicitud de horas no disponibles
    await this.solicitudHorasNoDisponiblesRepository.update(solicitudDocente, {
      estado: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.APROBADA,
    });

    return new Promise((resolve, reject) => {
      solicitudDocente.docente = docente;
      // Enviar notificación al docente sobre la aprobación de sus horas solicitadas
      this.mailService
        .envioCorreoAprobacionHorasNoDisponibles(solicitudDocente)
        .then(() => {
          const respuesta = {
            mensaje: `Solicitud aprobada. Se ha enviado la notificación respectiva al correo ${docente.correoElectronico}.`,
          };
          resolve(respuesta);
        })
        .catch((error) => {
          console.error(error);
          // La solicitud se ha aprobado, pero el correo no ha podido enviarse
          reject(
            new HttpException(
              'Solicitud aprobada. Hubo un error al enviar la notificación al docente.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });
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

    // Rechazar la solicitud (eliminarla)
    await this.solicitudHorasNoDisponiblesRepository.delete(solicitudDocente);

    return new Promise((resolve, reject) => {
      solicitudDocente.docente = docente;
      // Enviar notificación al docente sobre el rechazo de sus horas solicitadas
      this.mailService
        .envioCorreoRechazoHorasNoDisponibles(solicitudDocente)
        .then(() => {
          const respuesta = {
            mensaje: `Solicitud rechazada. Se ha enviado la notificación respectiva al correo ${docente.correoElectronico}.`,
          };
          resolve(respuesta);
        })
        .catch((error) => {
          console.error(error);
          // La solicitud se ha aprobado, pero el correo no ha podido enviarse
          reject(
            new HttpException(
              'Solicitud rechazada. Hubo un error al enviar la notificación al docente.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });
    });
  }

  async eliminarSolicitudHorasNoDisponiblesPorDocenteId(id: string) {
    const solicitud =
      await this.obtenerSolicitudDeSemestreEnProgresoPorDocenteId(id);
    if (!solicitud) {
      throw new HttpException(
        'El docente no cuenta con una solicitud existente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (solicitud && solicitud.estaAprobada) {
      throw new HttpException(
        'No se puede modificar la solicitud puesto que ya ha sido aprobada.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.solicitudHorasNoDisponiblesRepository.delete(solicitud);
  }

  async obtenerTodasLasHorasNoDisponiblesAprobadas() {
    // Devuelve las solicitudes aprobadas de cada docente junto con sus horas no disponibles
    return await this.solicitudHorasNoDisponiblesRepository.find({
      where: { estado: ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.APROBADA },
      relations: ['horasNoDisponibles'],
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
}
