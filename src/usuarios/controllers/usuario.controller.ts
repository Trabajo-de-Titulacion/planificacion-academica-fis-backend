import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { swagger } from 'src/utils/configuraciones-globales';
import { CrearUsuarioDTO, ObtenerUsuarioDto, UsuarioDto } from '../dtos/usuario.dto';
import { UsuarioService } from '../services/usuario.service';

@ApiTags(swagger.controladores.usuario.tag)
@Controller(swagger.controladores.usuario.ruta)
export class UsuariosController {

    constructor(
        private usuarioService : UsuarioService,
    ){}

    @ApiOperation({summary: swagger.controladores.usuario.operaciones.obtenerUsuarios.descripcion})
    @Get(swagger.controladores.usuario.operaciones.obtenerUsuarios.ruta)
    async obtenerUsuarios() : Promise<ObtenerUsuarioDto[]>{
        return await this.usuarioService.obtenerUsuarios();
    }

    @ApiOperation({summary: swagger.controladores.usuario.operaciones.crearUsuario.descripcion})
    @Post(swagger.controladores.usuario.operaciones.crearUsuario.ruta)
    async crearUsuario(@Body() usuario: CrearUsuarioDTO) {
        const {correo, ...propiedades} = await this.usuarioService.crearUsuario(usuario);
        return correo;
    }
}