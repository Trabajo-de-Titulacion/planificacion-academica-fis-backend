import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class AsignaturaDto {

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
    creditos: number;

    @IsString()
    @IsNotEmpty()
    codigoRequisito: string[];

    @IsString()
    @IsNotEmpty()
    codigoCorrequisito: string[];
}