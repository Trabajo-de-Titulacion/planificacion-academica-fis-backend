import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SemestreDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[A-Z]{1}/)
  @ApiProperty()
  abreviatura: string;

  constructor(semestre: string) {
    this.abreviatura = semestre;
  }
}
