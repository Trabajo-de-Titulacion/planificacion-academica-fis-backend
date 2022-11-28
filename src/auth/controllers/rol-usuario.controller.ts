import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsuarioDto } from '../../usuarios/dtos/usuario.dto';
import { Public } from '../decorators/public.decorator';
import { RolUsuarioDto } from '../dtos/rol-usuario';
import { RolDto } from '../dtos/rol.dto';
import RolUsuarioService from '../services/rol-usuario.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Roles de los usuarios')
@Controller('rolesusuarios')
export class RolUsuarioController {
  constructor(private servicioRolUsuaio: RolUsuarioService) {}

  @Get('obtenerRolesUsuarios')
  async obtenerRolesUsuarios() {
    return this.servicioRolUsuaio.obtenerRolesUsuarios();
  }

  @Get('obtenerRolUsuarioSegunIdUsuario/:id')
  async obtenerRolUsuarioSegunIdUsuario(@Param('id') idUsuario: string) {
    return await this.servicioRolUsuaio.obtenerRolUsuarioSegunIdUsuario(
      idUsuario,
    );
  }

  @Public()
  @Post('crearRolUsuario')
  async crearRolUsuario(@Body() rolUsuario: RolUsuarioDto) {
    return this.servicioRolUsuaio.crearRolUsuario(rolUsuario);
  }

  @Delete('eliminarRolUsuario')
  async eliminarRolUsuario(rol: RolDto, usuario: UsuarioDto) {
    return await this.servicioRolUsuaio.eliminarRolUsuario(rol, usuario);
  }
}
