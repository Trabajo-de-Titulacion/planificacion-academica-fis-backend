import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class EspacioFisicoDTO {

    constructor(nombre: string, tipo: string, aforo: number) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.aforo = aforo;
    }

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    aforo: number;
}