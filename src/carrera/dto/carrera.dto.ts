import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CarreraDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    duracion: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    modalidad: string;
}