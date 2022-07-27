import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UsuarioDto {
    @ApiProperty()
    @IsString()
    public readonly id: string;

    @ApiProperty()
    @IsEmail()
    public readonly correo: string;

    @ApiProperty()
    @IsString()
    public readonly clave: string;
}

export class CrearUsuarioDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    public readonly correo: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public readonly clave: string;
}

export class ObtenerUsuarioDto {
    @ApiProperty()
    @IsString()
    public readonly id: string

    @ApiProperty()
    @IsEmail()
    public readonly correo: string
}