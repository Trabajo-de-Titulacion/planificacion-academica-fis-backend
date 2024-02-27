import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActualizarActividadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idAsignatura: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idDocente: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idTipoAula: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idGrupo: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duracion: number;
}
