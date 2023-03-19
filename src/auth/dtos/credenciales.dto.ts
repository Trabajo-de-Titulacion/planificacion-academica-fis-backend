import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredencialesDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public readonly correo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public readonly clave: string;
}
