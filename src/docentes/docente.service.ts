import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "../mail/mail.service";
import { Repository } from 'typeorm';
import { Docente } from './entities/docente.entity'
import { DocenteDto } from "./dto/docente.dto";

@Injectable()
export class DocenteService {

    constructor(
        @InjectRepository(Docente)
        private docenteRepository: Repository<Docente>,
        private mailService: MailService
    ) { }

    // Crear un docente en la base de datos

    async createDocente(docenteDto) {

        // Busqueda en la base la existencia de un docente en base a su correo electrónico
        const existenciaDocente = await this.docenteRepository.find({
            where: {
                correoElectronico: docenteDto.correoElectronico,
            }
        })

        // Si no existe, crea en la base de datos al docente
        // caso contrario, solo muestra un mensaje con 0 ingresos

        if (existenciaDocente.length == 0) {
            await this.docenteRepository.save(docenteDto);
            await this.mailService.envioCodigoDocente(docenteDto);
            return {
                mensaje: "Se creó el docente " + docenteDto.nombreCompleto + " (" + docenteDto.correoElectronico + ") existosamente.",
                se_registro_codigo: true,
                respuesta_correo: "Correo electrónico enviado"
            }

        } else {
            return {
                mensaje: "El docente " + docenteDto.nombreCompleto + " (" + docenteDto.correoElectronico + ") ya se encuentra registrado.",
                se_registro_codigo: false,
                respuesta_correo: "Correo electrónico no enviado"
            }
        }
    }

    async crearVariosDocentes(docentesDto) {

        let cantidadDocentesNoGuardados = 0;

        for (let i = 0; i < docentesDto.length; i++) {
            // Busqueda en la base la existencia de un docente en base a su correo electrónico
            const existenciaDocente = await this.docenteRepository.find({
                where: {
                    correoElectronico: docentesDto[i].correoElectronico,
                }
            })

            // Si no existe, crea en la base de datos al docente
            // caso contrario, contabiliza los fallidos
            if (existenciaDocente.length == 0) {
                await this.docenteRepository.save(docentesDto[i]);
                try {

                    await this.mailService.envioCodigoDocente(docentesDto[i]);
                } catch (err) {
                    console.log(err)

                }
            } else {
                cantidadDocentesNoGuardados++;
            }

        }

        // Envió de resultados

        if (cantidadDocentesNoGuardados == 0) {
            return {
                mensaje: "Se han creado exitosamente " + docentesDto.length + " docentes.",
                cantidad_ingresos: docentesDto.length,
                respuesta_correo: "Correos electrónicos enviados"
            }
        } else {
            return {
                mensaje: "Se han creado exitosamente " + (docentesDto.length - cantidadDocentesNoGuardados) + " docentes. Se trató de crear " + cantidadDocentesNoGuardados + " docentes existentes en el sistema.",
                cantidad_ingresos: (docentesDto.length - cantidadDocentesNoGuardados),
                respuesta_correo: "Existen correos electrónicos no enviados"
            }
        }


    }
}
