import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FacultadDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public nombre: string;
}
