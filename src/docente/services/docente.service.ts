import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../mail/services/mail.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DocenteEntity } from '../entities/docente.entity';
import { DocenteDto } from '../dto/docente.dto';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { CrearUsuarioDTO } from '../../usuarios/dtos/usuario.dto';
import { RolesEnum } from '../../utils/enum/rol.enum';
import { RolService } from '../../auth/services/rol.service';
import RolUsuarioService from '../../../src/auth/services/rol-usuario.service';
import { RolUsuarioDto } from '../../../src/auth/dtos/rol-usuario';

@Injectable()
export class DocenteService {
  constructor(
    @InjectRepository(DocenteEntity)
    private docenteRepository: Repository<DocenteEntity>,
    private mailService: MailService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private rolUsuarioService: RolUsuarioService,
  ) {}

  /* ====================================================================================================================== */
  /* ======================================== CREAR UN DOCENTE EN LA BASE DE DATOS ======================================== */
  /* ====================================================================================================================== */

  async crearDocente(docenteDto: DocenteDto, clave: string) {
    // Busqueda en la base la existencia de un docente y/o usuario en base a su correo electrónico
    const existenciaDocente = await this.obtenerDocentePorCorreoElectronico(
      docenteDto.correoElectronico,
    );
    let existenciaUsuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(
      docenteDto.correoElectronico,
    );
    const rolDocente = await this.rolService.obtenerRolPorNombre(
      RolesEnum.DOCENTE,
    );

    // Si no existe, crea en la base de datos al docente caso contrario, solo muestra un mensaje con 0 ingresos
    if (
      existenciaDocente instanceof NotFoundException &&
      !(rolDocente instanceof NotFoundException)
    ) {
      if (!existenciaUsuario) {
        // Crear un usuario de tipo docente
        const nuevoUsuario: CrearUsuarioDTO = {
          correo: docenteDto.correoElectronico,
          clave: clave,
        };
        await this.usuarioService.crearUsuario(nuevoUsuario);
        existenciaUsuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(
          nuevoUsuario.correo,
        );

        // Enviar el correo electrónico
        //   await this.mailService.envioClaveDocente(clave, docenteDto);
      }

      // Vincular el rol
      const rolUsuarioNuevo: RolUsuarioDto = {
        idUsuario: existenciaUsuario.id,
        idRol: rolDocente.id,
      };
      this.rolUsuarioService.crearRolUsuario(rolUsuarioNuevo);

      // Crear el docente en la base de datos
      const nuevoDocente = {
        nombreCompleto: docenteDto.nombreCompleto,
        correoElectronico: docenteDto.correoElectronico,
        usuario: existenciaUsuario,
      };
      await this.docenteRepository.save(nuevoDocente);
      Logger.log({
        mensaje:
          'Se creó el docente ' +
          docenteDto.nombreCompleto +
          ' existosamente.' +
          ' Se envió un correo electrónico a ' +
          docenteDto.correoElectronico +
          ' con la clave de acceso.',
      });
      Logger.log({
        mensaje:
          'Se creó el docente ' +
          docenteDto.nombreCompleto +
          ' existosamente.' +
          ' Se envió un correo electrónico a ' +
          docenteDto.correoElectronico +
          ' con la clave de acceso.',
      });
      return {
        mensaje:
          'Se creó el docente ' +
          docenteDto.nombreCompleto +
          ' existosamente.' +
          ' Se envió un correo electrónico a ' +
          docenteDto.correoElectronico +
          ' con la clave de acceso.',
      };
    } else {
      return {
        mensaje:
          'El docente ' +
          docenteDto.nombreCompleto +
          ' ya se encuentra registrado. ' +
          'No se pudo enviar un correo electrónico a ' +
          docenteDto.correoElectronico +
          ' con la clave de acceso.',
      };
    }
  }

