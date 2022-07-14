import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DocenteDto {

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    id: string;

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