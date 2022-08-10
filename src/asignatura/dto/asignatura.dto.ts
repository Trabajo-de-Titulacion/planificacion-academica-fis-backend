import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class AsignaturaDto {

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    creditos: number;

    @IsNotEmpty()
    codigoRequisito: string[];

    @IsString()
    @IsNotEmpty()
    codigoCorrequisito: string[];
}