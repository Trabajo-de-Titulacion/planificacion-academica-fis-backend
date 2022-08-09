import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity';
import { DocenteEntity } from '../../docente/entities/docente.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async envioClaveDocente(usuarioDocente: UsuarioEntity, docente: DocenteEntity) {

        const valor = await this.mailerService.sendMail({
            to: usuarioDocente.correo,
            subject: 'Bienvenido al sistema de Planificación Académica',
            template: 'codigoDocente',
            context: {
                nombre: docente.nombreCompleto,
                codigo: usuarioDocente.clave,
            },
        });
        return valor;
    }
}