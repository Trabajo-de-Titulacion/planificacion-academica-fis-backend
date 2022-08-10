import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "../../mail/services/mail.service";
import { Repository } from 'typeorm';
import { DocenteEntity } from '../entities/docente.entity';
import { DocenteDto } from "../dto/docente.dto";
import { UsuarioService } from "../../usuarios/services/usuario.service";
import { CrearUsuarioDTO } from "../../usuarios/dtos/usuario.dto";
import { RolesEnum } from "../../utils/enum/rol.enum";
import { RolService } from "../../auth/services/rol.service";
import RolUsuarioService from "../../../src/auth/services/rol-usuario.service";
import { RolUsuarioDto } from "../../../src/auth/dtos/rol-usuario";

@Injectable()
export class DocenteService {

    constructor(
        @InjectRepository(DocenteEntity)
        private docenteRepository: Repository<DocenteEntity>,
        private mailService: MailService,
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private rolUsuarioService: RolUsuarioService
    ) { }

    /* ====================================================================================================================== */
    /* ======================================== CREAR UN DOCENTE EN LA BASE DE DATOS ======================================== */
    /* ====================================================================================================================== */

    async crearDocente(docenteDto, clave) {
        // Busqueda en la base la existencia de un docente y/o usuario en base a su correo electrónico
        const existenciaDocente = await this.obtenerDocentePorCorreoElectronico(docenteDto.correoElectronico);
        let existenciaUsuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(docenteDto.correoElectronico);
        const rolDocente = await this.rolService.obtenerRolPorNombre(RolesEnum.DOCENTE);

        // Si no existe, crea en la base de datos al docente caso contrario, solo muestra un mensaje con 0 ingresos
        if (existenciaDocente instanceof NotFoundException && !(rolDocente instanceof NotFoundException)) {
            if (existenciaUsuario == undefined) {
                // Crear un usuario de tipo docente
                const nuevoUsuario: CrearUsuarioDTO = { correo: docenteDto.correoElectronico, clave: clave };
                await this.usuarioService.crearUsuario(nuevoUsuario);
                existenciaUsuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(nuevoUsuario.correo);
            }
            // Vincular el rol
            const rolUsuarioNuevo: RolUsuarioDto = { idUsuario: existenciaUsuario.id, idRol: rolDocente?.id };
            this.rolUsuarioService.crearRolUsuario(rolUsuarioNuevo)

            // Crear el docente en la base de datos
            const nuevoDocente = {
                nombreCompleto: docenteDto.nombreCompleto,
                correoElectronico: docenteDto.correoElectronico,
                usuario: existenciaUsuario
            };
            await this.docenteRepository.save(nuevoDocente);


            // Enviar el correo electrónico
            await this.mailService.envioClaveDocente(clave, docenteDto);

            return "Se creó el docente " + docenteDto.nombreCompleto + " existosamente." +
                " Se envió un correo electrónico a " + docenteDto.correoElectronico + " con el código de acceso.";

        } else {
            return "El docente " + docenteDto.nombreCompleto + " ya se encuentra registrado. "
                + "No se pudo enviar un correo electrónico a " + docenteDto.correoElectronico + " con el código de acceso."
        }
    }

