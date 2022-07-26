import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DocenteDto {

    @IsString()
    @IsNotEmpty()
    nombreCompleto: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    codigoIngreso: string;
}