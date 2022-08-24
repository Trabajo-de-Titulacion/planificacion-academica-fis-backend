import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { DocenteEntity } from '../../../src/docente/entities/docente.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class VerificarIdDocentePorParametroGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        @InjectRepository(DocenteEntity)
        private docenteRepository: Repository<DocenteEntity>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener token
        const access_token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
        
        // Obtener id del usuario a partir del token verificado
        const { sub } = this.authService.verificarToken(access_token);

        // Obtener parámetros (GET, DELETE)
        const parametros = context.switchToHttp().getRequest().params;
        if (parametros) {
            if (parametros.id) {
                const idDocente = parametros.id;
                if (!isUUID(idDocente)) {
                    throw new HttpException('ID de docente inválido', HttpStatus.BAD_REQUEST);
                }
                const docente = await this.docenteRepository.findOne({
                    where: { id: idDocente },
                    relations: ['usuario']
                });
                if (docente instanceof DocenteEntity) {
                    // Si el usuario que hace la solicitud es igual al usuario cuya información quiere ver
                    return docente.usuario.id == sub;
                }
            }
        }

        return false;
    }
}