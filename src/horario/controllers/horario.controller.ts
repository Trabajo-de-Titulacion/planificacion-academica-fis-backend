import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HorarioDto } from "../dto/horario.dto";
import { HorarioService } from "../services/horario.service";

@ApiTags("Horarios")
@Controller("/api/horario")
export class HorarioController{

    constructor(
        private horarioService : HorarioService
    ){}
 
    @Post("crearHorario")
    crearHorario(@Body() horario : HorarioDto){
        this.horarioService.crearHorario(horario);
    }
}