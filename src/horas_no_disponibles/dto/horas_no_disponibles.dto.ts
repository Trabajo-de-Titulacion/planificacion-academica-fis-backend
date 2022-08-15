import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class HorasNoDisponiblesDTO {
    
    constructor(docente_id: string, dia_id: string, hora_inicio: number) {
        this.dia_id = dia_id;
        this.hora_inicio = hora_inicio;
        this.docente_id = docente_id
    }

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dia_id: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Max(24)
    @IsNotEmpty()
    hora_inicio: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    docente_id: string;
}