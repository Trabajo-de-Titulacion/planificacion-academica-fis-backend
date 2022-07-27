import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { RolDto } from "./rol.dto";

export class AccionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public nombre : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public idRol :  string;
}