import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Docente } from './../docentes/entities/docente.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async envioCodigoDocente(docente: Docente) {

        const valor = await this.mailerService.sendMail({
            to: docente.correoElectronico,
            subject: 'Bienvenido al sistema de Planificación Académica',
            template: 'codigoDocente',
            context: {
                nombre: docente.nombreCompleto,
                codigo: docente.codigoIngreso,
            },
        });
        return valor;
    }
}