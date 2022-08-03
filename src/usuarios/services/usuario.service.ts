import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearUsuarioDTO, ObtenerUsuarioDto, UsuarioDto } from '../dtos/usuario.dto';
import { UsuarioEntity } from '../../../src/usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity) private repositorioUsuario: Repository<UsuarioEntity>
    ) { }

    async obtenerUsuarios(): Promise<ObtenerUsuarioDto[]> {
        const usuarios = await this.repositorioUsuario.find();
        let usuariosSinClave: ObtenerUsuarioDto[] = usuarios.map(
            usuario => {
                return {
                    id: usuario.id,
                    correo: usuario.correo,
                }
            }
        )
        return usuariosSinClave;
    }

    async obtenerUsuarioPorSuID(id: string) : Promise<ObtenerUsuarioDto>{
        const {clave, ...usuario} = await this.repositorioUsuario.findOne(id);
        return usuario;
    }

    async obtenerUsuarioCompletoPorSuID(id: string) : Promise<UsuarioEntity>{
        return await this.repositorioUsuario.findOne(id);
    }

    async obtenerUsuarioPorSuCorreo(correo: string) : Promise<UsuarioEntity>{
        return await this.repositorioUsuario.findOne({correo: correo});
    }

    async crearUsuario(usuario : CrearUsuarioDTO) : Promise<any>{
        const nuevoUsuario = this.repositorioUsuario.create(usuario);
        nuevoUsuario.clave = await bcrypt.hash(usuario.clave, 10);
        return this.repositorioUsuario.save(nuevoUsuario);
    }
}