import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CredencialesDto {
    @IsEmail()
    @IsNotEmpty()
    public readonly correo : string;

    @IsString()
    @IsNotEmpty()
    public readonly clave : string;
}