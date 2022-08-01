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
        private servicioRol: RolService
    ) { }

    async obtenerAcciones(): Promise<AccionEntity[]> {
        return await this.repositorioAccion.find({ relations: ["rol"] });
    }

    async obtenerAccionesPorRol(idRol: string): Promise<AccionEntity[]> {
        return await this.repositorioAccion.find({
            where: {
                rol: {
                    id: idRol,
                }
            }
        });
    }

    async crearAccion(data: AccionDto): Promise<AccionEntity> {
        const accion = this.repositorioAccion.create(data);
        accion.rol = await this.servicioRol.obtenerRolPorSuID(data.idRol);
        return this.repositorioAccion.save(accion);
    }

    async actualizarAccion(idAccion: string, accionModificada: AccionDto): (Promise<UpdateResult | NotFoundException>) {
        const accion = await this.repositorioAccion.findOne(idAccion);
        const rol = await this.servicioRol.obtenerRolPorSuID(accionModificada.idRol);
        if (rol && accion) {
            accion.rol = await this.servicioRol.obtenerRolPorSuID(accionModificada.idRol);
            accion.nombre = accionModificada.nombre;
            return await this.repositorioAccion.update(idAccion, accion);
        } else {
            return new NotFoundException(`No existe el rol con id ${idAccion}`)
        }
    }

    async eliminarAccion(idAccion: string) {
        const accion = await this.repositorioAccion.findOne(idAccion);
        if (accion) {
            return await this.repositorioAccion.delete(idAccion);
        } else {
            return new NotFoundException(`No existe la acción con id ${idAccion}`)
        }
    }
}
