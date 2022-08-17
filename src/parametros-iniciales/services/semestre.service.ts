import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { SemestreDTO } from "../dtos/semestre.dto";
import { SemestreEntity } from "../entities/semestre.entity";
import ESTADO_SEMESTRE from "../types/estado-semestre.type";

@Injectable()
export class SemestreService {
    
    constructor(
        @InjectRepository(SemestreEntity) private semestreRepository : Repository<SemestreEntity>,
    ){}

    async crearSemestre(semestre : SemestreDTO){
        const semestreCreado = await this.semestreRepository.save(semestre);
        await this.semestreRepository.update(
            { id: Not(semestreCreado.id) }, // WHERE
            { estado: ESTADO_SEMESTRE.PLANIFICACION_CULMINADA } // SET
        );
        return semestreCreado;
    }

    async obtenerSemestrePorSuID(id : string){
        return this.semestreRepository.findOne(id);
    }

    async obtenerSemestres(){
        return this.semestreRepository.find();
    }
}