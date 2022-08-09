import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "../../mail/services/mail.service";
import { Repository } from 'typeorm';
import { DocenteEntity } from '../entities/docente.entity';
import { DocenteDto } from "../dto/docente.dto";
import { UsuarioEntity } from "../../usuarios/entities/usuario.entity";
import { UsuarioService } from "../../usuarios/services/usuario.service";
import { CrearUsuarioDTO } from "../../usuarios/dtos/usuario.dto";
import { RolEntity } from "../../auth/entities/rol.entity";
import { RolesEnum } from "../../utils/enum/rol.enum";
import { RolUsuarioEntity } from "../../auth/entities/rol-usuario.entity";

@Injectable()
export class DocenteService {

    constructor(
        @InjectRepository(DocenteEntity)
        private docenteRepository: Repository<DocenteEntity>,
        private mailService: MailService,
        @InjectRepository(UsuarioEntity)
        private usuarioRepository: Repository<UsuarioEntity>,
        private usuarioService: UsuarioService,
        @InjectRepository(RolEntity)
        private rolRepository: Repository<RolEntity>,
        @InjectRepository(RolUsuarioEntity)
        private rolUsuarioRepository: Repository<RolUsuarioEntity>
    ) { }

    /* ====================================================================================================================== */
    /* ======================================== CREAR UN DOCENTE EN LA BASE DE DATOS ======================================== */
    /* ====================================================================================================================== */

    async crearDocente(docenteDto, codigo) {
        // Busqueda en la base la existencia de un docente y/o usuario en base a su correo electrónico
        const existenciaDocente = await this.docenteRepository.find({ where: { correoElectronico: docenteDto.correoElectronico, } });
        const existenciaUsuario = await this.usuarioRepository.find({ where: { correo: docenteDto.correoElectronico, } });

        // Si no existe, crea en la base de datos al docente caso contrario, solo muestra un mensaje con 0 ingresos
        if (existenciaDocente.length == 0 && existenciaUsuario.length == 0) {
            // Crear un usuario de tipo docente
            const usuarioTipoDocente: CrearUsuarioDTO = {
                correo: docenteDto.correoElectronico,
                clave: codigo
            };
            await this.usuarioService.crearUsuario(usuarioTipoDocente);

            // Vincular el rol
            const usuarioNuevo = await this.usuarioRepository.findOne({ where: { correo: usuarioTipoDocente.correo, } });
            const rolDocente = await this.rolRepository.findOne({ where: { nombre: RolesEnum.DOCENTE } });

            await this.rolUsuarioRepository.save({
                rol: rolDocente,
                usuario: usuarioNuevo
            });

            // Crear el docente en la base de datos
            const nuevoDocente = {
                nombreCompleto: docenteDto.nombreCompleto,
                correoElectronico: docenteDto.correoElectronico,
                usuario: usuarioNuevo
            };
            await this.docenteRepository.save(nuevoDocente);

            // Enviar el correo electrónico
            await this.mailService.envioClaveDocente(usuarioNuevo, docenteDto);

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
            const existenciaDocente = await this.docenteRepository.find({ where: { correoElectronico: arregloDocentes[i].correoElectronico, } });
            const existenciaUsuario = await this.usuarioRepository.find({ where: { correo: arregloUsuarios[i].correo, } });

            // Si no existe, crea en la base de datos al docente caso contrario guarda los fallidos
            if (existenciaDocente.length == 0 && existenciaUsuario.length == 0) {
                // Crear un usuario de tipo docente
                const usuarioTipoDocente: CrearUsuarioDTO = {
                    correo: arregloUsuarios.correo,
                    clave: arregloUsuarios.clave
                };
                await this.usuarioService.crearUsuario(usuarioTipoDocente);

                // Vincular el rol
                const usuarioNuevo = await this.usuarioRepository.findOne({ where: { correo: usuarioTipoDocente.correo, } });
                const rolDocente = await this.rolRepository.findOne({ where: { nombre: RolesEnum.DOCENTE } });
                await this.rolUsuarioRepository.save({
                    rol: rolDocente,
                    usuario: usuarioNuevo
                });

                // Crear el docente en la base de datos
                const nuevoDocente = {
                    nombreCompleto: arregloDocentes.nombreCompleto,
                    correoElectronico: arregloDocentes.correoElectronico,
                    usuario: usuarioNuevo
                };

                await this.docenteRepository.save(nuevoDocente);
                await this.docenteRepository.save(arregloDocentes[i]);

                // Envío de correo electrónico
                await this.mailService.envioClaveDocente(usuarioNuevo, arregloDocentes[i]);

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

    async obtenerDocentePorID(idDocente: string): Promise<DocenteEntity> {
        return await this.docenteRepository.findOne({ id: idDocente });
    }

    /* ====================================================================================================================== */
    /* =========================== OBTENER UN DOCENTE POR CORREO ELECTRÓNICO EN LA BASE DE DATOS ============================ */
    /* ====================================================================================================================== */

    async obtenerDocentePorCorreoElectronico(correoElectronicoDocente: string): Promise<DocenteEntity> {
        return await this.docenteRepository.findOne({ correoElectronico: correoElectronicoDocente });
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
