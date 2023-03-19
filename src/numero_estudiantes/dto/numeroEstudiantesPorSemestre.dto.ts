import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min, Max } from 'class-validator';

export class NumeroEstudiantesPorSemestreDTO {
  constructor(
    idSemestre: string,
    idAsignatura: string,
    numeroEstudiantes: number,
  ) {
    this.idSemestre = idSemestre;
    this.idAsignatura = idAsignatura;
    this.numeroEstudiantes = numeroEstudiantes;
  }

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idSemestre: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idAsignatura: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(200)
  numeroEstudiantes: number;
}
