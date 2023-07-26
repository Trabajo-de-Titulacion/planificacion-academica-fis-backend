import { Controller, Get } from "@nestjs/common";
import { ExperimentacionService } from "./experimentacion.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";

@ApiTags("Modulo de Nicolas")
@Controller("estudiante")
export class ExperimentacionController{
    constructor(private experimentacionService:ExperimentacionService){

    }

    @Public()
    @Get("")
    obtenerSaludoAlejo(){
        return this.experimentacionService.getInfoAlejo();
    }

    @Public()
    @Get("info")
    obtenerInfo(){
        return this.experimentacionService.getInfo();
    }
}