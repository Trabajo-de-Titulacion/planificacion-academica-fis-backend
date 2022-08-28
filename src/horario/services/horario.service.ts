import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HorarioDto } from "../dto/horario.dto";
import { HorarioEntity } from "../entities/horario.entity";

@Injectable()
export class HorarioService{

    constructor(
        @InjectRepository(HorarioEntity) private repositorioHorario : Repository<HorarioEntity>
    ){}

    crearHorario(horario : HorarioDto){
        this.repositorioHorario.create(horario);
    }
}