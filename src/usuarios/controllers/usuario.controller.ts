import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../../src/config/swagger-config';
import { CrearUsuarioDTO, ObtenerUsuarioDto } from '../dtos/usuario.dto';
import { UsuarioService } from '../../../src/usuarios/services/usuario.service';

@ApiTags(configuraciones.controladores.usuario.tag)
@Controller(configuraciones.controladores.usuario.ruta)
export class UsuariosController {

    constructor(
        private usuarioService: UsuarioService,
    ) { }

    @ApiOperation({ summary: configuraciones.controladores.usuario.operaciones.obtenerUsuarios.descripcion })
    @Get(configuraciones.controladores.usuario.operaciones.obtenerUsuarios.ruta)
    async obtenerUsuarios(): Promise<ObtenerUsuarioDto[]> {
        return await this.usuarioService.obtenerUsuarios();
    }

    @ApiOperation({ summary: configuraciones.controladores.usuario.operaciones.crearUsuario.descripcion })
    @Post(configuraciones.controladores.usuario.operaciones.crearUsuario.ruta)
    async crearUsuario(@Body() usuario: CrearUsuarioDTO) {
        const { correo, ...propiedades } = await this.usuarioService.crearUsuario(usuario);
        return correo;
    }

    @ApiOperation({ summary: configuraciones.controladores.usuario.operaciones.obtenerUsuarioCompletoPorSuID.descripcion })
    @Get(configuraciones.controladores.usuario.operaciones.obtenerUsuarioCompletoPorSuID.ruta)
    async obtenerUsuarioCompletoPorSuID(@Param('id') id: string) {
        return this.usuarioService.obtenerUsuarioCompletoPorSuID(id);
    }

}