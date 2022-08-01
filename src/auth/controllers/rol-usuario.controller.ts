import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolUsuarioDto } from "../dtos/rol-usuario";
import RolUsuarioService from "../services/rol-usuario.service";

@ApiTags("Roles de los usuarios")
@Controller("api/rolesusuarios")
export class RolUsuarioController{
    constructor(
        private servicioRolUsuaio : RolUsuarioService
    ){}

    @Get("obtenerRolesUsuarios")
    async obtenerRolesUsuarios(){
        return this.servicioRolUsuaio.obtenerRolesUsuarios()
    }

    @Get("obtenerRolesUsuarios")
    async obtenerRolUsuarioSegunIdUsuario(idUsuario :  string){
        return this.servicioRolUsuaio.obtenerRolUsuarioSegunIdUsuario(idUsuario);
    }

    @Post("crearRolUsuario")
    async crearRolUsuario(@Body() rolUsuario : RolUsuarioDto){
        return this.servicioRolUsuaio.crearRolUsuario(rolUsuario);
    }

    @Delete("eliminarRolUsuario")
    async eliminarRolUsuario(idRolUsuario : string){
        return this.servicioRolUsuaio.eliminarRolUsuario(idRolUsuario);
    }
}