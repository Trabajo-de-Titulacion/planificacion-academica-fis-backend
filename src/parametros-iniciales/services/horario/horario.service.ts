import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HorarioDTO } from 'src/parametros-iniciales/dtos/horario.dto';
import { HorarioEntity } from '../../../../src/parametros-iniciales/entities/horario.entity';
import DIAS from 'src/parametros-iniciales/types/dia.type';
import { Repository } from 'typeorm';

@Injectable()
export class HorarioService {

    constructor(
         @InjectRepository(HorarioEntity) private _repoHorario : Repository<HorarioEntity>
    ){}


    async registrarHorario(horario : HorarioDTO) : Promise<HorarioEntity>{
        return this._repoHorario.save(horario);
    }

    async calcularHorasLaborablesDeUnDia(dia : DIAS) : Promise<number>{
        const horarioDiaLaboral = await this._repoHorario.findOne({ dia: dia})
        const horaInicio = horarioDiaLaboral.horaInicio.split(':')[0];
        const horaFin = horarioDiaLaboral.horaFin.split(':')[0];
        return parseInt(horaFin) - parseInt(horaInicio);
    }

}
