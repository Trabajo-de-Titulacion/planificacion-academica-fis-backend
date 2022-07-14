import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CarreraDto {

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    id: string;

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