  /* ====================================================================================================================== */
  /* ===================================== CREAR VARIOS DOCENTES EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  async crearVariosDocentes(
    arregloDocentes: DocenteDto[],
    arregloUsuarios: CrearUsuarioDTO[],
  ) {
    const docentesNoGuardados: DocenteDto[] = [];
    let cantidadDocentesNoGuardados = 0;
    const arregloDocentesCreados: DocenteDto[] = [];
    let cantidadDocenteGuardado = 0;

    for (let i = 0; i < arregloDocentes.length; i++) {
      Logger.log(arregloDocentes[i]);
      // Busqueda en la base la existencia de un docente y/o usuario en base a su correo electrónico
      const existenciaDocenteArchivo =
        await this.obtenerDocentePorCorreoElectronico(
          arregloDocentes[i].correoElectronico,
        );
      let existenciaUsuarioArchivo =
        await this.usuarioService.obtenerUsuarioPorSuCorreo(
          arregloDocentes[i].correoElectronico,
        );
      const rolDocente = await this.rolService.obtenerRolPorNombre(
        RolesEnum.DOCENTE,
      );

      Logger.log({
        existenciaDocenteArchivo,
        existenciaUsuarioArchivo,
        rolDocente,
      });

      if (
        existenciaDocenteArchivo instanceof NotFoundException &&
        !(rolDocente instanceof NotFoundException)
      ) {
        if (!existenciaUsuarioArchivo) {
          // Crear un usuario de tipo docente
          const nuevoUsuario: CrearUsuarioDTO = {
            correo: arregloDocentes[i].correoElectronico,
            clave: arregloUsuarios[i].clave,
          };
          Logger.log(nuevoUsuario, 'nuevoUsuario');
          await this.usuarioService.crearUsuario(nuevoUsuario);
          existenciaUsuarioArchivo =
            await this.usuarioService.obtenerUsuarioPorSuCorreo(
              nuevoUsuario.correo,
            );

          // Enviar el correo electrónico
          /* await this.mailService.envioClaveDocente(
             arregloUsuarios[i].clave,
             arregloDocentes[i],
           );*/
        }
        // Vincular el rol
        const rolUsuarioNuevo: RolUsuarioDto = {
          idUsuario: existenciaUsuarioArchivo.id,
          idRol: rolDocente.id,
        };
        this.rolUsuarioService.crearRolUsuario(rolUsuarioNuevo);

        // Crear el docente en la base de datos
        const nuevoDocente = {
          nombreCompleto: arregloDocentes[i].nombreCompleto,
          correoElectronico: arregloDocentes[i].correoElectronico,
          usuario: existenciaUsuarioArchivo,
        };
        await this.docenteRepository.save(nuevoDocente);

        //Guardar docente creado
        arregloDocentesCreados[cantidadDocenteGuardado] = arregloDocentes[i];
        cantidadDocenteGuardado++;
      } else {
        docentesNoGuardados[cantidadDocentesNoGuardados] = arregloDocentes[i];
        cantidadDocentesNoGuardados++;
      }
    }

    // Envió de resultados
    if (!cantidadDocentesNoGuardados) {
      return {
        mensaje:
          'Se han creado exitosamente ' +
          arregloDocentes.length +
          ' docentes. Se envió un correo electrónico con la clave de acceso a cada uno de los docentes.',
        docentesIngresados: arregloDocentes,
      };
    } else {
      //Crear un arreglo con los nombres de los docentes duplicados
      const nombresDocentesDuplicados = docentesNoGuardados.map((docente) => {
        return docente.nombreCompleto;
      });
      const nombresImprimibles = nombresDocentesDuplicados.join(', ');

      return {
        mensaje:
          'Se han creado exitosamente ' +
          arregloDocentesCreados.length +
          ' docentes y se ha enviado un correo electrónico con la clave de acceso a cada uno. No se pudo crear a los docentes: ' +
          nombresImprimibles +
          ', ya que, existen dentro del sistema.',
        docentesIngresados: arregloDocentesCreados,
        docentesNoIngresados: docentesNoGuardados,
      };
    }
  }

  /* ====================================================================================================================== */
  /* =================================== OBTENER UN DOCENTE POR ID EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  async obtenerDocentePorID(
    idDocente: string,
  ): Promise<DocenteEntity | NotFoundException> {
    const docente = await this.docenteRepository.findOne({
      where: { id: idDocente },
    });
    if (docente) {
      return docente;
    } else {
      return new NotFoundException(
        `No existe el docente con el id ${idDocente}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* =========================== OBTENER UN DOCENTE POR CORREO ELECTRÓNICO EN LA BASE DE DATOS ============================ */
  /* ====================================================================================================================== */

  async obtenerDocentePorCorreoElectronico(
    correoElectronicoDocente: string,
  ): Promise<DocenteEntity | NotFoundException> {
    const docente = await this.docenteRepository.findOne({
      where: { correoElectronico: correoElectronicoDocente },
    });
    if (docente) {
      return docente;
    } else {
      return new NotFoundException(
        `No existe el docente con el correo electrónico ${correoElectronicoDocente}`,
      );
    }
  }

  /* ====================================================================================================================== */
  /* ===================================== ACTUALIZAR UN DOCENTE EN LA BASE DE DATOS ====================================== */
  /* ====================================================================================================================== */

  async actualizarDocentePorID(
    idDocente: string,
    docenteDto: DocenteDto,
  ): Promise<UpdateResult | NotFoundException> {
    const docente = await this.obtenerDocentePorID(idDocente);
    if (docente) {
      return await this.docenteRepository.update(idDocente, docenteDto);
    } else {
      return new NotFoundException(`No existe el docente con id ${idDocente}`);
    }
  }

  /* ====================================================================================================================== */
  /* ====================================== ELIMINAR UN DOCENTE EN LA BASE DE DATOS ======================================= */
  /* ====================================================================================================================== */

  async eliminarDocentePorID(
    idDocente: string,
  ): Promise<DeleteResult | NotFoundException> {
    const docente = await this.obtenerDocentePorID(idDocente);
    const rolDocente = await this.rolService.obtenerRolPorNombre(
      RolesEnum.DOCENTE,
    );
    if (
      !(rolDocente instanceof NotFoundException) &&
      !(docente instanceof NotFoundException)
    ) {
      const usuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(
        docente.correoElectronico,
      );
      if (!(usuario instanceof NotFoundException)) {
        await this.docenteRepository.delete(idDocente);
        await this.rolUsuarioService.eliminarRolUsuario(rolDocente, usuario);
        const rolesUsuario =
          await this.rolUsuarioService.obtenerRolUsuarioSegunIdUsuario(
            usuario.id,
          );
        if (rolesUsuario.length == 0) {
          return await this.usuarioService.eliminarUsuarioPorID(usuario.id);
        }
      } else {
        return new NotFoundException(
          `No se pudo eliminar el rol y usuario del docente con id ${idDocente}`,
        );
      }
    } else {
      return new NotFoundException(`No existe el docente con id ${idDocente}`);
    }
  }

  /* ====================================================================================================================== */
  /* ================================== OBTENER TODOS LOS DOCENTES EN LA BASE DE DATOS ==================================== */
  /* ====================================================================================================================== */

  async obtenerDocentes(): Promise<DocenteEntity[]> {
    return this.docenteRepository.find();
  }
}
