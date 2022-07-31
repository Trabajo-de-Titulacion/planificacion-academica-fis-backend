import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class RolUsuarioDto {
    @Column()
    @IsNotEmpty()
    public idUsuario : string;

    @Column()
    @IsNotEmpty()
    public idRol : string;
}