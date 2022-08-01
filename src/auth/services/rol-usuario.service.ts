import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioService } from "src/usuarios/services/usuario.service";
import { Repository } from "typeorm";
import { RolUsuarioDto } from "../dtos/rol-usuario";
import { RolUsuarioEntity } from "../entities/rol-usuario.entity";
import { RolService } from "./rol.service";

@Injectable()
export default class RolUsuarioService{

    constructor(
        @InjectRepository(RolUsuarioEntity) private repositorioRolUsuario : Repository<RolUsuarioEntity>,
        private servicioUsuario : UsuarioService,
        private servicioRol : RolService
    ){}

    async obtenerRolesUsuarios(){
        return this.repositorioRolUsuario.find();
    }

    async obtenerRolUsuarioSegunIdUsuario(idUsuario : string){
        return this.repositorioRolUsuario.find({
            where: {
                usuario: this.servicioUsuario.obtenerUsuarioPorSuID(idUsuario),
            }
        })
    }

    async crearRolUsuario( rolUsuario : RolUsuarioDto){
        const rol = await this.servicioRol.obtenerRolPorSuID(rolUsuario.idRol);
        const usuario = await this.servicioUsuario.obtenerUsuarioCompletoPorSuID(rolUsuario.idUsuario);
        const rolUsuarioACrear = this.repositorioRolUsuario.create();
        if (rol && usuario) {
            rolUsuarioACrear.rol = rol;
            rolUsuarioACrear.usuario = usuario;
            return this.repositorioRolUsuario.save(rolUsuarioACrear);
        }else {
            return new NotFoundException(`No se pudo crear el RolUsuario`);
        }
    }

    async  eliminarRolUsuario(idRol : string){
        return this.repositorioRolUsuario.delete(idRol);
    }
}