import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { RolDto } from '../dtos/rol.dto';
import { RolService } from '../services/rol.service';

//@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Roles')
@Controller('rol')
export class RolController {
  constructor(private readonly servicioRol: RolService) {}

  @Public()
  @ApiOperation({ summary: 'Método para obtener todos los roles' })
  @Get('/obtenerRoles')
  async obtenerRoles() {
    return await this.servicioRol.obtenerRoles();
  }

  @Public()
  @ApiOperation({ summary: 'Método para obtener todos los roles' })
  @Post('/crearRol')
  async crearRol(@Body() rol: RolDto) {
    return await this.servicioRol.crearRol(rol);
  }

  @ApiOperation({ summary: 'Método para actualizar todos los roles' })
  @Put('/actualizarRol/:id')
  async actualizarRol(@Param('id') id: string, @Body() rol: RolDto) {
    return this.servicioRol.actualizarRol(id, rol);
  }

  @ApiOperation({ summary: 'Método para eliminar un rol a través de su ID.' })
  @Delete('/eliminarRol/:id')
  async eliminarRol(@Param('id') id: string) {
    return await this.servicioRol.eliminarRol(id);
  }
}
