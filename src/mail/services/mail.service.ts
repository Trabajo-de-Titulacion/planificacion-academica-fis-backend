import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { DocenteEntity } from '../../docente/entities/docente.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async envioClaveDocente(docente: DocenteEntity) {

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