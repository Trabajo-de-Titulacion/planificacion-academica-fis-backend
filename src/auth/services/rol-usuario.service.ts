import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { Repository } from 'typeorm';
import { RolUsuarioDto } from '../dtos/rol-usuario';
import { RolUsuarioEntity } from '../../auth/entities/rol-usuario.entity';
import { RolService } from './rol.service';
import { UsuarioDto } from '../../usuarios/dtos/usuario.dto';
import { RolDto } from '../dtos/rol.dto';

@Injectable()
export default class RolUsuarioService {
  constructor(
    @InjectRepository(RolUsuarioEntity)
    private repositorioRolUsuario: Repository<RolUsuarioEntity>,
    private servicioUsuario: UsuarioService,
    private servicioRol: RolService,
  ) {}

  async obtenerRolesUsuarios() {
    return this.repositorioRolUsuario.find();
  }

  async obtenerRolUsuarioSegunIdUsuario(idUsuario: string) {
    return await this.repositorioRolUsuario.find({
      where: {
        usuario: await this.servicioUsuario.obtenerUsuarioPorSuID(idUsuario),
      },
      relations: ['rol'],
    });
  }

  async crearRolUsuario(rolUsuario: RolUsuarioDto) {
    const rol = await this.servicioRol.obtenerRolPorSuID(rolUsuario.idRol);
    const usuario = await this.servicioUsuario.obtenerUsuarioCompletoPorSuID(
      rolUsuario.idUsuario,
    );
    const rolUsuarioACrear = this.repositorioRolUsuario.create();
    if (rol && usuario) {
      rolUsuarioACrear.rol = rol;
      rolUsuarioACrear.usuario = usuario;
      return this.repositorioRolUsuario.save(rolUsuarioACrear);
    } else {
      return new NotFoundException(`No se pudo crear el RolUsuario`);
    }
  }

  async eliminarRolUsuario(rol: RolDto, usuario: UsuarioDto) {
    return await this.repositorioRolUsuario.delete({
      rol: rol,
      usuario: usuario,
    });
  }
}
