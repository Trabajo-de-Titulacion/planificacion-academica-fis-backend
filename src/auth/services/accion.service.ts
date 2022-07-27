import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AccionDto } from '../dtos/accion.dto';
import { RolDto } from '../dtos/rol.dto';
import { AccionEntity } from '../entities/accion.entity';
import { RolService } from './rol.service';

@Injectable()
export class AccionService {

    constructor(
        @InjectRepository(AccionEntity) private repositorioAccion: Repository<AccionEntity>,
        private servicioRol : RolService
    ) { }

    async obtenerAcciones(): Promise<AccionEntity[]> {
        return await this.repositorioAccion.find({relations: ["rol"]});
    }

    async obtenerAccionesPorRol(idRol : string): Promise<AccionEntity[]> {
        return await this.repositorioAccion.find({
            where: {
                rol: {
                    id: idRol,
                }
            }
        });
    }

    async crearAccion(data : AccionDto): Promise<AccionEntity> {
        const accion = this.repositorioAccion.create(data);
        accion.rol = await this.servicioRol.obtenerRolPorSuID(data.idRol);
        return this.repositorioAccion.save(accion);
    }
/*
    async actualizarRol(idRol: string, rolModificado: RolDto): (Promise<UpdateResult | NotFoundException>) {
        const rol = await this.repositorioAccion.findOne(idRol);
        if (rol) {
            return await this.repositorioAccion.update(idRol, rolModificado);
        } else {
            return new NotFoundException(`No existe el rol con id ${idRol}`)
        }
    }

    async eliminarRol(idRol: string): (Promise<DeleteResult | NotFoundException>) {
        const rol = await this.repositorioAccion.findOne(idRol);
        if (rol) {
            return await this.repositorioAccion.delete(idRol);
        } else {
            return new NotFoundException(`No existe el rol con id ${idRol}`)
        }
    }
*/
}
