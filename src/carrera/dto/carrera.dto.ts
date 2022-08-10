import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CarreraDto {

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    duracion: number;

    @IsString()
    @IsNotEmpty()
    modalidad: string;
}