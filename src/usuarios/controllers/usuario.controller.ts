import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { configuraciones } from '../../../src/config/swagger-config';
import { CrearUsuarioDTO, ObtenerUsuarioDto } from '../dtos/usuario.dto';
import { UsuarioService } from '../../../src/usuarios/services/usuario.service';
import { Public } from '../../../src/auth/decorators/public.decorator';

//@ApiBearerAuth('defaultBearerAuth')
@ApiTags(configuraciones.controladores.usuario.tag)
@Controller(configuraciones.controladores.usuario.ruta)
export class UsuariosController {
  constructor(private usuarioService: UsuarioService) {}

  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.usuario.operaciones.obtenerUsuarios
        .descripcion,
  })
  @Get(configuraciones.controladores.usuario.operaciones.obtenerUsuarios.ruta)
  async obtenerUsuarios(): Promise<ObtenerUsuarioDto[]> {
    return await this.usuarioService.obtenerUsuarios();
  }

  @Public()
  @ApiOperation({
    summary:
      configuraciones.controladores.usuario.operaciones.crearUsuario
        .descripcion,
  })
  @Post(configuraciones.controladores.usuario.operaciones.crearUsuario.ruta)
  async crearUsuario(@Body() usuario: CrearUsuarioDTO) {
    const { correo } = await this.usuarioService.crearUsuario(usuario);
    Logger.log(`Se ha creado el usuario exitosamente ${correo}`);
    return correo;
  }

  @ApiOperation({
    summary:
      configuraciones.controladores.usuario.operaciones
        .obtenerUsuarioCompletoPorSuID.descripcion,
  })
  @Get(
    configuraciones.controladores.usuario.operaciones
      .obtenerUsuarioCompletoPorSuID.ruta,
  )
  async obtenerUsuarioCompletoPorSuID(@Param('id') id: string) {
    return this.usuarioService.obtenerUsuarioCompletoPorSuID(id);
  }
}
