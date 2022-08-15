import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { DocenteEntity } from '../../../src/docente/entities/docente.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/services/auth.service';
import { HorasNoDisponiblesDTO } from '../dto';
import { HorasNoDisponiblesService } from '../services/horas_no_disponibles.service';

@Injectable()
export class VerificarIdDocentePorCuerpoGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        @InjectRepository(DocenteEntity)
        private docenteRepository: Repository<DocenteEntity>,
        private horasNoDisponiblesService: HorasNoDisponiblesService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener token
        const access_token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
        
        // Obtener id del usuario a partir del token verificado
        const { sub } = this.authService.verificarToken(access_token);

        // Obtener cuerpo (POST)
        const body = context.switchToHttp().getRequest().body;
        if (body) {
            // Comprobar que sea un arreglo de Horas No Disponibles
            await this.horasNoDisponiblesService.comprobarArregloDeHorasNoDisponibles(body);

            const horasNoDisponibles = body as HorasNoDisponiblesDTO[];

            const mismoIdDocente = horasNoDisponibles.every(horaDTO => {
                return horaDTO.docente_id == horasNoDisponibles[0].docente_id;
            });

            if (!mismoIdDocente) {
                throw new HttpException('El id del docente debe ser el mismo en cada elemento del arreglo.', HttpStatus.BAD_REQUEST);
            }

            const idDocente = horasNoDisponibles[0].docente_id;

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

        return false;
    }
}