import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class HorarioDto {
    @IsDateString()
    @IsNotEmpty()
    public fechaCreacion: Date

    @IsString()
    @IsNotEmpty()
    public horarioJson: string

    @IsString()
    @IsNotEmpty()
    public idUsuario: string

    @IsString()
    @IsNotEmpty()
    public descripcion: string
}    