    /* ====================================================================================================================== */
    /* ===================================== CREAR VARIOS DOCENTES EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    async crearVariosDocentes(arregloDocentes, arregloUsuarios) {

        let docentesNoGuardados: DocenteDto[];
        let cantidadDocentesNoGuardados = 0;

        for (let i = 0; i < arregloDocentes.length; i++) {
            // Busqueda en la base la existencia de un docente en base a su correo electrónico
            const existenciaDocente = await this.obtenerDocentePorCorreoElectronico(arregloDocentes[i].correoElectronico);
            let existenciaUsuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(arregloUsuarios[i].correo);
            //TODO: ARREGLAR ESTE METODO
            // Si no existe, crea en la base de datos al docente caso contrario guarda los fallidos
            if (existenciaDocente == undefined && existenciaUsuario == undefined) {
                // Crear un usuario de tipo docente
                const usuarioTipoDocente: CrearUsuarioDTO = {
                    correo: arregloUsuarios.correo,
                    clave: arregloUsuarios.clave
                };
                await this.usuarioService.crearUsuario(usuarioTipoDocente);

                // Vincular el rol
                //   const rolDocente = await this.rolRepository.findOne({ where: { nombre: RolesEnum.DOCENTE } });
                //    await this.rolUsuarioRepository.save({
                //         rol: rolDocente,
                //        usuario: existenciaUsuario
                //    });

                // Crear el docente en la base de datos
                const nuevoDocente = {
                    nombreCompleto: arregloDocentes.nombreCompleto,
                    correoElectronico: arregloDocentes.correoElectronico,
                    usuario: existenciaUsuario
                };

                await this.docenteRepository.save(nuevoDocente);
                await this.docenteRepository.save(arregloDocentes[i]);

                // Envío de correo electrónico
                await this.mailService.envioClaveDocente(arregloUsuarios.clave, arregloDocentes[i]);

            } else {
                docentesNoGuardados[cantidadDocentesNoGuardados] = arregloDocentes[i];
                cantidadDocentesNoGuardados++;
            }

        }

        //Crear un arreglo con los nombres de los docentes duplicados
        let nombresDocentesDuplicados = docentesNoGuardados.map((docente) => {
            return docente.nombreCompleto
        });
        const nombresImprimibles = nombresDocentesDuplicados.join(", ");

        // Envió de resultados
        if (cantidadDocentesNoGuardados == 0) {
            return {
                mensaje: "Se han creado exitosamente " + arregloDocentes.length + " docentes. Se envió un correo electrónico con el código de acceso a cada uno de los docentes.",
                docentes_ingresados: arregloDocentes
            }
        } else {
            return {
                mensaje: "Se han creado exitosamente " + (arregloDocentes.length - cantidadDocentesNoGuardados) + " docentes y se ha enviado un correo electrónico con el código de acceso a cada uno. No se pudo crear a los docentes: " + nombresImprimibles + ", ya que, existen dentro del sistema.",
                docentes_ingresados: arregloDocentes
            }
        }
    }

    /* ====================================================================================================================== */
    /* =================================== OBTENER UN DOCENTE POR ID EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */

    async obtenerDocentePorID(idDocente: string): Promise<DocenteEntity | NotFoundException> {
        const docente = await this.docenteRepository.findOne({ where: { id: idDocente } });
        if (docente) {
            return docente;
        } else {
            return new NotFoundException(`No existe el docente con el id ${idDocente}`)
        }
    }

    /* ====================================================================================================================== */
    /* =========================== OBTENER UN DOCENTE POR CORREO ELECTRÓNICO EN LA BASE DE DATOS ============================ */
    /* ====================================================================================================================== */

    async obtenerDocentePorCorreoElectronico(correoElectronicoDocente: string): Promise<DocenteEntity | NotFoundException> {
        const docente = await this.docenteRepository.findOne({ where: { correoElectronico: correoElectronicoDocente } });
        if (docente) {
            return docente;
        } else {
            return new NotFoundException(`No existe el docente con el correo electrónico ${correoElectronicoDocente}`);
        }
    }

    /* ====================================================================================================================== */
    /* ===================================== ACTUALIZAR UN DOCENTE EN LA BASE DE DATOS ====================================== */
    /* ====================================================================================================================== */

    /* ====================================================================================================================== */
    /* ====================================== ELIMINAR UN DOCENTE EN LA BASE DE DATOS ======================================= */
    /* ====================================================================================================================== */

    /* ====================================================================================================================== */
    /* ================================== OBTENER TODOS LOS DOCENTES EN LA BASE DE DATOS ==================================== */
    /* ====================================================================================================================== */


}
