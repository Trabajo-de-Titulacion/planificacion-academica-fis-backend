import { ApiProperty } from "@nestjs/swagger";

export class NivelDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nombre: string;
}