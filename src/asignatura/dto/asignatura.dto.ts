import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class AsignaturaDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    creditos: number;
}