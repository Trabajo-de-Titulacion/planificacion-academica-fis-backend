import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JornadaLaboralDto } from "../dtos/jornada-laboral.dto";
import { JornadaLaboralEntity } from "../entities/jornada-laboral.entity";
import { SemestreService } from "./semestre.service";


@Injectable()
export class JornadaLaboralService{
    constructor(
        @InjectRepository(JornadaLaboralEntity) private repositorioJornadaLaboral : Repository<JornadaLaboralEntity>,
        private servicioSemestre : SemestreService
    ){}

    async crearJornadaLaboral(jornada : JornadaLaboralDto){
        const jornadaLaboralACrear = this.repositorioJornadaLaboral.create(jornada);
        const semestre = await this.servicioSemestre.obtenerSemestrePorSuID(jornada.idSemestre);
        if(semestre){
            jornadaLaboralACrear.semestre = semestre;
            this.repositorioJornadaLaboral.save(jornadaLaboralACrear);
        }else {
            return new NotFoundException("No se ha creado la jornada laboral");
        }
    }

    async obtenerJornadasLaborales(){
        return this.repositorioJornadaLaboral.find({relations: ["semestre"]});
    }

    async obtenerJornadaLaboralPorSemestre(idSemestre : string){
        return this.repositorioJornadaLaboral.find({where: {semestre: {id: idSemestre}}})
    }

    async obtenerIntervalos(idJornada : string){
        const jornada = await this.repositorioJornadaLaboral.findOne(idJornada);
        const horaInicio = jornada.horaInicio.split(':').map(tiempo => parseInt(tiempo))[0];
        const horaFin = jornada.horaFin.split(':').map(tiempo => parseInt(tiempo))[0];
        const horaAlmuerzo = jornada.horaAlmuerzo.split(':').map(tiempo => parseInt(tiempo))[0];

        const fecha = '08/08/2022';

        const fechaReferencialInicio = new Date(fecha);
        fechaReferencialInicio.setHours(horaInicio,0,0);

        const fechaReferencialFinal = new Date(fecha);
        fechaReferencialFinal.setHours(horaFin,0,0);

        const horas = fechaReferencialFinal.getHours()-fechaReferencialInicio.getHours();

        const intervalos = []
        const formatoMinutos = ":00";

        if(horas > 0 && horaInicio < horaAlmuerzo && horaAlmuerzo < horaFin){
            for (let hora = horaInicio; hora < horaFin; hora++) {
                if(hora != horaAlmuerzo){
                    intervalos.push([`${hora}${formatoMinutos}`,`${hora+1}${formatoMinutos}`])
                }
            }
            return intervalos;
        }else{
            return [];
        }
    }
}