import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class HoraDiaNoDisponibleDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jornada_id: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(24)
  @IsNotEmpty()
  hora_inicio: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  docente_id: string;
}
