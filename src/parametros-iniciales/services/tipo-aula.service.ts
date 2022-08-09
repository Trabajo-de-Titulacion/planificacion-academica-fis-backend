import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TipoAulaDto } from "../dtos/tipo-aula.dto";
import { TipoAulaEntity } from "../entities/tipo-aula.entity";
import { FacultadService } from "./facultad.service";

@Injectable()
export class TipoAulaService {
    
    constructor(
        @InjectRepository(TipoAulaEntity) private tipoAulaRepository : Repository<TipoAulaEntity>,
        private servicioFacultad : FacultadService
        ){}

    async crearTipoAula(tipoAula : TipoAulaDto){
        const facultad = await this.servicioFacultad.obtenerFacultadPorSuID(tipoAula.idFacultad);
        if(facultad){
            const nuevoTipoAula = this.tipoAulaRepository.create(tipoAula);
            nuevoTipoAula.facultad = facultad;
            return this.tipoAulaRepository.save(nuevoTipoAula);
        }else{
            return new NotFoundException('Error en crear un tipo de aula');
        }
    }
    
    async obtenerTipoAulas(){
        return this.tipoAulaRepository.find({relations: ['facultad']});
    }
}