import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HorasNoDisponiblesDTO {
    
    constructor(docente_id: string, dia: string, hora_inicio: number) {
        this.dia = dia;
        this.hora_inicio = hora_inicio;
        this.docente_id = docente_id
    }

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dia: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    hora_inicio: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    docente_id: string;
}