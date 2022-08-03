import { IsNotEmpty, IsString } from "class-validator";
import DIAS from "../types/dia.type";

export class HorarioDTO {

    @IsNotEmpty()
    @IsString()
    dia : DIAS

    @IsString()
    @IsNotEmpty()
    horaDeInicio : string

    @IsString()
    @IsNotEmpty()
    horaFin : string

    constructor(dia: DIAS, horaInicio: string, horaFin: string){
        this.dia = dia;
        this.horaDeInicio = horaInicio;
        this.horaFin = horaFin;
    }


}    