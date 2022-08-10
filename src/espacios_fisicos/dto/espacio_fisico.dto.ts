import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class EspacioFisicoDTO {

    constructor(nombre: string, tipo_id: string, aforo: number) {
        this.nombre = nombre;
        this.tipo_id = tipo_id;
        this.aforo = aforo;
    }

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tipo_id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    aforo: number;
}