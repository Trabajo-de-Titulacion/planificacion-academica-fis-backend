import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, Min, Max } from "class-validator";

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
    @IsInt()
    @Min(3)
    @Max(200)
    @IsNotEmpty()
    aforo: number;
}