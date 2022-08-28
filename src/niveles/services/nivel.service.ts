import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NivelDto } from "../dto/nivel.dto";
import { NivelEntity } from "../entities/nivel.entity";


@Injectable()
export class NivelService {

    constructor(
       @InjectRepository(NivelEntity) private nivelRepository : Repository<NivelEntity>
    ){}

    crearNivel(nivel : NivelDto){
        return this.nivelRepository.create(nivel);
    }

    async obtenerTodosLosNiveles(){
        return await this.nivelRepository.find();
    }

    async obtenerNivelPorNombre(nombre : string){
        return await this.nivelRepository.findOne({where: nombre})
    }

    eliminarNivel(idNivel : string){
        return this.nivelRepository.delete(idNivel);
    }
}