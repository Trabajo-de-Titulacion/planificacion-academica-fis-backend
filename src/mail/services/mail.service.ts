import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SolicitudHoraNoDisponibleEntity } from 'src/horas_no_disponibles/entities/solicitudHoraNoDisponible.entity';
import { DocenteDto } from '../../docente/dto/docente.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async envioClaveDocente(clave: string, docente: DocenteDto) {
    const valor = await this.mailerService.sendMail({
      to: docente.correoElectronico,
      subject: 'Bienvenido al sistema de Planificación Académica',
      template: 'claveDocente',
      context: {
        nombre: docente.nombreCompleto,
        clave: clave,
      },
    });
    return valor;
  }

  async envioCorreoAprobacionHorasNoDisponibles(
    solicitud: SolicitudHoraNoDisponibleEntity,
  ) {
    return await this.mailerService.sendMail({
      to: solicitud.docente.correoElectronico,
      subject: `Aprobación de la solicitud de horas no disponibles para la planificación académica del semestre ${solicitud.semestre.abreviatura}`,
      template: 'aprobacionSolicitudHorasNoDisponibles',
      context: {
        nombreDocente: solicitud.docente.nombreCompleto,
        abreviaturaSemestre: solicitud.semestre.abreviatura,
      },
    });
  }

  async envioCorreoRechazoHorasNoDisponibles(
    solicitud: SolicitudHoraNoDisponibleEntity,
  ) {
    return await this.mailerService.sendMail({
      to: solicitud.docente.correoElectronico,
      subject: `Rechazo de la solicitud de horas no disponibles para la planificación académica del semestre ${solicitud.semestre.abreviatura}`,
      template: 'rechazoSolicitudHorasNoDisponibles',
      context: {
        nombreDocente: solicitud.docente.nombreCompleto,
        abreviaturaSemestre: solicitud.semestre.abreviatura,
      },
    });
  }
}
