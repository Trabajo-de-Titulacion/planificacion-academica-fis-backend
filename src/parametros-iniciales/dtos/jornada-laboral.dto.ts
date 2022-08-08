import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import DIAS from "../types/dia.type";

export class JornadaLaboralDto {
    @IsString()
    @IsEnum(DIAS)
    @IsNotEmpty()
    @ApiProperty()
    public dia : DIAS;

    @ApiProperty()
    @IsString()
    @Matches(/([0-2]{1})([0-9]{1})(:)([0-6]{1})([0-9]{1})/)
    @IsNotEmpty()
    horaInicio : string;

    @ApiProperty()
    @IsString()
    @Matches(/([0-1]{1})([0-9]{1})(:)([0-6]{1})([0-9]{1})/)
    @IsNotEmpty()
    horaAlmuerzo : string;

    @ApiProperty()
    @IsString()
    @Matches(/([0-2]{1})([0-9]{1})(:)([0-6]{1})([0-9]{1})/)
    @IsNotEmpty()
    horaFin : string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    idSemestre : string;
} 