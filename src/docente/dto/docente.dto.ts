import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class DocenteDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombreCompleto: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Matches(/[a-z]+.[a-z]+[0-9]*@epn.edu.ec/)
    correoElectronico: string;

}