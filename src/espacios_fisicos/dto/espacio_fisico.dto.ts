import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class EspacioFisicoDTO {

    constructor(nombre: string, tipo: string, aforo: number) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.aforo = aforo;
    }

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsNumber()
    @IsNotEmpty()
    aforo: number;
}