import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerarHorarioDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
