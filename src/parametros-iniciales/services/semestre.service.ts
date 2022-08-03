import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SemestreDTO } from "../dtos/semestre.dto";
import { SemestreEntity } from "../entities/semestre.entity";

@Injectable()
export class SemestreService {
    
    constructor(
        @InjectRepository(SemestreEntity) private semestreRepository : Repository<SemestreEntity>
    ){}

    async crearSemestre(semestre : SemestreDTO){
        return this.semestreRepository.save(semestre);
    }
}