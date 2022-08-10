import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FacultadDTO } from "../dtos/facultad.dto";
import { FacultadEntity } from "../entities/facultad.entity";

@Injectable()
export class FacultadService {
    
    constructor(
        @InjectRepository(FacultadEntity) private facultadRepository : Repository<FacultadEntity>
    ){}

    async crearFacultad(facultad : FacultadDTO){
        return this.facultadRepository.save(facultad);
    }

    async obtenerFacultadPorSuID(id : string){
        return this.facultadRepository.findOne(id);
    }

    async obtenerFacultadPorSuNombre(nombre : string){
        return this.facultadRepository.findOne({
            where: { nombre: nombre }
        });
    }

    async obtenerFacultades(){
        return this.facultadRepository.find();
    }
}