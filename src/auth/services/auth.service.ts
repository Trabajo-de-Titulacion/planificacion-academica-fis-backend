import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../../../src/usuarios/services/usuario.service';
import { CredencialesDto } from '../dtos/credenciales.dto';
import * as bcrypt from 'bcrypt';
import { PayloadToken } from '../models/token.model';
import { JwtService } from '@nestjs/jwt';
import RolUsuarioService from './rol-usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private servicioUsuario: UsuarioService,
    private rolUsuarioService: RolUsuarioService,
    private jwtServicio: JwtService,
  ) {}

  async validarUsuario(credencialesUsuario: CredencialesDto) {
    const usuario = await this.servicioUsuario.obtenerUsuarioPorSuCorreo(
      credencialesUsuario.correo,
    );
    if (usuario) {
      return (await bcrypt.compare(credencialesUsuario.clave, usuario.clave))
        ? { id: usuario.id, correo: usuario.correo }
        : null;
    } else {
      return null;
    }
  }

  async generarJWT(credencialesUsuario: CredencialesDto) {
    const usuario = await this.servicioUsuario.obtenerUsuarioPorSuCorreo(
      credencialesUsuario.correo,
    );
    if (usuario) {
      if (await bcrypt.compare(credencialesUsuario.clave, usuario.clave)) {
        // Obtener roles del usuario
        const rolesUsuario =
          await this.rolUsuarioService.obtenerRolUsuarioSegunIdUsuario(
            usuario.id,
          );
        const roles = [];
        rolesUsuario.forEach((rolUsuario) => {
          roles.push(rolUsuario.rol.nombre);
        });

        // Generar token
        const payload: PayloadToken = { sub: usuario.id };
        return {
          access_token: this.jwtServicio.sign(payload),
          usuario: {
            correo: usuario.correo,
            roles: roles,
          },
        };
      }
    }
    return {
      statusCode: 401,
      message: 'not allow',
      error: 'Unauthorized',
    };
  }

  verificarToken(token: string): PayloadToken {
    try {
      return this.jwtServicio.verify(token) as PayloadToken;
    } catch {
      throw new HttpException('Token no válido', HttpStatus.BAD_REQUEST);
    }
  }
}
