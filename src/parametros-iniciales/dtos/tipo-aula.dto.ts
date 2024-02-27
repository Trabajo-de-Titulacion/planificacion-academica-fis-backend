import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TipoAulaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public tipo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public idFacultad: string;
}
