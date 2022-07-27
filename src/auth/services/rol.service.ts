import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RolDto } from '../dtos/rol.dto';
import { RolEntity } from '../entities/rol.entity';

@Injectable()
export class RolService {

    constructor(
        @InjectRepository(RolEntity) private repositorioRol: Repository<RolEntity>
    ) { }

    async obtenerRoles(): Promise<RolEntity[]> {
        return this.repositorioRol.find();
    }

    async crearRol(rol: RolDto): Promise<RolEntity> {
        return await this.repositorioRol.save(rol);
    }

    async actualizarRol(idRol: string, rolModificado: RolDto): (Promise<UpdateResult | NotFoundException>) {
        const rol = await this.repositorioRol.findOne(idRol);
        if (rol) {
            return await this.repositorioRol.update(idRol, rolModificado);
        } else {
            return new NotFoundException(`No existe el rol con id ${idRol}`)
        }
    }

    async eliminarRol(idRol: string): (Promise<DeleteResult | NotFoundException>) {
        const rol = await this.repositorioRol.findOne(idRol);
        if (rol) {
            return await this.repositorioRol.delete(idRol);
        } else {
            return new NotFoundException(`No existe el rol con id ${idRol}`)
        }
    }

}
