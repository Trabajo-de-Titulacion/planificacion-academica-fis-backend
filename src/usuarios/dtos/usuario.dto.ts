import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UsuarioDto {
    @ApiProperty()
    @IsString()
    id: string

    @ApiProperty()
    @IsEmail()
    correo: string;

    @ApiProperty()
    @IsString()
    clave: string;
}

export class CrearUsuarioDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    clave: string;
}

export class ObtenerUsuarioDto {
    @ApiProperty()
    @IsString()
    id: string

    @ApiProperty()
    @IsEmail()
    correo: string
}