import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import ROLES from 'src/utils/types/rol.type';

export class RolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/(DOCENTE)|(COORDINADOR)|(ASISTENTE_ACADEMICO)|(SUBDECANO)|(GESTOR DE ESPACIOS)/)
  public readonly nombre: ROLES;
}
