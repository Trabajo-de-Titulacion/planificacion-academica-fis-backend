import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthService } from '../services/auth.service';
import RolUsuarioService from '../services/rol-usuario.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private rolUsuarioService: RolUsuarioService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!rolesRequeridos) {
      return true;
    }
    // Obtener token
    const access_token = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.split(' ')[1];

    // Obtener id del usuario a partir del token verificado
    const { sub } = this.authService.verificarToken(access_token);

    // Obtener roles del usuario
    const rolesUsuario =
      await this.rolUsuarioService.obtenerRolUsuarioSegunIdUsuario(sub);
    const roles = [];
    rolesUsuario.forEach((rolUsuario) => {
      roles.push(rolUsuario.rol.nombre);
    });

    // Comparar roles requeridos y roles del usuario
    return rolesRequeridos.some((rol) => roles?.includes(rol));
  }
}
