import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { DocenteDto } from '../../docente/dto/docente.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

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
}