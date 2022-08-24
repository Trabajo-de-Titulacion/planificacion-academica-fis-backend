import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class RolUsuarioDto {
    @Column()
    @IsNotEmpty()
    @ApiProperty()
    public idUsuario : string;

    @Column()
    @IsNotEmpty()
    @ApiProperty()
    public idRol : string;
}