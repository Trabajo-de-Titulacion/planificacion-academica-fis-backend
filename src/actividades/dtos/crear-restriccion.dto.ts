import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CrearRestriccionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idActividad: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idEspacioFisico: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dia: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hora: string;
}